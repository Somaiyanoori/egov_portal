import { useAuthStore } from "@/stores/auth-store";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { FileText, Clock, CheckCircle2, XCircle, Rocket } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardPlaceholder() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0]}!`}
        description="Here's what's happening today"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Requests"
          value="0"
          icon={FileText}
          color="brand"
          delay={0}
        />
        <StatCard
          title="Pending"
          value="0"
          icon={Clock}
          color="yellow"
          delay={0.1}
        />
        <StatCard
          title="Approved"
          value="0"
          icon={CheckCircle2}
          color="green"
          delay={0.2}
        />
        <StatCard
          title="Rejected"
          value="0"
          icon={XCircle}
          color="red"
          delay={0.3}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Rocket className="h-5 w-5 text-brand-500" />
            Real Dashboard Coming in Batch 4!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[color:var(--muted-foreground)]">
            The next batch will bring:
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            <li>• Real citizen dashboard with your requests</li>
            <li>• Officer dashboard with department queue</li>
            <li>• Admin overview with charts</li>
            <li>• New Request creation with file upload</li>
            <li>• Request detail pages with processing actions</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
