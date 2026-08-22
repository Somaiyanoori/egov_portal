import { useState } from "react";
import { Menu, Search, Command } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { NotificationDropdown } from "./notification-dropdown";
import { UserMenu } from "./user-menu";
import { CommandPalette } from "./command-palette";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [cmdOpen, setCmdOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <header className="h-16 border-b border-[color:var(--border)] bg-[color:var(--sidebar-bg)]/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="h-full px-4 md:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            {onMenuClick && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={onMenuClick}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}

            <button
              onClick={() => setCmdOpen(true)}
              className="hidden md:flex items-center gap-2 h-9 px-3 rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] text-sm text-[color:var(--muted-foreground)] hover:bg-[color:var(--accent)] transition-colors w-full max-w-md"
            >
              <Search className="h-4 w-4" />
              <span className="flex-1 text-left">{t("common.search")}...</span>
              <kbd className="hidden lg:inline-flex items-center gap-1 h-5 px-1.5 rounded border border-[color:var(--border)] text-[10px] font-mono">
                <Command className="h-3 w-3" />K
              </kbd>
            </button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setCmdOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
            <NotificationDropdown />
            <div className="mx-1 h-6 w-px bg-[color:var(--border)]" />
            <UserMenu />
          </div>
        </div>
      </header>

      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </>
  );
}
