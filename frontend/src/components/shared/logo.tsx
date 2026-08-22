import { Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const { t } = useTranslation();

  const sizes = {
    sm: { icon: "h-8 w-8", text: "text-lg" },
    md: { icon: "h-10 w-10", text: "text-xl" },
    lg: { icon: "h-14 w-14", text: "text-3xl" },
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg",
          sizes[size].icon,
        )}
      >
        <Building2
          className="text-white"
          style={{ width: "60%", height: "60%" }}
        />
      </div>
      {showText && (
        <div>
          <div
            className={cn(
              "font-bold leading-tight text-[color:var(--foreground)]",
              sizes[size].text,
            )}
          >
            {t("logo.name", { defaultValue: "E-Gov Portal" })}
          </div>
          <div className="text-xs text-[color:var(--muted-foreground)]">
            {t("logo.tagline", { defaultValue: "Citizen Services" })}
          </div>
        </div>
      )}
    </div>
  );
}
