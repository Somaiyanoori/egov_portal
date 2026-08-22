import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Monitor, Trash2, LogOut, Shield } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { getDateLocale } from "@/lib/i18n-helpers";
import { authService } from "@/services/auth.service";

export function SessionsPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["auth", "sessions"],
    queryFn: () => authService.getSessions(),
  });

  const revoke = useMutation({
    mutationFn: (id: string) => authService.revokeSession(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auth", "sessions"] });
      toast.success(t("sessions.sessionRevoked"));
    },
  });

  const logoutAll = useMutation({
    mutationFn: () => authService.logoutAll(),
    onSuccess: () => {
      toast.success(t("sessions.loggedOutAll"));
      setTimeout(() => (window.location.href = "/login"), 1000);
    },
  });

  const sessions = (data?.data as any[]) ?? [];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title={t("sessions.title")}
        description={t("sessions.manageSessions")}
        action={
          sessions.length > 0 && (
            <Button
              variant="outline"
              className="text-red-500 hover:text-red-600"
              onClick={() => logoutAll.mutate()}
              loading={logoutAll.isPending}
            >
              <LogOut className="h-4 w-4" />
              {t("sessions.logoutAll")}
            </Button>
          )
        }
      />

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <EmptyState icon={Shield} title={t("sessions.noSessions")} />
          ) : (
            <div className="divide-y divide-[color:var(--border)]">
              {sessions.map((session) => (
                <div key={session.id} className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-[color:var(--accent)] flex items-center justify-center shrink-0">
                    <Monitor className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {session.userAgent?.split(" ")[0] ||
                        t("sessions.unknownDevice")}
                    </p>
                    <p className="text-xs text-[color:var(--muted-foreground)]">
                      IP: {session.ipAddress || t("common.unknown")} •{" "}
                      {t("sessions.signedIn")}{" "}
                      {format(new Date(session.createdAt), "PPp", {
                        locale: getDateLocale(),
                      })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => revoke.mutate(session.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
