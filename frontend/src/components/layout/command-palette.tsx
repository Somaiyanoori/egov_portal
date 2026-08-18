import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Command } from "cmdk";
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
import { useTranslation } from "react-i18next";

import { useAuthStore } from "@/stores/auth-store";
import { useThemeStore } from "@/stores/theme-store";
import { useLogout } from "@/hooks/use-auth";
import type { Role } from "@/types";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Command {
  label: string;
  icon: React.ElementType;
  action: () => void;
  keywords?: string;
  roles?: Role[];
  group: string;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { toggleTheme, theme } = useThemeStore();
  const { i18n } = useTranslation();
  const logout = useLogout();

  // Cmd+K to open
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

  const runAction = (action: () => void) => {
    action();
    onOpenChange(false);
  };

  const commands: Command[] = [
    // Navigation
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      action: () => go("/app/dashboard"),
      group: "Navigation",
    },
    {
      label: "New Request",
      icon: PlusCircle,
      action: () => go("/app/requests/new"),
      roles: ["CITIZEN"],
      group: "Navigation",
    },
    {
      label: "My Requests",
      icon: FileText,
      action: () => go("/app/requests"),
      roles: ["CITIZEN"],
      group: "Navigation",
    },
    {
      label: "Requests",
      icon: FileText,
      action: () => go("/app/requests"),
      roles: ["OFFICER", "HEAD", "ADMIN"],
      group: "Navigation",
    },
    {
      label: "Notifications",
      icon: Bell,
      action: () => go("/app/notifications"),
      group: "Navigation",
    },

    // Admin
    {
      label: "Users",
      icon: Users,
      action: () => go("/app/admin/users"),
      roles: ["ADMIN"],
      group: "Admin",
    },
    {
      label: "Departments",
      icon: Building2,
      action: () => go("/app/admin/departments"),
      roles: ["ADMIN"],
      group: "Admin",
    },
    {
      label: "Services",
      icon: Package,
      action: () => go("/app/admin/services"),
      roles: ["ADMIN"],
      group: "Admin",
    },
    {
      label: "Reports",
      icon: BarChart3,
      action: () => go("/app/admin/reports"),
      roles: ["ADMIN", "HEAD"],
      group: "Admin",
    },

    // Actions
    {
      label: "Profile",
      icon: User,
      action: () => go("/app/profile"),
      group: "Account",
    },
    {
      label: "Settings",
      icon: Settings,
      action: () => go("/app/settings"),
      group: "Account",
    },
    {
      label: `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`,
      icon: theme === "dark" ? Sun : Moon,
      action: () => runAction(toggleTheme),
      group: "Preferences",
    },
    {
      label: `Switch to ${i18n.language === "en" ? "Farsi" : "English"}`,
      icon: Languages,
      action: () =>
        runAction(() =>
          i18n.changeLanguage(i18n.language === "en" ? "fa" : "en"),
        ),
      group: "Preferences",
    },
    {
      label: "Logout",
      icon: LogOut,
      action: () => runAction(() => logout.mutate()),
      group: "Account",
    },
  ];

  const filteredCommands = commands.filter(
    (cmd) => !cmd.roles || (user && cmd.roles.includes(user.role)),
  );

  const groups = Array.from(new Set(filteredCommands.map((c) => c.group)));

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
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
              placeholder="Type a command or search..."
              className="flex h-12 w-full bg-transparent py-3 text-sm outline-none placeholder:text-[color:var(--muted-foreground)]"
            />
            <kbd className="ml-2 hidden sm:inline-flex items-center h-5 px-1.5 rounded border border-[color:var(--border)] text-[10px] font-mono text-[color:var(--muted-foreground)]">
              ESC
            </kbd>
          </div>
          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-sm text-[color:var(--muted-foreground)]">
              No results found.
            </Command.Empty>
            {groups.map((group) => (
              <Command.Group
                key={group}
                heading={group}
                className="text-xs text-[color:var(--muted-foreground)] px-2 py-1.5 font-semibold uppercase tracking-wider"
              >
                {filteredCommands
                  .filter((c) => c.group === group)
                  .map((cmd, idx) => {
                    const Icon = cmd.icon;
                    return (
                      <Command.Item
                        key={`${group}-${idx}`}
                        onSelect={cmd.action}
                        className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer text-sm data-[selected=true]:bg-[color:var(--accent)]"
                      >
                        <Icon className="h-4 w-4 text-[color:var(--muted-foreground)]" />
                        <span className="text-[color:var(--foreground)]">
                          {cmd.label}
                        </span>
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
