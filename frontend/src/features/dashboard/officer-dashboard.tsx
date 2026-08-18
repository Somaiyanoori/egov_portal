import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { useAuthStore } from "@/stores/auth-store";
import { useRequests } from "@/hooks/use-requests";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

export function OfficerDashboard() {
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const { data: submittedData, isLoading: subLoading } = useRequests({
    status: "SUBMITTED",
    limit: 100,
  });
  const { data: reviewData, isLoading: revLoading } = useRequests({
    status: "UNDER_REVIEW",
    limit: 100,
  });
  const { data: approvedData } = useRequests({
    status: "APPROVED",
    limit: 100,
  });
  const { data: rejectedData } = useRequests({
    status: "REJECTED",
    limit: 100,
  });
  const { data: pendingData, isLoading: pendingLoading } = useRequests({
    status: "SUBMITTED",
    limit: 5,
  });

  const submitted = submittedData?.meta?.total ?? 0;
  const underReview = reviewData?.meta?.total ?? 0;
  const approved = approvedData?.meta?.total ?? 0;
  const rejected = rejectedData?.meta?.total ?? 0;
  const totalPending = submitted + underReview;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${t("dashboard.welcome")}, ${user?.name?.split(" ")[0]}!`}
        description={`${user?.department?.name ?? "Officer"} • ${totalPending} pending requests`}
      />

      {/* Stats */}
      {subLoading || revLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Pending Queue"
            value={totalPending}
            icon={Clock}
            color="yellow"
            delay={0}
          />
          <StatCard
            title="New"
            value={submitted}
            icon={FileText}
            color="blue"
            delay={0.1}
          />
          <StatCard
            title="Approved"
            value={approved}
            icon={CheckCircle2}
            color="green"
            delay={0.2}
          />
          <StatCard
            title="Rejected"
            value={rejected}
            icon={XCircle}
            color="red"
            delay={0.3}
          />
        </div>
      )}

      {/* Pending Queue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Pending Queue</CardTitle>
            <CardDescription>Requests waiting for your review</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/app/requests?status=SUBMITTED">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {pendingLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : (pendingData?.data ?? []).length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="All caught up!"
              description="No pending requests at the moment"
            />
          ) : (
            <div className="space-y-3">
              {(pendingData?.data ?? []).map((req) => (
                <Link
                  key={req.id}
                  to={`/app/requests/${req.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border border-[color:var(--border)] hover:bg-[color:var(--accent)] transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {getInitials(req.citizen?.name ?? "?")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium truncate">
                          {req.citizen?.name}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[color:var(--muted-foreground)] mt-0.5">
                        <span>{req.service?.name}</span>
                        <span>•</span>
                        <span>
                          {formatDistanceToNow(new Date(req.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
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
