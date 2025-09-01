import express from "express";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import {
  createRequestHandler,
  getMyRequestsHandler,
} from "../controllers/citizenController.js";

const router = express.Router();

// All citizen routes are protected and require 'citizen' role
router.use(protect, authorize("citizen"));

router.get("/requests", getMyRequestsHandler);
router.post(
  "/requests/create",
  upload.array("documents", 5),
  createRequestHandler
);

export default router;
