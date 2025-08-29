import express from "express";
import authRoutes from "./routes/authRoutes.js";
import citizenRoutes from "./routes/citizenRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/citizen", citizenRoutes);

export default app;
