import * as NotificationModel from "../models/Notification.js";

export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications =
      await NotificationModel.findUnreadNotificationsByUserId(userId);
    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await NotificationModel.markNotificationAsRead(
      notificationId
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }
    res
      .status(200)
      .json({ message: "Notification marked as read.", notification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Server error." });
  }
};
