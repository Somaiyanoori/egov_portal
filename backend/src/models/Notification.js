import pool from "../config/db.js";

export const createNotification = async (userId, message) => {
  const query = `
        INSERT INTO notifications (user_id, message, is_read)
        VALUES ($1, $2, FALSE)
        RETURNING *;
    `;
  const { rows } = await pool.query(query, [userId, message]);
  return rows[0];
};

export const findUnreadNotificationsByUserId = async (userId) => {
  const query = `
        SELECT * FROM notifications 
        WHERE user_id = $1 AND is_read = FALSE 
        ORDER BY created_at DESC;
    `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

export const markNotificationAsRead = async (notificationId) => {
  const query = `
        UPDATE notifications 
        SET is_read = TRUE 
        WHERE id = $1 
        RETURNING *;
    `;
  const { rows } = await pool.query(query, [notificationId]);
  return rows[0];
};
