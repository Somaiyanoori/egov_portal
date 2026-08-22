import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProcessRequest } from "@/hooks/use-requests";

type Action = "APPROVED" | "REJECTED" | "UNDER_REVIEW";

interface ProcessRequestDialogProps {
  requestId: string;
  action: Action | null;
  onClose: () => void;
}

export function ProcessRequestDialog({
  requestId,
  action,
  onClose,
}: ProcessRequestDialogProps) {
  const { t } = useTranslation();
  const [rejectionReason, setRejectionReason] = useState("");
  const [reasonError, setReasonError] = useState(false);
  const processRequest = useProcessRequest();

  if (!action) return null;

  const config = {
    APPROVED: {
      title: t("requests.approveTitle"),
      description: t("requests.approveDesc"),
      icon: CheckCircle2,
      color: "text-green-500",
      buttonVariant: "default" as const,
      buttonText: t("requests.approve"),
      requiresReason: false,
    },
    REJECTED: {
      title: t("requests.rejectTitle"),
      description: t("requests.rejectDesc"),
      icon: XCircle,
      color: "text-red-500",
      buttonVariant: "destructive" as const,
      buttonText: t("requests.reject"),
      requiresReason: true,
    },
    UNDER_REVIEW: {
      title: t("requests.reviewTitle"),
      description: t("requests.reviewDesc"),
      icon: Clock,
      color: "text-yellow-500",
      buttonVariant: "default" as const,
      buttonText: t("requests.markUnderReview"),
      requiresReason: false,
    },
  }[action];

  const Icon = config.icon;

  const handleSubmit = () => {
    if (config.requiresReason && !rejectionReason.trim()) {
      setReasonError(true);
      return;
    }
    processRequest.mutate(
      {
        id: requestId,
        status: action,
        rejectionReason: config.requiresReason ? rejectionReason : undefined,
      },
      {
        onSuccess: () => {
          setRejectionReason("");
          setReasonError(false);
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={!!action} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <div className="h-12 w-12 rounded-full bg-[color:var(--accent)] flex items-center justify-center mb-2">
            <Icon className={`h-6 w-6 ${config.color}`} />
          </div>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        {config.requiresReason && (
          <div className="space-y-2">
            <Label htmlFor="reason">
              {t("requests.rejectionReason")}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder={t("requests.rejectionReasonPlaceholder")}
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value);
                if (reasonError && e.target.value.trim()) setReasonError(false);
              }}
              error={reasonError}
              rows={4}
            />
            {reasonError && (
              <p className="text-sm text-[color:var(--destructive)]">
                {t("requests.rejectionReasonRequired")}
              </p>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={handleSubmit}
            loading={processRequest.isPending}
          >
            <Icon className="h-4 w-4" />
            {config.buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
