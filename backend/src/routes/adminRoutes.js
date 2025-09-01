import express from "express";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { getSystemReports } from "../controllers/reportController.js";
import {
  createDepartmentHandler,
  getAllDepartmentsHandler,
  createServiceHandler,
  getAllServicesHandler,
  getAllUsersHandler,
  updateUserHandler,
  deleteUserHandler,
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
router.route("/users/:id").put(updateUserHandler).delete(deleteUserHandler);
// Report route is for 'admin' and 'head'
router.get("/reports", authorize("admin", "head"), getSystemReports);
export default router;
