import express from "express";
import {
  getPendingRequests,
  processRequest,
} from "../controllers/officerController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("officer", "head"));

router.get("/requests", getPendingRequests);

router.put("/requests/:requestId/process", processRequest);

export default router;
