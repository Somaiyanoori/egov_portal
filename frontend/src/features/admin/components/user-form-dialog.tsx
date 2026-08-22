import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/ui/form-message";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateUser,
  useUpdateUser,
  useAllDepartments,
} from "@/hooks/use-admin";
import { localizeName } from "@/lib/i18n-helpers";
import type { User, Role } from "@/types";

const createSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["CITIZEN", "OFFICER", "HEAD", "ADMIN"]),
  phone: z.string().optional(),
  nationalId: z.string().optional(),
  departmentId: z.string().optional(),
  jobTitle: z.string().optional(),
});

const updateSchema = createSchema.extend({
  password: z.string().min(8).optional().or(z.literal("")),
});

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
}: UserFormDialogProps) {
  const { t } = useTranslation();
  const isEdit = !!user;
  const { data: deptsData } = useAllDepartments();
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isEdit ? updateSchema : createSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "CITIZEN" as Role,
      phone: "",
      nationalId: "",
      departmentId: "",
      jobTitle: "",
    },
  });

  const role = watch("role");
  const needsDepartment = role === "OFFICER" || role === "HEAD";

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
        phone: user.phone ?? "",
        nationalId: user.nationalId ?? "",
        departmentId: user.departmentId ?? "",
        jobTitle: user.jobTitle ?? "",
      });
    } else {
      reset({
        name: "",
        email: "",
        password: "",
        role: "CITIZEN",
        phone: "",
        nationalId: "",
        departmentId: "",
        jobTitle: "",
      });
    }
  }, [user, reset, open]);

  const onSubmit = (data: any) => {
    const payload = { ...data };
    if (!payload.password) delete payload.password;
    if (!payload.departmentId) delete payload.departmentId;

    if (isEdit && user) {
      updateMutation.mutate(
        { id: user.id, ...payload },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createMutation.mutate(payload, { onSuccess: () => onOpenChange(false) });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("users.editUser") : t("users.createUser")}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? t("users.updateUserDesc") : t("users.createUserDesc")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                {t("auth.fullName")} <span className="text-red-500">*</span>
              </Label>
              <Input error={!!errors.name} {...register("name")} />
              <FormMessage message={errors.name?.message as string} />
            </div>
            <div className="space-y-2">
              <Label>
                {t("auth.email")} <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                error={!!errors.email}
                {...register("email")}
              />
              <FormMessage message={errors.email?.message as string} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              {t("auth.password")}{" "}
              {isEdit ? (
                <span className="text-xs text-[color:var(--muted-foreground)]">
                  ({t("users.leaveEmpty")})
                </span>
              ) : (
                <span className="text-red-500">*</span>
              )}
            </Label>
            <Input
              type="password"
              autoComplete="new-password"
              error={!!errors.password}
              {...register("password")}
            />
            <FormMessage message={errors.password?.message as string} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("auth.phone")}</Label>
              <Input {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label>{t("auth.nationalId")}</Label>
              <Input {...register("nationalId")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              {t("users.userRole")} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={role}
              onValueChange={(v) => setValue("role", v as Role)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CITIZEN">{t("role.CITIZEN")}</SelectItem>
                <SelectItem value="OFFICER">{t("role.OFFICER")}</SelectItem>
                <SelectItem value="HEAD">{t("role.HEAD")}</SelectItem>
                <SelectItem value="ADMIN">{t("role.ADMIN")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {needsDepartment && (
            <>
              <div className="space-y-2">
                <Label>
                  {t("users.department")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watch("departmentId") || ""}
                  onValueChange={(v) => setValue("departmentId", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("users.selectDepartment")} />
                  </SelectTrigger>
                  <SelectContent>
                    {(deptsData?.data ?? []).map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {localizeName(d)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t("users.jobTitle")}</Label>
                <Input {...register("jobTitle")} />
              </div>
            </>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" variant="gradient" loading={isPending}>
              {isEdit ? t("common.update") : t("common.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
