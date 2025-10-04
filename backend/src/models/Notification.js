import pool from "../config/db.js";

export const createNotification = async (userId, message) => {
  const query = `
    INSERT INTO notifications (user_id, message, is_read)
    VALUES ($1, $2, FALSE)
    RETURNING *;
  `;
  try {
    const { rows } = await pool.query(query, [userId, message]);
    return rows[0];
  } catch (error) {
    console.error("Database Error in createNotification:", error);
    throw error;
  }
};

export const findNotificationsByUserId = async (userId) => {
  const query = `
    SELECT * FROM notifications 
    WHERE user_id = $1 
    ORDER BY created_at DESC;
  `;
  try {
    const { rows } = await pool.query(query, [userId]);
    return rows;
  } catch (error) {
    console.error("Database Error in findNotificationsByUserId:", error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  const query = `
    UPDATE notifications 
    SET is_read = TRUE 
    WHERE id = $1 
    RETURNING *;
  `;
  try {
    const { rows } = await pool.query(query, [notificationId]);
    return rows[0];
  } catch (error) {
    console.error("Database Error in markNotificationAsRead:", error);
    throw error;
  }
};

export const findNotificationById = async (notificationId) => {
  const query = "SELECT * FROM notifications WHERE id = $1";
  const { rows } = await pool.query(query, [notificationId]);
  return rows[0];
};
