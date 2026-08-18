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
import type { Service } from "@/types";

const schema = z.object({
  name: z.string().min(2),
  nameFa: z.string().optional(),
  description: z.string().max(1000).optional(),
  fee: z.coerce.number().min(0),
  processingDays: z.coerce.number().int().min(1).max(365),
  departmentId: z.string().min(1, "Please select a department"),
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service | null;
}

export function ServiceFormDialog({ open, onOpenChange, service }: Props) {
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
            {isEdit ? "Edit Service" : "Create Service"}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? "Update service info" : "Add a new government service"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Name (English) *</Label>
            <Input error={!!errors.name} {...register("name")} />
            <FormMessage message={errors.name?.message} />
          </div>

          <div className="space-y-2">
            <Label>Name (Farsi)</Label>
            <Input dir="rtl" {...register("nameFa")} />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea rows={3} {...register("description")} />
          </div>

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
            <FormMessage message={errors.departmentId?.message} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fee (AFN) *</Label>
              <Input type="number" min="0" step="0.01" {...register("fee")} />
              <FormMessage message={errors.fee?.message} />
            </div>
            <div className="space-y-2">
              <Label>Processing Days *</Label>
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
              Cancel
            </Button>
            <Button type="submit" variant="gradient" loading={isPending}>
              {isEdit ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
