import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "brand" | "green" | "red" | "yellow" | "blue" | "purple";
  delay?: number;
}

const colorClasses = {
  brand: "from-brand-500 to-brand-700 text-brand-500 bg-brand-500/10",
  green: "from-green-500 to-green-700 text-green-500 bg-green-500/10",
  red: "from-red-500 to-red-700 text-red-500 bg-red-500/10",
  yellow: "from-yellow-500 to-yellow-700 text-yellow-500 bg-yellow-500/10",
  blue: "from-blue-500 to-blue-700 text-blue-500 bg-blue-500/10",
  purple: "from-purple-500 to-purple-700 text-purple-500 bg-purple-500/10",
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "brand",
  delay = 0,
}: StatCardProps) {
  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
        {/* Decorative gradient */}
        <div
          className={cn(
            "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 bg-gradient-to-br",
            colors.split(" ").slice(0, 2).join(" "),
          )}
        />
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-[color:var(--muted-foreground)]">
                {title}
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
                {trend && (
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      trend.isPositive ? "text-green-500" : "text-red-500",
                    )}
                  >
                    {trend.isPositive ? "+" : ""}
                    {trend.value}%
                  </span>
                )}
              </div>
            </div>
            <div
              className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center shrink-0",
                colors.split(" ").slice(2).join(" "),
              )}
            >
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
