import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const { t } = useTranslation();

  const checks = useMemo(
    () => [
      { label: t("auth.atLeast8"), valid: password.length >= 8 },
      { label: t("auth.hasUppercase"), valid: /[A-Z]/.test(password) },
      { label: t("auth.hasLowercase"), valid: /[a-z]/.test(password) },
      { label: t("auth.hasNumber"), valid: /[0-9]/.test(password) },
      {
        label: t("auth.hasSpecial"),
        valid: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      },
    ],
    [password, t],
  );

  const strength = checks.filter((c) => c.valid).length;
  const labels = [
    t("auth.veryWeak"),
    t("auth.weak"),
    t("auth.fair"),
    t("auth.good"),
    t("auth.strong"),
    t("auth.veryStrong"),
  ];
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-emerald-500",
  ];

  if (!password) return null;

  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-300",
              colors[strength],
            )}
            style={{ width: `${(strength / 5) * 100}%` }}
          />
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium min-w-[70px] text-right">
          {labels[strength]}
        </span>
      </div>
      <ul className="space-y-1 pt-1">
        {checks.map((check, idx) => (
          <li
            key={idx}
            className={cn(
              "flex items-center gap-2 text-xs transition-colors",
              check.valid
                ? "text-green-600 dark:text-green-400"
                : "text-slate-400 dark:text-slate-500",
            )}
          >
            {check.valid ? (
              <Check className="h-3 w-3" />
            ) : (
              <X className="h-3 w-3" />
            )}
            {check.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
