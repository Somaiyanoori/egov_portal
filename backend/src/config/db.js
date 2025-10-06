// Imports the necessary libraries: pg for PostgreSQL and dotenv for environment variables.
import pg from "pg";
import dotenv from "dotenv";

// Loads environment variables from a .env file into process.env.
dotenv.config();

// Checks if the current environment is production.
const isProduction = process.env.NODE_ENV === "production";

// Defines the database connection configuration using environment variables.
const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

// Adds SSL configuration if the application is running in a production environment.
if (isProduction) {
  dbConfig.ssl = {
    rejectUnauthorized: false,
  };
}

// Creates a new PostgreSQL connection pool with the specified configuration.
const pool = new pg.Pool(dbConfig);

// Event listener that logs a message when a client successfully connects to the database.
pool.on("connect", () => {
  console.log("Successfully connected to the PostgreSQL database.");
});

// Event listener for errors on idle clients in the pool. It logs the error and exits the process.
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

// Exports the pool instance to be used in other parts of the application.
export default pool;
