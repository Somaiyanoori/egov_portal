import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import pool from "./src/config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3012;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error(" Database connection error", err));

app.get("/", (req, res) => {
  res.send(`Welcome to my site.`);
});

app.listen(PORT, () => {
  console.log(`your server is running http://localhost:${PORT}`);
});
