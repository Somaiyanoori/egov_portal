// src/controllers/notificationController.js
import * as NotificationModel from "../models/Notification.js";

export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await NotificationModel.findNotificationsByUserId(
      userId
    );
    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    // Security check
    const notification = await NotificationModel.findNotificationById(
      notificationId
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }
    if (notification.user_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized." });
    }
    const updatedNotification = await NotificationModel.markNotificationAsRead(
      notificationId
    );
    res
      .status(200)
      .json({
        message: "Notification marked as read.",
        notification: updatedNotification,
      });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Server error." });
  }
};
