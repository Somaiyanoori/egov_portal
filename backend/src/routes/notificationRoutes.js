import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getMyNotifications,
  markAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

// All notification routes require a user to be logged in.
router.use(protect);

// Route to get all notifications for the current user
router.get("/", getMyNotifications);

// Route to mark a specific notification as read
router.put("/:notificationId/read", markAsRead);

export default router;
