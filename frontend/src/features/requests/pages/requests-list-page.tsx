import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, Plus, FileText, ArrowRight, Filter } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { useAuthStore } from "@/stores/auth-store";
import { useRequests } from "@/hooks/use-requests";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getInitials, debounce } from "@/lib/utils";

export function RequestsListPage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const statusFilter = searchParams.get("status") ?? "";

  const debouncedSetSearch = debounce((val: string) => setSearch(val), 500);

  const { data, isLoading } = useRequests({
    page,
    limit: 10,
    search: search || undefined,
    status: statusFilter || undefined,
  });

  const requests = data?.data ?? [];
  const meta = data?.meta;
  const isCitizen = user?.role === "CITIZEN";

  return (
    <div className="space-y-6">
      <PageHeader
        title={isCitizen ? t("nav.myRequests") : t("requests.title")}
        description={
          isCitizen
            ? "Track and manage your service requests"
            : "Manage all incoming requests"
        }
        action={
          isCitizen && (
            <Button asChild variant="gradient">
              <Link to="/app/requests/new">
                <Plus className="h-4 w-4" />
                {t("requests.newRequest")}
              </Link>
            </Button>
          )
        }
      />

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <Input
                icon={<Search className="h-4 w-4" />}
                placeholder="Search by tracking number, citizen, or service..."
                onChange={(e) => debouncedSetSearch(e.target.value)}
              />
            </div>
            <div className="w-full md:w-56">
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  const params = new URLSearchParams(searchParams);
                  if (value && value !== "ALL") params.set("status", value);
                  else params.delete("status");
                  setSearchParams(params);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : requests.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No requests found"
              description={
                search || statusFilter
                  ? "Try adjusting your filters"
                  : isCitizen
                    ? "Create your first request to get started"
                    : "No requests to display"
              }
              action={
                isCitizen && (
                  <Button asChild variant="gradient">
                    <Link to="/app/requests/new">
                      <Plus className="h-4 w-4" />
                      {t("requests.newRequest")}
                    </Link>
                  </Button>
                )
              }
            />
          ) : (
            <div className="divide-y divide-[color:var(--border)]">
              {requests.map((req) => (
                <Link
                  key={req.id}
                  to={`/app/requests/${req.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-[color:var(--accent)]/50 transition-colors group"
                >
                  {!isCitizen && (
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback>
                        {getInitials(req.citizen?.name ?? "?")}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate">
                        {isCitizen ? req.service?.name : req.citizen?.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-[color:var(--muted-foreground)]">
                      <span className="font-mono">
                        #{req.trackingNumber.slice(-8)}
                      </span>
                      {!isCitizen && (
                        <>
                          <span>•</span>
                          <span>{req.service?.name}</span>
                        </>
                      )}
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

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[color:var(--muted-foreground)]">
            Showing {(meta.page - 1) * meta.limit + 1} to{" "}
            {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
            results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={!meta.hasPrev}
            >
              Previous
            </Button>
            <div className="text-sm text-[color:var(--muted-foreground)] px-3">
              Page {meta.page} of {meta.totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={!meta.hasNext}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
