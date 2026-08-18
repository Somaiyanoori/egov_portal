import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Send,
  Loader2,
  Info,
  DollarSign,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { FileUpload } from "../components/file-upload";
import { usePublicServices } from "@/hooks/use-services";
import { useCreateRequest } from "@/hooks/use-requests";
import { formatCurrency } from "@/lib/utils";

const schema = z.object({
  serviceId: z.string().min(1, "Please select a service"),
  notes: z.string().max(1000).optional(),
});

type FormData = z.infer<typeof schema>;

export function NewRequestPage() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const { data: servicesData, isLoading: servicesLoading } =
    usePublicServices();
  const createRequest = useCreateRequest();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const selectedServiceId = watch("serviceId");
  const services = servicesData?.data ?? [];
  const selectedService = services.find((s) => s.id === selectedServiceId);

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    formData.append("serviceId", data.serviceId);
    if (data.notes) formData.append("notes", data.notes);
    files.forEach((file) => formData.append("documents", file));

    createRequest.mutate(formData);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title={t("requests.newRequest")}
        description="Fill in the details to submit a new service request"
        action={
          <Button asChild variant="outline">
            <Link to="/app/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
            <CardDescription>
              Select a service and provide any additional information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Service Selection */}
            <div className="space-y-2">
              <Label htmlFor="serviceId">
                {t("requests.service")} <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => setValue("serviceId", value)}
                disabled={servicesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("requests.selectService")} />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      <div className="flex items-center justify-between gap-4 w-full">
                        <span>
                          {service.department?.name} — {service.name}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage message={errors.serviceId?.message} />
            </div>

            {/* Service Info */}
            {selectedService && (
              <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--accent)]/30 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Info className="h-4 w-4 text-[color:var(--primary)] mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">
                      {selectedService.name}
                    </h4>
                    {selectedService.description && (
                      <p className="text-xs text-[color:var(--muted-foreground)] mt-1">
                        {selectedService.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-2 border-t border-[color:var(--border)]">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="text-[color:var(--muted-foreground)]">
                      Fee:
                    </span>
                    <span className="font-semibold">
                      {Number(selectedService.fee) > 0
                        ? `${formatCurrency(Number(selectedService.fee))} AFN`
                        : "Free"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-[color:var(--muted-foreground)]">
                      Processing:
                    </span>
                    <span className="font-semibold">
                      {selectedService.processingDays} days
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">{t("requests.notes")}</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information you'd like to provide..."
                rows={4}
                error={!!errors.notes}
                {...register("notes")}
              />
              <FormMessage message={errors.notes?.message} />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>
                {t("requests.uploadDocs")}{" "}
                <span className="text-[color:var(--muted-foreground)] text-xs">
                  (optional)
                </span>
              </Label>
              <FileUpload files={files} onChange={setFiles} maxFiles={5} />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button asChild variant="outline" type="button">
            <Link to="/app/dashboard">Cancel</Link>
          </Button>
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            loading={createRequest.isPending}
          >
            <Send className="h-4 w-4" />
            {t("requests.submitRequest")}
          </Button>
        </div>
      </form>
    </div>
  );
}
