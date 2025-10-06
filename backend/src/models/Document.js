import pool from "../config/db.js";

// Adds a new document record to the database.
export const addDocument = async (requestId, filePath) => {
  const query = `
        INSERT INTO documents (request_id, file_path)
        VALUES ($1, $2)
        RETURNING *;
    `;
  const { rows } = await pool.query(query, [requestId, filePath]);
  return rows[0];
};
