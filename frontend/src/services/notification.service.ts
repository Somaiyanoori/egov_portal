import { api } from "@/lib/api";
import type { Notification, PaginationMeta } from "@/types";

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}

export const notificationService = {
  list: (params?: { page?: number; limit?: number; isRead?: boolean }) =>
    api.get<NotificationsResponse>("/notifications", params),

  unreadCount: () =>
    api.get<{ unreadCount: number }>("/notifications/unread-count"),

  markAsRead: (id: string) =>
    api.put<Notification>(`/notifications/${id}/read`),

  markAllAsRead: () => api.put<{ count: number }>("/notifications/read-all"),

  delete: (id: string) => api.delete(`/notifications/${id}`),

  deleteAllRead: () => api.delete<{ count: number }>("/notifications/read"),
};

export type { PaginationMeta };
