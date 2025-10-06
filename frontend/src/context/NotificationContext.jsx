import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext.jsx";
import {
  getMyNotifications,
  markAsRead,
} from "../services/notificationService.js";

// Create a context for notifications.
const NotificationContext = createContext();

// Create a provider component to manage and distribute notification state.
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated } = useAuth();

  // Effect to handle fetching notifications based on authentication status.
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();

      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated]);

  // Fetches notifications from the API and updates the state.
  const fetchNotifications = async () => {
    try {
      const data = await getMyNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.notifications.filter((n) => !n.is_read).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const markOneAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const value = {
    notifications,
    unreadCount,
    markOneAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
export const useNotifications = () => useContext(NotificationContext);
