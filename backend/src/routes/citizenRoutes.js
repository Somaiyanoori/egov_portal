import express from "express";
import {
  createRequestHandler,
  getUserRequestsHandler,
} from "../controllers/requestController.js";
import { getMyProfile } from "../controllers/citizenController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();
router.get("/profile", protect, getMyProfile);

router.post(
  "/requests/create",
  protect,
  upload.array("documents", 5),
  createRequestHandler
);
router.get("/requests", protect, getUserRequestsHandler);

export default router;
