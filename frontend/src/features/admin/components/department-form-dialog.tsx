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
import { Textarea } from "@/components/ui/textarea";
import { FormMessage } from "@/components/ui/form-message";
import { useCreateDepartment, useUpdateDepartment } from "@/hooks/use-admin";
import type { Department } from "@/types";

const schema = z.object({
  name: z.string().min(2),
  nameFa: z.string().optional(),
  description: z.string().max(500).optional(),
  code: z.string().max(20).optional(),
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department?: Department | null;
}

export function DepartmentFormDialog({
  open,
  onOpenChange,
  department,
}: Props) {
  const { t } = useTranslation();
  const isEdit = !!department;
  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", nameFa: "", description: "", code: "" },
  });

  useEffect(() => {
    if (department) {
      reset({
        name: department.name,
        nameFa: department.nameFa ?? "",
        description: department.description ?? "",
        code: department.code ?? "",
      });
    } else {
      reset({ name: "", nameFa: "", description: "", code: "" });
    }
  }, [department, reset, open]);

  const onSubmit = (data: any) => {
    const payload = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== ""),
    );
    if (isEdit && department) {
      updateMutation.mutate(
        { id: department.id, ...payload },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createMutation.mutate(payload as any, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("departments.editDept") : t("departments.createDept")}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? t("departments.updateDeptDesc")
              : t("departments.createDeptDesc")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>
              {t("departments.nameEn")} <span className="text-red-500">*</span>
            </Label>
            <Input error={!!errors.name} {...register("name")} />
            <FormMessage message={errors.name?.message} />
          </div>

          <div className="space-y-2">
            <Label>{t("departments.nameFa")}</Label>
            <Input dir="rtl" {...register("nameFa")} />
          </div>

          <div className="space-y-2">
            <Label>{t("departments.code")}</Label>
            <Input
              placeholder={t("departments.codePlaceholder")}
              {...register("code")}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("departments.description")}</Label>
            <Textarea rows={3} {...register("description")} />
          </div>

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
