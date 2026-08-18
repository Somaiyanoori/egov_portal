import { useTranslation } from "react-i18next";
import { Shield, User, UserCog, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Role } from "@/types";

interface RoleBadgeProps {
  role: Role;
}

const roleConfig: Record<
  Role,
  {
    variant:
      | "success"
      | "destructive"
      | "warning"
      | "info"
      | "secondary"
      | "default";
    icon: any;
  }
> = {
  ADMIN: { variant: "destructive", icon: Crown },
  HEAD: { variant: "warning", icon: UserCog },
  OFFICER: { variant: "info", icon: Shield },
  CITIZEN: { variant: "secondary", icon: User },
};

export function RoleBadge({ role }: RoleBadgeProps) {
  const { t } = useTranslation();
  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant}>
      <Icon className="h-3 w-3" />
      {t(`role.${role}`)}
    </Badge>
  );
}
