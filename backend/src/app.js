import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// Import all application routes.
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import citizenRoutes from "./routes/citizenRoutes.js";
import officerRoutes from "./routes/officerRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

// Initialize the Express application.
const app = express();

// Configure path variables for ES Modules (__dirname equivalent).
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the list of allowed origins for CORS.
const allowedOrigins = [
  "http://localhost:5173",
  "https://egov-portal-frontend-33b6.onrender.com",
];

// Apply CORS middleware with specific origin validation and credentials support.
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

// Apply standard middleware for parsing JSON, URL-encoded data, and cookies.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from the 'uploads' directory.
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Register all API routes with their base paths.
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/citizen", citizenRoutes);
app.use("/api/officer", officerRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/notifications", notificationRoutes);

export default app;
