import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import type { User, Role } from "@/types";

const createSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
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
          <DialogTitle>{isEdit ? "Edit User" : "Create New User"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update user information"
              : "Add a new user to the system"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input error={!!errors.name} {...register("name")} />
              <FormMessage message={errors.name?.message as string} />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
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
              Password{" "}
              {isEdit && (
                <span className="text-xs text-[color:var(--muted-foreground)]">
                  (leave empty to keep current)
                </span>
              )}{" "}
              {!isEdit && "*"}
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
              <Label>Phone</Label>
              <Input {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label>National ID</Label>
              <Input {...register("nationalId")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Role *</Label>
            <Select
              value={role}
              onValueChange={(v) => setValue("role", v as Role)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CITIZEN">Citizen</SelectItem>
                <SelectItem value="OFFICER">Officer</SelectItem>
                <SelectItem value="HEAD">Department Head</SelectItem>
                <SelectItem value="ADMIN">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {needsDepartment && (
            <>
              <div className="space-y-2">
                <Label>Department *</Label>
                <Select
                  value={watch("departmentId") || ""}
                  onValueChange={(v) => setValue("departmentId", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {(deptsData?.data ?? []).map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Job Title</Label>
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
              Cancel
            </Button>
            <Button type="submit" variant="gradient" loading={isPending}>
              {isEdit ? "Update" : "Create"} User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
