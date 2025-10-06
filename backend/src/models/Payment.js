import pool from "../config/db.js";
// Creates a new payment record in the database.
export const createPayment = async (paymentData) => {
  const { request_id, amount, status, transaction_id } = paymentData;
  const query = `
        INSERT INTO payments (request_id, amount, status, transaction_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
  const values = [request_id, amount, status, transaction_id];
  const { rows } = await pool.query(query, values);
  return rows[0];
};
