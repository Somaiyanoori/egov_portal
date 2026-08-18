import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-[color:var(--primary)] text-[color:var(--primary-foreground)]",
        secondary:
          "bg-[color:var(--secondary)] text-[color:var(--secondary-foreground)]",
        destructive:
          "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20",
        success:
          "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20",
        warning:
          "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20",
        info: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
        outline:
          "text-[color:var(--foreground)] border border-[color:var(--border)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
