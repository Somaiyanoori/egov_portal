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
  id: string;
  labelKey: string;
  href: string;
  icon: React.ElementType;
  roles?: Role[];
}

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

  // Show text labels when NOT collapsed OR when mobile drawer is open
  const showLabels = !collapsed || !!mobile;

  const getNavItems = (): NavItem[] => {
    if (!user) return [];

    const items: NavItem[] = [
      {
        id: "dashboard",
        labelKey: "nav.dashboard",
        href: "/app/dashboard",
        icon: LayoutDashboard,
      },
    ];

    if (user.role === "CITIZEN") {
      items.push(
        {
          id: "new-request",
          labelKey: "nav.newRequest",
          href: "/app/requests/new",
          icon: PlusCircle,
        },
        {
          id: "my-requests",
          labelKey: "nav.myRequests",
          href: "/app/requests",
          icon: FileText,
        },
      );
    }

    if (user.role === "OFFICER" || user.role === "HEAD") {
      items.push({
        id: "requests",
        labelKey: "nav.requests",
        href: "/app/requests",
        icon: FileText,
      });
    }

    if (user.role === "ADMIN") {
      items.push(
        {
          id: "all-requests",
          labelKey: "nav.requests",
          href: "/app/requests",
          icon: FileText,
        },
        {
          id: "users",
          labelKey: "nav.users",
          href: "/app/admin/users",
          icon: Users,
        },
        {
          id: "departments",
          labelKey: "nav.departments",
          href: "/app/admin/departments",
          icon: Building2,
        },
        {
          id: "services",
          labelKey: "nav.services",
          href: "/app/admin/services",
          icon: Package,
        },
      );
    }

    if (user.role === "ADMIN" || user.role === "HEAD") {
      items.push({
        id: "reports",
        labelKey: "nav.reports",
        href: "/app/admin/reports",
        icon: BarChart3,
      });
    }

    items.push({
      id: "notifications",
      labelKey: "nav.notifications",
      href: "/app/notifications",
      icon: Bell,
    });

    return items;
  };

  const navItems = getNavItems();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex flex-col h-full bg-[color:var(--sidebar-bg)] border-r border-[color:var(--border)] transition-all duration-300 ease-in-out",
          showLabels ? "w-64" : "w-20",
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[color:var(--border)]">
          {showLabels ? (
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
              className={cn("shrink-0", !showLabels && "rotate-180")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-2">
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/app/dashboard"
                  ? location.pathname === "/app/dashboard"
                  : location.pathname === item.href ||
                    location.pathname.startsWith(item.href + "/");

              const Icon = item.icon;
              const label = t(item.labelKey);

              const linkEl = (
                <NavLink
                  key={item.id}
                  to={item.href}
                  end={item.href === "/app/dashboard"}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative",
                    "hover:bg-[color:var(--sidebar-hover)]",
                    isActive
                      ? "bg-[color:var(--sidebar-active)] text-[color:var(--primary)] font-semibold"
                      : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]",
                    !showLabels && "justify-center px-0",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-[color:var(--primary)]"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon className="h-5 w-5 shrink-0" />
                  {showLabels && (
                    <span className="truncate whitespace-nowrap">{label}</span>
                  )}
                </NavLink>
              );

              // When collapsed (icons only), wrap with tooltip
              if (!showLabels) {
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                    <TooltipContent side="right" sideOffset={8}>
                      {label}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return <div key={item.id}>{linkEl}</div>;
            })}
          </nav>
        </ScrollArea>

        {/* User footer */}
        {showLabels && user && (
          <div className="p-3 border-t border-[color:var(--border)]">
            <div className="flex items-center gap-3 p-2 rounded-lg">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
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
                  {t(`role.${user.role}`)}
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}
