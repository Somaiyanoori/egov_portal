import db from "../config/db.js";

export const addDocument = async (requestId, filePath) => {
  const query = `
    INSERT INTO documents (request_id, file_path)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const values = [requestId, filePath];
  try {
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (error) {
    console.error("Error adding document in model:", error);
    throw error;
  }
};
