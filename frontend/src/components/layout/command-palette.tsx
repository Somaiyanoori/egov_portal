import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Command } from "cmdk";
import { useTranslation } from "react-i18next";
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
  User,
  LogOut,
  Moon,
  Sun,
  Languages,
} from "lucide-react";

import { useAuthStore } from "@/stores/auth-store";
import { useThemeStore } from "@/stores/theme-store";
import { useLogout } from "@/hooks/use-auth";
import type { Role } from "@/types";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CmdItem {
  label: string;
  icon: React.ElementType;
  action: () => void;
  roles?: Role[];
  group: string;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const { toggleTheme, theme } = useThemeStore();
  const logout = useLogout();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const go = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };

  const run = (fn: () => void) => {
    fn();
    onOpenChange(false);
  };

  const commands: CmdItem[] = [
    // Navigation
    {
      label: t("nav.dashboard"),
      icon: LayoutDashboard,
      action: () => go("/app/dashboard"),
      group: t("cmd.navigation"),
    },
    {
      label: t("nav.newRequest"),
      icon: PlusCircle,
      action: () => go("/app/requests/new"),
      roles: ["CITIZEN"],
      group: t("cmd.navigation"),
    },
    {
      label: t("nav.myRequests"),
      icon: FileText,
      action: () => go("/app/requests"),
      roles: ["CITIZEN"],
      group: t("cmd.navigation"),
    },
    {
      label: t("nav.requests"),
      icon: FileText,
      action: () => go("/app/requests"),
      roles: ["OFFICER", "HEAD", "ADMIN"],
      group: t("cmd.navigation"),
    },
    {
      label: t("nav.notifications"),
      icon: Bell,
      action: () => go("/app/notifications"),
      group: t("cmd.navigation"),
    },

    // Admin
    {
      label: t("nav.users"),
      icon: Users,
      action: () => go("/app/admin/users"),
      roles: ["ADMIN"],
      group: t("cmd.admin"),
    },
    {
      label: t("nav.departments"),
      icon: Building2,
      action: () => go("/app/admin/departments"),
      roles: ["ADMIN"],
      group: t("cmd.admin"),
    },
    {
      label: t("nav.services"),
      icon: Package,
      action: () => go("/app/admin/services"),
      roles: ["ADMIN"],
      group: t("cmd.admin"),
    },
    {
      label: t("nav.reports"),
      icon: BarChart3,
      action: () => go("/app/admin/reports"),
      roles: ["ADMIN", "HEAD"],
      group: t("cmd.admin"),
    },

    // Account
    {
      label: t("nav.profile"),
      icon: User,
      action: () => go("/app/profile"),
      group: t("cmd.account"),
    },
    {
      label: t("nav.settings"),
      icon: Settings,
      action: () => go("/app/settings"),
      group: t("cmd.account"),
    },
    {
      label: t("auth.logout"),
      icon: LogOut,
      action: () => run(() => logout.mutate()),
      group: t("cmd.account"),
    },

    // Preferences
    {
      label: theme === "dark" ? t("settings.light") : t("settings.dark"),
      icon: theme === "dark" ? Sun : Moon,
      action: () => run(toggleTheme),
      group: t("cmd.preferences"),
    },
    {
      label: i18n.language === "en" ? "فارسی" : "English",
      icon: Languages,
      action: () =>
        run(() => i18n.changeLanguage(i18n.language === "en" ? "fa" : "en")),
      group: t("cmd.preferences"),
    },
  ];

  const filtered = commands.filter(
    (cmd) => !cmd.roles || (user && cmd.roles.includes(user.role)),
  );

  const groups = Array.from(new Set(filtered.map((c) => c.group)));

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4 bg-black/50 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-2xl rounded-xl border border-[color:var(--border)] bg-[color:var(--popover)] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="flex flex-col">
          <div className="flex items-center border-b border-[color:var(--border)] px-4">
            <Command.Input
              autoFocus
              placeholder={t("cmd.searchPlaceholder")}
              className="flex h-12 w-full bg-transparent py-3 text-sm outline-none placeholder:text-[color:var(--muted-foreground)]"
            />
            <kbd className="ml-2 hidden sm:inline-flex items-center h-5 px-1.5 rounded border border-[color:var(--border)] text-[10px] font-mono text-[color:var(--muted-foreground)]">
              ESC
            </kbd>
          </div>
          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-[color:var(--muted-foreground)]">
              {t("cmd.noResults")}
            </Command.Empty>
            {groups.map((group) => (
              <Command.Group
                key={group}
                heading={group}
                className="[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-[color:var(--muted-foreground)] [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider"
              >
                {filtered
                  .filter((c) => c.group === group)
                  .map((cmd, idx) => {
                    const Icon = cmd.icon;
                    return (
                      <Command.Item
                        key={`${group}-${idx}`}
                        onSelect={cmd.action}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer text-sm data-[selected=true]:bg-[color:var(--accent)] aria-selected:bg-[color:var(--accent)]"
                      >
                        <Icon className="h-4 w-4 text-[color:var(--muted-foreground)]" />
                        <span>{cmd.label}</span>
                      </Command.Item>
                    );
                  })}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
