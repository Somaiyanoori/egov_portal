import express from "express";
import { protect, authorize } from "../middlewares/authMiddleware.js";

import {
  createDepartmentHandler,
  getAllDepartmentsHandler,
  createServiceHandler,
  getAllServicesHandler,
  getAllUsersHandler,
} from "../controllers/adminController.js";

const router = express.Router();

// All admin routes are protected and require 'admin' role
router.use(protect, authorize("admin"));

// Department Routes
router
  .route("/departments")
  .post(createDepartmentHandler)
  .get(getAllDepartmentsHandler);

// Service Routes
router.route("/services").post(createServiceHandler).get(getAllServicesHandler);

// User Management Routes
router.route("/users").get(getAllUsersHandler);

// Report routes (commented out until implemented)
/*
router.get("/reports", getDepartmentReports);
*/

export default router;
