import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Search,
  Plus,
  FileText,
  ArrowRight,
  Filter,
  Paperclip,
} from "lucide-react";
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
import { localizeName, getDateLocale } from "@/lib/i18n-helpers";

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
          isCitizen ? t("requests.trackManage") : t("requests.manageAll")
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

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <Input
                icon={<Search className="h-4 w-4" />}
                placeholder={t("requests.searchPlaceholder")}
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
                  <SelectValue placeholder={t("status.allStatuses")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">{t("status.allStatuses")}</SelectItem>
                  <SelectItem value="SUBMITTED">
                    {t("status.SUBMITTED")}
                  </SelectItem>
                  <SelectItem value="UNDER_REVIEW">
                    {t("status.UNDER_REVIEW")}
                  </SelectItem>
                  <SelectItem value="APPROVED">
                    {t("status.APPROVED")}
                  </SelectItem>
                  <SelectItem value="REJECTED">
                    {t("status.REJECTED")}
                  </SelectItem>
                  <SelectItem value="CANCELLED">
                    {t("status.CANCELLED")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

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
              title={t("requests.noRequestsFound")}
              description={
                search || statusFilter
                  ? t("requests.adjustFilters")
                  : isCitizen
                    ? t("requests.noRequestsCitizen")
                    : t("requests.noRequestsAdmin")
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
                        {isCitizen
                          ? localizeName(req.service as any)
                          : req.citizen?.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-[color:var(--muted-foreground)]">
                      <span className="font-mono">
                        #{req.trackingNumber.slice(-8)}
                      </span>
                      {!isCitizen && (
                        <>
                          <span>•</span>
                          <span>{localizeName(req.service as any)}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(new Date(req.createdAt), {
                          addSuffix: true,
                          locale: getDateLocale(),
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {req.documents && req.documents.length > 0 && (
                      <span
                        className="hidden sm:inline-flex items-center gap-1 text-xs text-[color:var(--muted-foreground)] font-medium"
                        title={`${req.documents.length} attached documents`}
                      >
                        <Paperclip className="h-3.5 w-3.5" />
                        {req.documents.length}
                      </span>
                    )}
                    <StatusBadge status={req.status} />
                    <ArrowRight className="h-4 w-4 text-[color:var(--muted-foreground)] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[color:var(--muted-foreground)]">
            {t("common.showing")} {(meta.page - 1) * meta.limit + 1}{" "}
            {t("common.to")} {Math.min(meta.page * meta.limit, meta.total)}{" "}
            {t("common.of")} {meta.total} {t("common.results")}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={!meta.hasPrev}
            >
              {t("common.previous")}
            </Button>
            <div className="text-sm text-[color:var(--muted-foreground)] px-3">
              {t("common.page")} {meta.page} / {meta.totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={!meta.hasNext}
            >
              {t("common.next")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
