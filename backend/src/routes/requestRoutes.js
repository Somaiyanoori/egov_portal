import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getRequestDetailsHandler } from "../controllers/requestController.js";

const router = express.Router();

router.get("/:id", protect, getRequestDetailsHandler);

export default router;
