import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mount Auth Routes
app.use("/api/auth", authRoutes);

export default app;
