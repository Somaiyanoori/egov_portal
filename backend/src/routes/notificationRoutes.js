import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getMyNotifications,
  markAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

// All routes are protected
router.use(protect);

// Get all unread notifications for the logged-in user
router.get("/", getMyNotifications);

// Mark a specific notification as read
router.put("/:notificationId/read", markAsRead);

export default router;
