import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Users,
  Building2,
  Package,
  BarChart3,
  Bell,
  Settings,
  ChevronLeft,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useAuthStore } from "@/stores/auth-store";
import type { Role } from "@/types";

interface NavItem {
  labelKey: string;
  href: string;
  icon: React.ElementType;
  roles?: Role[];
}

const navItems: NavItem[] = [
  { labelKey: "nav.dashboard", href: "/app/dashboard", icon: LayoutDashboard },

  // Citizen
  {
    labelKey: "nav.newRequest",
    href: "/app/requests/new",
    icon: PlusCircle,
    roles: ["CITIZEN"],
  },
  {
    labelKey: "nav.myRequests",
    href: "/app/requests",
    icon: FileText,
    roles: ["CITIZEN"],
  },

  // Officer / Head
  {
    labelKey: "nav.requests",
    href: "/app/requests",
    icon: FileText,
    roles: ["OFFICER", "HEAD"],
  },

  // Admin
  {
    labelKey: "nav.users",
    href: "/app/admin/users",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    labelKey: "nav.departments",
    href: "/app/admin/departments",
    icon: Building2,
    roles: ["ADMIN"],
  },
  {
    labelKey: "nav.services",
    href: "/app/admin/services",
    icon: Package,
    roles: ["ADMIN"],
  },
  {
    labelKey: "nav.reports",
    href: "/app/admin/reports",
    icon: BarChart3,
    roles: ["ADMIN", "HEAD"],
  },
  {
    labelKey: "nav.requests",
    href: "/app/admin/requests",
    icon: FileText,
    roles: ["ADMIN"],
  },

  // Common
  { labelKey: "nav.notifications", href: "/app/notifications", icon: Bell },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobile?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({
  collapsed,
  onToggle,
  mobile,
  onNavigate,
}: SidebarProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuthStore();

  const filteredItems = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role)),
  );

  // Deduplicate (in case admin sees the same href twice)
  const uniqueItems = Array.from(
    new Map(filteredItems.map((item) => [item.href, item])).values(),
  );

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex flex-col h-full bg-[color:var(--card)] border-r border-[color:var(--border)] transition-all duration-300 ease-in-out",
          collapsed && !mobile ? "w-20" : "w-64",
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[color:var(--border)]">
          {!collapsed || mobile ? (
            <Logo size="sm" />
          ) : (
            <div className="w-full flex justify-center">
              <Logo size="sm" showText={false} />
            </div>
          )}
          {!mobile && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onToggle}
              className={cn("shrink-0", collapsed && "rotate-180")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Nav */}
        <ScrollArea className="flex-1">
          <nav className="p-3 space-y-1">
            {uniqueItems.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== "/app/dashboard" &&
                  location.pathname.startsWith(item.href));
              const Icon = item.icon;
              const label = t(item.labelKey);

              const linkContent = (
                <NavLink
                  to={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative group",
                    "hover:bg-[color:var(--accent)] hover:text-[color:var(--accent-foreground)]",
                    isActive
                      ? "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]"
                      : "text-[color:var(--muted-foreground)]",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-[color:var(--primary)]"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <Icon className="h-5 w-5 shrink-0" />
                  {(!collapsed || mobile) && (
                    <span className="truncate">{label}</span>
                  )}
                </NavLink>
              );

              if (collapsed && !mobile) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right">{label}</TooltipContent>
                  </Tooltip>
                );
              }

              return <div key={item.href}>{linkContent}</div>;
            })}
          </nav>
        </ScrollArea>

        {/* User info at bottom */}
        {(!collapsed || mobile) && user && (
          <div className="p-3 border-t border-[color:var(--border)]">
            <div className="flex items-center gap-3 p-2 rounded-lg">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-sm font-semibold">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user.name}</div>
                <div className="text-xs text-[color:var(--muted-foreground)] truncate">
                  {user.email}
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}
