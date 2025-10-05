import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

if (isProduction) {
  dbConfig.ssl = {
    rejectUnauthorized: false,
  };
}

const pool = new pg.Pool(dbConfig);

pool.on("connect", () => {
  console.log("Successfully connected to the PostgreSQL database.");
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export default pool;
