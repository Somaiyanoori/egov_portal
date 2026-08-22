import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { notificationService } from "@/services/notification.service";
import { socketClient } from "@/lib/socket";
import { useAuthStore } from "@/stores/auth-store";
import type { Notification } from "@/types";

export function useNotifications() {
  const { isAuthenticated, user } = useAuthStore();

  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationService.list({ limit: 20 }),
    refetchInterval: 60000,
    enabled: isAuthenticated && !!user,
    retry: false,
  });
}

export function useUnreadCount() {
  const { isAuthenticated, user } = useAuthStore();

  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => notificationService.unreadCount(),
    refetchInterval: 60000,
    enabled: isAuthenticated && !!user,
    retry: false,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read");
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useRealtimeNotifications() {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      socketClient.disconnect();
      return;
    }

    // Small delay to ensure cookies are set
    const timer = setTimeout(() => {
      socketClient.connect();
    }, 500);

    const handleNewNotification = (notification: Notification) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast(notification.title, {
        description: notification.message,
        action: notification.link
          ? {
              label: "View",
              onClick: () => {
                window.location.href = notification.link!;
              },
            }
          : undefined,
      });
    };

    const handleCountUpdate = (data: { unreadCount: number }) => {
      queryClient.setQueryData(["notifications", "unread-count"], {
        success: true,
        message: "Updated",
        data,
      });
    };

    socketClient.on("notification:new", handleNewNotification);
    socketClient.on("notification:count", handleCountUpdate);

    return () => {
      clearTimeout(timer);
      socketClient.off("notification:new", handleNewNotification);
      socketClient.off("notification:count", handleCountUpdate);
    };
  }, [isAuthenticated, user, queryClient]);
}
