import { useThemeStore } from "@/stores/theme-store";
import { cn } from "@/lib/utils";

export function AnimatedBackground() {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div
        className={cn(
          "absolute inset-0 transition-colors duration-500",
          isDark
            ? "bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950"
            : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100",
        )}
      />

      <div
        className={cn(
          "absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl animate-pulse",
          isDark ? "bg-indigo-500/25" : "bg-indigo-300/50",
        )}
      />
      <div
        className={cn(
          "absolute top-1/2 -right-40 w-[400px] h-[400px] rounded-full blur-3xl animate-pulse",
          isDark ? "bg-purple-500/20" : "bg-purple-300/40",
        )}
        style={{ animationDelay: "1s" }}
      />
      <div
        className={cn(
          "absolute -bottom-40 left-1/3 w-[450px] h-[450px] rounded-full blur-3xl animate-pulse",
          isDark ? "bg-blue-500/20" : "bg-blue-300/40",
        )}
        style={{ animationDelay: "2s" }}
      />

      <div
        className={cn("absolute inset-0", isDark ? "opacity-15" : "opacity-30")}
        style={{
          backgroundImage: isDark
            ? "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)"
            : "linear-gradient(rgba(99,102,241,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {isDark && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      )}
    </div>
  );
}
