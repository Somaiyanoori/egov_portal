import { useMemo } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const checks = useMemo(
    () => [
      { label: "At least 8 characters", valid: password.length >= 8 },
      { label: "Contains uppercase letter", valid: /[A-Z]/.test(password) },
      { label: "Contains lowercase letter", valid: /[a-z]/.test(password) },
      { label: "Contains a number", valid: /[0-9]/.test(password) },
      {
        label: "Contains special character",
        valid: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      },
    ],
    [password],
  );

  const strength = checks.filter((c) => c.valid).length;
  const strengthLabel = [
    "Very Weak",
    "Weak",
    "Fair",
    "Good",
    "Strong",
    "Very Strong",
  ][strength];
  const strengthColor = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-emerald-500",
  ][strength];

  if (!password) return null;

  return (
    <div className="space-y-2 mt-2 animate-fade-in">
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all duration-300", strengthColor)}
            style={{ width: `${(strength / 5) * 100}%` }}
          />
        </div>
        <span className="text-xs text-white/70 font-medium min-w-[70px] text-right">
          {strengthLabel}
        </span>
      </div>

      {/* Requirements */}
      <ul className="space-y-1 pt-1">
        {checks.map((check, idx) => (
          <li
            key={idx}
            className={cn(
              "flex items-center gap-2 text-xs transition-colors",
              check.valid ? "text-green-400" : "text-white/50",
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
