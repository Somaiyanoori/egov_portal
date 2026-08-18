import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  CheckCheck,
  Trash2,
  Info,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { cn } from "@/lib/utils";
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
} from "@/hooks/use-notifications";
import type { NotificationType } from "@/types";

const iconMap: Record<NotificationType, React.ElementType> = {
  INFO: Info,
  SUCCESS: CheckCircle2,
  WARNING: AlertTriangle,
  ERROR: AlertCircle,
  REQUEST_UPDATE: Bell,
  SYSTEM: Info,
};

const colorMap: Record<NotificationType, string> = {
  INFO: "text-blue-500 bg-blue-500/10",
  SUCCESS: "text-green-500 bg-green-500/10",
  WARNING: "text-yellow-500 bg-yellow-500/10",
  ERROR: "text-red-500 bg-red-500/10",
  REQUEST_UPDATE: "text-brand-500 bg-brand-500/10",
  SYSTEM: "text-gray-500 bg-gray-500/10",
};

export function NotificationsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const { data, isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const deleteNotif = useDeleteNotification();

  const notifications = data?.data?.notifications ?? [];
  const unreadCount = data?.data?.unreadCount ?? 0;

  const filtered =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description={
          unreadCount > 0
            ? `You have ${unreadCount} unread notifications`
            : "All caught up!"
        }
        action={
          unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </Button>
          )
        }
      />

      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-[color:var(--accent)] rounded-lg p-1 w-fit">
        <Button
          variant={filter === "all" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All ({notifications.length})
        </Button>
        <Button
          variant={filter === "unread" ? "default" : "ghost"}
          size="sm"
          onClick={() => setFilter("unread")}
        >
          Unread ({unreadCount})
        </Button>
      </div>

      {/* List */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <LoadingSpinner fullPage />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Bell}
              title={
                filter === "unread"
                  ? "No unread notifications"
                  : "No notifications"
              }
              description="We'll notify you when something arrives"
            />
          ) : (
            <AnimatePresence initial={false}>
              {filtered.map((notif) => {
                const Icon = iconMap[notif.type];
                const colorClass = colorMap[notif.type];

                return (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={cn(
                      "flex gap-4 p-4 border-b border-[color:var(--border)] last:border-0 hover:bg-[color:var(--accent)]/50 transition-colors",
                      !notif.isRead && "bg-[color:var(--accent)]/30",
                    )}
                  >
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                        colorClass,
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4
                              className={cn(
                                "text-sm truncate",
                                !notif.isRead ? "font-semibold" : "font-medium",
                              )}
                            >
                              {notif.title}
                            </h4>
                            {!notif.isRead && (
                              <span className="h-2 w-2 rounded-full bg-brand-500" />
                            )}
                          </div>
                          <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
                            {notif.message}
                          </p>
                          <p className="text-xs text-[color:var(--muted-foreground)] mt-2">
                            {formatDistanceToNow(new Date(notif.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {notif.link && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (!notif.isRead) markAsRead.mutate(notif.id);
                                navigate(notif.link!);
                              }}
                            >
                              View
                            </Button>
                          )}
                          {!notif.isRead && (
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => markAsRead.mutate(notif.id)}
                              title="Mark as read"
                            >
                              <CheckCheck className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => deleteNotif.mutate(notif.id)}
                            title="Delete"
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
