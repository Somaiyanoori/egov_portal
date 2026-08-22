import { useTranslation } from "react-i18next";
import { Moon, Sun, Languages, Bell, Monitor, Palette } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/stores/theme-store";

export function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title={t("nav.settings")}
        description={t("settings.subtitle")}
      />

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            {t("settings.appearance")}
          </CardTitle>
          <CardDescription>{t("settings.appearanceDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme */}
          <div>
            <div className="mb-3">
              <div className="font-medium">{t("settings.theme")}</div>
              <div className="text-sm text-[color:var(--muted-foreground)]">
                {t("settings.themeDesc")}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <button
                onClick={() => setTheme("light")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === "light"
                    ? "border-[color:var(--primary)] bg-[color:var(--accent)]"
                    : "border-[color:var(--border)] hover:bg-[color:var(--accent)]/50"
                }`}
              >
                <Sun className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                <div className="text-sm font-medium">{t("settings.light")}</div>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === "dark"
                    ? "border-[color:var(--primary)] bg-[color:var(--accent)]"
                    : "border-[color:var(--border)] hover:bg-[color:var(--accent)]/50"
                }`}
              >
                <Moon className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <div className="text-sm font-medium">{t("settings.dark")}</div>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            {t("settings.language")}
          </CardTitle>
          <CardDescription>{t("settings.languageDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <button
              onClick={() => i18n.changeLanguage("en")}
              className={`p-4 rounded-lg border-2 transition-all ${
                i18n.language === "en"
                  ? "border-[color:var(--primary)] bg-[color:var(--accent)]"
                  : "border-[color:var(--border)] hover:bg-[color:var(--accent)]/50"
              }`}
            >
              <div className="text-2xl mb-2">EN</div>
              <div className="text-sm font-medium">English</div>
            </button>
            <button
              onClick={() => i18n.changeLanguage("fa")}
              className={`p-4 rounded-lg border-2 transition-all ${
                i18n.language === "fa"
                  ? "border-[color:var(--primary)] bg-[color:var(--accent)]"
                  : "border-[color:var(--border)] hover:bg-[color:var(--accent)]/50"
              }`}
            >
              <div className="text-2xl mb-2">فا</div>
              <div className="text-sm font-medium">فارسی</div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            {t("settings.about")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[color:var(--muted-foreground)]">
              {t("settings.version")}
            </span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[color:var(--muted-foreground)]">
              {t("settings.build")}
            </span>
            <span className="font-medium">Production</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
