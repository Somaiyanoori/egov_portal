import express from "express";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { getSystemReports } from "../controllers/reportController.js";
import {
  createDepartmentHandler,
  getAllDepartmentsHandler,
  updateDepartmentHandler,
  deleteDepartmentHandler,
  createServiceHandler,
  getAllServicesHandler,
  getAllUsersHandler,
  getUserByIdHandler,
  updateUserHandler,
  deleteUserHandler,
  createUserHandler,
  getDepartmentByIdHandler,
} from "../controllers/adminController.js";

const router = express.Router();

// All admin routes are protected and require 'admin' role
router.use(protect, authorize("admin"));

// Department Routes
router
  .route("/departments")
  .get(getAllDepartmentsHandler)
  .post(createDepartmentHandler);

router
  .route("/departments/:id")
  .get(getDepartmentByIdHandler)
  .put(updateDepartmentHandler)
  .delete(deleteDepartmentHandler);

// Service Routes
router.route("/services").post(createServiceHandler).get(getAllServicesHandler);

// User Management Routes
router.route("/users").get(getAllUsersHandler);
router
  .route("/users/:id")
  .get(getUserByIdHandler)
  .put(updateUserHandler)
  .delete(deleteUserHandler);
// Report route is for 'admin' and 'head'
router.get("/reports", authorize("admin", "head"), getSystemReports);
router.route("/users").get(getAllUsersHandler).post(createUserHandler);
export default router;
