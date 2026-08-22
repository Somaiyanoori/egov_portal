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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateService,
  useUpdateService,
  useAllDepartments,
} from "@/hooks/use-admin";
import { localizeName } from "@/lib/i18n-helpers";
import type { Service } from "@/types";

const schema = z.object({
  name: z.string().min(2),
  nameFa: z.string().optional(),
  description: z.string().max(1000).optional(),
  fee: z.coerce.number().min(0),
  processingDays: z.coerce.number().int().min(1).max(365),
  departmentId: z.string().min(1),
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service | null;
}

export function ServiceFormDialog({ open, onOpenChange, service }: Props) {
  const { t } = useTranslation();
  const isEdit = !!service;
  const { data: deptsData } = useAllDepartments();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      nameFa: "",
      description: "",
      fee: 0,
      processingDays: 7,
      departmentId: "",
    },
  });

  useEffect(() => {
    if (service) {
      reset({
        name: service.name,
        nameFa: service.nameFa ?? "",
        description: service.description ?? "",
        fee: Number(service.fee),
        processingDays: service.processingDays,
        departmentId: service.departmentId,
      });
    } else {
      reset({
        name: "",
        nameFa: "",
        description: "",
        fee: 0,
        processingDays: 7,
        departmentId: "",
      });
    }
  }, [service, reset, open]);

  const onSubmit = (data: any) => {
    if (isEdit && service) {
      updateMutation.mutate(
        { id: service.id, ...data },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      createMutation.mutate(data, { onSuccess: () => onOpenChange(false) });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("services.editService") : t("services.createService")}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? t("services.updateServiceDesc")
              : t("services.createServiceDesc")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>
              {t("services.nameEn")} <span className="text-red-500">*</span>
            </Label>
            <Input error={!!errors.name} {...register("name")} />
            <FormMessage message={errors.name?.message} />
          </div>

          <div className="space-y-2">
            <Label>{t("services.nameFa")}</Label>
            <Input dir="rtl" {...register("nameFa")} />
          </div>

          <div className="space-y-2">
            <Label>{t("services.description")}</Label>
            <Textarea rows={3} {...register("description")} />
          </div>

          <div className="space-y-2">
            <Label>
              {t("services.department")} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watch("departmentId") || ""}
              onValueChange={(v) => setValue("departmentId", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("services.selectDepartment")} />
              </SelectTrigger>
              <SelectContent>
                {(deptsData?.data ?? []).map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {localizeName(d)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage message={errors.departmentId?.message} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                {t("services.fee")} <span className="text-red-500">*</span>
              </Label>
              <Input type="number" min="0" step="0.01" {...register("fee")} />
              <FormMessage message={errors.fee?.message} />
            </div>
            <div className="space-y-2">
              <Label>
                {t("services.processingDays")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                min="1"
                max="365"
                {...register("processingDays")}
              />
              <FormMessage message={errors.processingDays?.message} />
            </div>
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
