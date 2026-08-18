import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowRight,
  Ban,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { useAuthStore } from "@/stores/auth-store";
import { useMyRequestStats, useRequests } from "@/hooks/use-requests";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";

export function CitizenDashboard() {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { data: stats, isLoading: statsLoading } = useMyRequestStats();
  const { data: requestsData, isLoading: requestsLoading } = useRequests({
    limit: 5,
  });

  const s = stats?.data;
  const recentRequests = requestsData?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${t("dashboard.welcome")}, ${user?.name?.split(" ")[0]}!`}
        description={t("dashboard.overview")}
        action={
          <Button asChild variant="gradient" size="lg">
            <Link to="/app/requests/new">
              <Plus className="h-4 w-4" />
              {t("requests.newRequest")}
            </Link>
          </Button>
        }
      />

      {/* Stats */}
      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t("dashboard.totalRequests")}
            value={s?.total ?? 0}
            icon={FileText}
            color="brand"
            delay={0}
          />
          <StatCard
            title={t("dashboard.pendingRequests")}
            value={(s?.submitted ?? 0) + (s?.underReview ?? 0)}
            icon={Clock}
            color="yellow"
            delay={0.1}
          />
          <StatCard
            title={t("dashboard.approvedRequests")}
            value={s?.approved ?? 0}
            icon={CheckCircle2}
            color="green"
            delay={0.2}
          />
          <StatCard
            title={t("dashboard.rejectedRequests")}
            value={s?.rejected ?? 0}
            icon={XCircle}
            color="red"
            delay={0.3}
          />
        </div>
      )}

      {/* Recent Requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t("dashboard.recentRequests")}</CardTitle>
            <CardDescription>Your latest submissions</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/app/requests">
              {t("dashboard.viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {requestsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : recentRequests.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No requests yet"
              description="Create your first request to get started with our services"
              action={
                <Button asChild variant="gradient">
                  <Link to="/app/requests/new">
                    <Plus className="h-4 w-4" />
                    {t("requests.newRequest")}
                  </Link>
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {recentRequests.map((req) => (
                <Link
                  key={req.id}
                  to={`/app/requests/${req.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border border-[color:var(--border)] hover:bg-[color:var(--accent)] transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[color:var(--muted-foreground)] shrink-0" />
                      <h4 className="font-medium truncate">
                        {req.service?.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[color:var(--muted-foreground)]">
                      <span>#{req.trackingNumber.slice(-8)}</span>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(new Date(req.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={req.status} />
                    <ArrowRight className="h-4 w-4 text-[color:var(--muted-foreground)] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
