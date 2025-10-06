import api from "./api.js";

/**
 * Fetches all notifications for the currently logged-in user.
 */
export const getMyNotifications = async () => {
  try {
    const response = await api.get("/api/notifications");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const markAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/api/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};
