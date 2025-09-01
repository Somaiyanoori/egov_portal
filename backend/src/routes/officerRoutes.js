import express from "express";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import {
  getPendingRequests,
  processRequest,
  searchRequests,
} from "../controllers/officerController.js";
import { getRequestDetailsHandler } from "../controllers/requestController.js";

const router = express.Router();

// All officer routes are protected and require 'officer' or 'head' role
router.use(protect, authorize("officer", "head"));

router.get("/requests/pending", getPendingRequests);
router.put("/requests/:requestId/process", processRequest);
router.get("/requests/:id", getRequestDetailsHandler);
router.get("/requests", searchRequests);
export default router;
