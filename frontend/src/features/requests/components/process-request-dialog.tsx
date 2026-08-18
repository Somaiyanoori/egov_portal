import { useState } from "react";
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

const actionConfig = {
  APPROVED: {
    title: "Approve Request",
    description:
      "Are you sure you want to approve this request? This action cannot be undone.",
    icon: CheckCircle2,
    color: "text-green-500",
    buttonVariant: "default" as const,
    buttonText: "Approve",
    requiresReason: false,
  },
  REJECTED: {
    title: "Reject Request",
    description: "Please provide a reason for rejecting this request.",
    icon: XCircle,
    color: "text-red-500",
    buttonVariant: "destructive" as const,
    buttonText: "Reject",
    requiresReason: true,
  },
  UNDER_REVIEW: {
    title: "Mark Under Review",
    description:
      "Mark this request as under review to indicate you are processing it.",
    icon: Clock,
    color: "text-yellow-500",
    buttonVariant: "default" as const,
    buttonText: "Mark Under Review",
    requiresReason: false,
  },
};

export function ProcessRequestDialog({
  requestId,
  action,
  onClose,
}: ProcessRequestDialogProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [reasonError, setReasonError] = useState(false);
  const processRequest = useProcessRequest();

  if (!action) return null;

  const config = actionConfig[action];
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
          <div
            className={`h-12 w-12 rounded-full bg-[color:var(--accent)] flex items-center justify-center mb-2`}
          >
            <Icon className={`h-6 w-6 ${config.color}`} />
          </div>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        {config.requiresReason && (
          <div className="space-y-2">
            <Label htmlFor="reason">
              Rejection Reason <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Please explain why this request is being rejected..."
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
                Rejection reason is required
              </p>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
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
