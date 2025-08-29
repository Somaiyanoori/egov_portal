import express from "express";
import { protect, authorize } from "../middlewares/authMiddleware.js";

import { getAllUsers } from "../controllers/adminController.js";
import { getDepartmentReports } from "../controllers/reportController.js";

const router = express.Router();

router.get("/users", protect, authorize("admin"));
router.get(
  "/reports",
  protect,
  authorize("admin", "head"),
  getDepartmentReports
);

export default router;
