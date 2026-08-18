import { useTranslation } from "react-i18next";
import { CheckCircle2, XCircle, Clock, Send, Ban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { RequestStatus } from "@/types";

interface StatusBadgeProps {
  status: RequestStatus;
}

const statusConfig: Record<
  RequestStatus,
  {
    variant: "success" | "destructive" | "warning" | "info" | "secondary";
    icon: any;
  }
> = {
  APPROVED: { variant: "success", icon: CheckCircle2 },
  REJECTED: { variant: "destructive", icon: XCircle },
  UNDER_REVIEW: { variant: "warning", icon: Clock },
  SUBMITTED: { variant: "info", icon: Send },
  CANCELLED: { variant: "secondary", icon: Ban },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation();
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant}>
      <Icon className="h-3 w-3" />
      {t(`status.${status}`)}
    </Badge>
  );
}
