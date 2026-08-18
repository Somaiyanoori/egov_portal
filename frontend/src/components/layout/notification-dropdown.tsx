import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  CheckCheck,
  X,
  Info,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
} from "@/hooks/use-notifications";
import type { Notification, NotificationType } from "@/types";

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

export function NotificationDropdown() {
  const navigate = useNavigate();
  const { data } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const notifications = data?.data?.notifications ?? [];
  const unreadCount = data?.data?.unreadCount ?? 0;

  const handleClick = (notif: Notification) => {
    if (!notif.isRead) {
      markAsRead.mutate(notif.id);
    }
    if (notif.link) {
      navigate(notif.link);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0" sideOffset={8}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[color:var(--border)]">
          <div>
            <h3 className="font-semibold">Notifications</h3>
            <p className="text-xs text-[color:var(--muted-foreground)] mt-0.5">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        {/* List */}
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-[color:var(--accent)] flex items-center justify-center mb-3">
                <Bell className="h-8 w-8 text-[color:var(--muted-foreground)]" />
              </div>
              <p className="text-sm text-[color:var(--muted-foreground)]">
                No notifications yet
              </p>
              <p className="text-xs text-[color:var(--muted-foreground)] mt-1">
                We'll notify you when something arrives
              </p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {notifications.map((notif) => {
                const Icon = iconMap[notif.type];
                const colorClass = colorMap[notif.type];

                return (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className={cn(
                      "flex gap-3 p-3 cursor-pointer transition-colors border-b border-[color:var(--border)] last:border-0",
                      "hover:bg-[color:var(--accent)]",
                      !notif.isRead && "bg-[color:var(--accent)]/40",
                    )}
                    onClick={() => handleClick(notif)}
                  >
                    <div
                      className={cn(
                        "h-9 w-9 rounded-full flex items-center justify-center shrink-0",
                        colorClass,
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            "text-sm truncate",
                            !notif.isRead ? "font-semibold" : "font-medium",
                          )}
                        >
                          {notif.title}
                        </p>
                        {!notif.isRead && (
                          <span className="h-2 w-2 rounded-full bg-brand-500 shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-[color:var(--muted-foreground)] mt-0.5 line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-[color:var(--muted-foreground)] mt-1">
                        {formatDistanceToNow(new Date(notif.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-2 border-t border-[color:var(--border)]">
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => navigate("/app/notifications")}
            >
              View all notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
