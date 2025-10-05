// src/app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// ایمپورت تمام روت‌ها
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import citizenRoutes from "./routes/citizenRoutes.js";
import officerRoutes from "./routes/officerRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import requestRoutes from "./routes/requestRoutes.js"; // << ایمپورت مهم
import notificationRoutes from "./routes/notificationRoutes.js";
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const allowedOrigins = ["http://localhost:5173", process.env.CORS_ORIGIN];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ثبت تمام روت‌های API
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/citizen", citizenRoutes);
app.use("/api/officer", officerRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/requests", requestRoutes); // <<<< این خط حیاتی است
app.use("/api/notifications", notificationRoutes);
export default app;
