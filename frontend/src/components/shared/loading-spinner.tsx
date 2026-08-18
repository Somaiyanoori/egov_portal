import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  fullPage?: boolean;
}

export function LoadingSpinner({
  className,
  size = "md",
  fullPage,
}: LoadingSpinnerProps) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const spinner = (
    <Loader2
      className={cn(
        "animate-spin text-[color:var(--primary)]",
        sizes[size],
        className,
      )}
    />
  );

  if (fullPage) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          {spinner}
          <p className="text-sm text-[color:var(--muted-foreground)]">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return spinner;
}
