import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormMessageProps {
  message?: string;
  className?: string;
}

export function FormMessage({ message, className }: FormMessageProps) {
  if (!message) return null;

  return (
    <p
      className={cn(
        "flex items-center gap-1.5 text-sm text-[color:var(--destructive)] animate-fade-in",
        className,
      )}
    >
      <AlertCircle className="h-3.5 w-3.5" />
      {message}
    </p>
  );
}
