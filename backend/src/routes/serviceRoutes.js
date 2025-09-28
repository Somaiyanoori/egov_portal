import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getAllServicesHandler } from "../controllers/adminController.js";

const router = express.Router();

router.get("/", protect, getAllServicesHandler);

export default router;
