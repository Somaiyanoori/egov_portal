import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import notificationRoutes from "./routes/notificationRoutes.js";

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import citizenRoutes from "./routes/citizenRoutes.js";
import officerRoutes from "./routes/officerRoutes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5173", //react(vite)
      "http://localhost:3000",
      // "https://your-live-frontend.onrender.com" // live mysite
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/citizen", citizenRoutes);
app.use("/api/officer", officerRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the E-Government Portal API!" });
});

export default app;
