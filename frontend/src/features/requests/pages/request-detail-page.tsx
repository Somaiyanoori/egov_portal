import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  User,
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
} from "lucide-react";
import { format } from "date-fns";

import { useRequest, useCancelRequest } from "@/hooks/use-requests";
import { useAuthStore } from "@/stores/auth-store";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials, formatCurrency } from "@/lib/utils";
import { ProcessRequestDialog } from "../components/process-request-dialog";
import { Badge } from "@/components/ui/badge";

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
        <p>Request not found</p>
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
    if (confirm("Are you sure you want to cancel this request?")) {
      cancelRequest.mutate(request.id, {
        onSuccess: () => navigate("/app/requests"),
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        title="Request Details"
        description={
          (
            <div className="flex items-center gap-2">
              <Hash className="h-3 w-3" />
              <span className="font-mono text-xs">
                {request.trackingNumber}
              </span>
            </div>
          ) as any
        }
        action={
          <Button asChild variant="outline">
            <Link to="/app/requests">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        }
      />

      {/* Status Banner */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-700/20 flex items-center justify-center">
                <FileText className="h-7 w-7 text-brand-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {request.service?.name}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-[color:var(--muted-foreground)]">
                  <Building2 className="h-3.5 w-3.5" />
                  {request.service?.department?.name}
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
                    Rejection Reason
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
        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Request Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow
                icon={Package}
                label="Service"
                value={request.service?.name}
              />
              <InfoRow
                icon={Building2}
                label="Department"
                value={request.service?.department?.name}
              />
              <InfoRow
                icon={DollarSign}
                label="Fee"
                value={
                  Number(request.service?.fee ?? 0) > 0
                    ? `${formatCurrency(Number(request.service?.fee))} AFN`
                    : "Free"
                }
              />
              <InfoRow
                icon={Calendar}
                label="Submitted"
                value={format(new Date(request.createdAt), "PPpp")}
              />
              {request.processedAt && (
                <InfoRow
                  icon={CheckCircle2}
                  label="Processed"
                  value={format(new Date(request.processedAt), "PPpp")}
                />
              )}
              {request.notes && (
                <div className="pt-3 border-t border-[color:var(--border)]">
                  <div className="text-sm text-[color:var(--muted-foreground)] mb-2">
                    Notes
                  </div>
                  <p className="text-sm">{request.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents */}
          {request.documents && request.documents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  Documents
                  <Badge variant="secondary">{request.documents.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {request.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-[color:var(--border)] hover:bg-[color:var(--accent)]/50 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-lg bg-[color:var(--accent)] flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-[color:var(--muted-foreground)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {doc.originalName}
                      </p>
                      <p className="text-xs text-[color:var(--muted-foreground)]">
                        {(doc.fileSize / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4" />
                        {t("common.download")}
                      </a>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Citizen Info */}
          {request.citizen && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Citizen</CardTitle>
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
                      Citizen
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

          {/* Processed By */}
          {request.processedBy && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Processed By</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {getInitials(request.processedBy.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">
                      {request.processedBy.name}
                    </div>
                    {request.processedBy.jobTitle && (
                      <div className="text-xs text-[color:var(--muted-foreground)]">
                        {request.processedBy.jobTitle}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment */}
          {request.payment && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[color:var(--muted-foreground)]">
                    Amount
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(Number(request.payment.amount))} AFN
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[color:var(--muted-foreground)]">
                    Status
                  </span>
                  <Badge variant="success">{request.payment.status}</Badge>
                </div>
                {request.payment.transactionId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[color:var(--muted-foreground)]">
                      Transaction
                    </span>
                    <span className="font-mono text-xs">
                      {request.payment.transactionId.slice(-12)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          {(canProcess || canCancel) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Actions</CardTitle>
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
                    Cancel Request
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Process Dialog */}
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
      <span className="font-medium">{value || "—"}</span>
    </div>
  );
}
