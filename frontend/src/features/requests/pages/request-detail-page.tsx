import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Calendar,
  FileText,
  DollarSign,
  Building2,
  Package,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  AlertCircle,
  Mail,
  Phone,
  Hash,
  Paperclip,
} from "lucide-react";
import { format } from "date-fns";

import { useRequest, useCancelRequest } from "@/hooks/use-requests";
import { useAuthStore } from "@/stores/auth-store";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials, formatCurrency } from "@/lib/utils";
import { localizeName, getDateLocale } from "@/lib/i18n-helpers";
import { ProcessRequestDialog } from "../components/process-request-dialog";
import { Badge } from "@/components/ui/badge";
import { env } from "@/lib/env";

export function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { data, isLoading } = useRequest(id!);
  const cancelRequest = useCancelRequest();
  const [processAction, setProcessAction] = useState<
    "APPROVED" | "REJECTED" | "UNDER_REVIEW" | null
  >(null);

  if (isLoading) return <LoadingSpinner fullPage />;

  const request = data?.data;
  if (!request) {
    return (
      <div className="text-center py-16">
        <p>{t("requests.requestNotFound")}</p>
      </div>
    );
  }

  const isCitizenOwner =
    user?.role === "CITIZEN" && request.citizen?.id === user?.id;
  const canProcess =
    (user?.role === "OFFICER" ||
      user?.role === "HEAD" ||
      user?.role === "ADMIN") &&
    !["APPROVED", "REJECTED", "CANCELLED"].includes(request.status);
  const canCancel =
    isCitizenOwner &&
    !["APPROVED", "REJECTED", "CANCELLED"].includes(request.status);

  const handleCancel = () => {
    if (confirm(t("requests.cancelConfirm"))) {
      cancelRequest.mutate(request.id, {
        onSuccess: () => navigate("/app/requests"),
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title={t("requests.requestDetails")}
        description={
          <span className="flex items-center gap-2">
            <Hash className="h-3 w-3" />
            <span className="font-mono text-xs">{request.trackingNumber}</span>
          </span>
        }
        action={
          <Button asChild variant="outline">
            <Link to="/app/requests">
              <ArrowLeft className="h-4 w-4" />
              {t("common.back")}
            </Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-700/20 flex items-center justify-center">
                <FileText className="h-7 w-7 text-brand-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {localizeName(request.service as any)}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-[color:var(--muted-foreground)]">
                  <Building2 className="h-3.5 w-3.5" />
                  {localizeName(request.service?.department as any)}
                </div>
              </div>
            </div>
            <StatusBadge status={request.status} />
          </div>

          {request.status === "REJECTED" && request.rejectionReason && (
            <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                    {t("requests.rejectionReason")}
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                    {request.rejectionReason}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {t("requests.requestInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow
                icon={Package}
                label={t("requests.service")}
                value={localizeName(request.service as any)}
              />
              <InfoRow
                icon={Building2}
                label={t("requests.department")}
                value={localizeName(request.service?.department as any)}
              />
              <InfoRow
                icon={DollarSign}
                label={t("requests.fee")}
                value={
                  Number(request.service?.fee ?? 0) > 0
                    ? `${formatCurrency(Number(request.service?.fee))} AFN`
                    : t("common.free")
                }
              />
              <InfoRow
                icon={Calendar}
                label={t("requests.submitted")}
                value={format(new Date(request.createdAt), "PPpp", {
                  locale: getDateLocale(),
                })}
              />
              {request.processedAt && (
                <InfoRow
                  icon={CheckCircle2}
                  label={t("requests.processed")}
                  value={format(new Date(request.processedAt), "PPpp", {
                    locale: getDateLocale(),
                  })}
                />
              )}
              {request.notes && (
                <div className="pt-3 border-t border-[color:var(--border)]">
                  <div className="text-sm text-[color:var(--muted-foreground)] mb-2">
                    {t("requests.notes")}
                  </div>
                  <p className="text-sm leading-relaxed">{request.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                {t("requests.documents")}
                <Badge variant="secondary">
                  {request.documents?.length || 0}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!request.documents || request.documents.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-[color:var(--border)] rounded-xl bg-[color:var(--accent)]/30">
                  <Paperclip className="h-6 w-6 text-[color:var(--muted-foreground)] mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-[color:var(--muted-foreground)]">
                    No documents attached.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {request.documents.map((doc) => {
                    // Check if it's a full Cloudinary URL or a local relative path
                    const url = doc.fileUrl.startsWith("http")
                      ? doc.fileUrl
                      : `${env.API_URL}${doc.fileUrl}`;

                    const isImage = doc.mimeType?.startsWith("image/");

                    return (
                      <div
                        key={doc.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-[color:var(--border)] hover:bg-[color:var(--accent)]/50 transition-colors"
                      >
                        {isImage ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 group relative block h-12 w-12 rounded-lg border border-[color:var(--border)] overflow-hidden"
                          >
                            <img
                              src={url}
                              alt={doc.originalName}
                              className="h-full w-full object-cover transition-transform group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Download className="h-4 w-4 text-white" />
                            </div>
                          </a>
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-[color:var(--accent)] flex items-center justify-center shrink-0">
                            <FileText className="h-5 w-5 text-[color:var(--muted-foreground)]" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {doc.originalName}
                          </p>
                          <p className="text-xs text-[color:var(--muted-foreground)] mt-0.5">
                            {(doc.fileSize / 1024).toFixed(1)} KB ·{" "}
                            {doc.mimeType.split("/")[1]?.toUpperCase() ||
                              "FILE"}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="shrink-0"
                        >
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="h-4 w-4" />
                            {t("common.view")}
                          </a>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {request.citizen && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {t("requests.citizen")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {getInitials(request.citizen.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">
                      {request.citizen.name}
                    </div>
                    <div className="text-xs text-[color:var(--muted-foreground)]">
                      {t("role.CITIZEN")}
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-[color:var(--muted-foreground)]">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{request.citizen.email}</span>
                  </div>
                  {request.citizen.phone && (
                    <div className="flex items-center gap-2 text-[color:var(--muted-foreground)]">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{request.citizen.phone}</span>
                    </div>
                  )}
                  {request.citizen.nationalId && (
                    <div className="flex items-center gap-2 text-[color:var(--muted-foreground)]">
                      <Hash className="h-3.5 w-3.5" />
                      <span className="font-mono text-xs">
                        {request.citizen.nationalId}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {request.processedBy && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {t("requests.processedBy")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {getInitials(request.processedBy.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">
                      {request.processedBy.name}
                    </div>
                    {request.processedBy.jobTitle && (
                      <div className="text-xs text-[color:var(--muted-foreground)] truncate">
                        {request.processedBy.jobTitle}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {request.payment && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  {t("requests.payment")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[color:var(--muted-foreground)]">
                    {t("requests.amount")}
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(Number(request.payment.amount))} AFN
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[color:var(--muted-foreground)]">
                    {t("requests.status")}
                  </span>
                  <Badge variant="success">{request.payment.status}</Badge>
                </div>
                {request.payment.transactionId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[color:var(--muted-foreground)]">
                      {t("requests.transaction")}
                    </span>
                    <span className="font-mono text-xs">
                      {request.payment.transactionId.slice(-12)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {(canProcess || canCancel) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {t("common.actions")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {canProcess && (
                  <>
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={() => setProcessAction("APPROVED")}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {t("requests.approve")}
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => setProcessAction("REJECTED")}
                    >
                      <XCircle className="h-4 w-4" />
                      {t("requests.reject")}
                    </Button>
                    {request.status === "SUBMITTED" && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setProcessAction("UNDER_REVIEW")}
                      >
                        <Clock className="h-4 w-4" />
                        {t("requests.setReview")}
                      </Button>
                    )}
                  </>
                )}
                {canCancel && (
                  <Button
                    variant="outline"
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={handleCancel}
                    loading={cancelRequest.isPending}
                  >
                    <Ban className="h-4 w-4" />
                    {t("requests.cancelRequest")}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <ProcessRequestDialog
        requestId={request.id}
        action={processAction}
        onClose={() => setProcessAction(null)}
      />
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-[color:var(--muted-foreground)]">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <span className="font-medium text-right max-w-[60%]">{value || "—"}</span>
    </div>
  );
}
