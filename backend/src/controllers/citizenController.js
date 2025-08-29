// src/controllers/citizenController.js
import db from "../config/db.js";

export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rows } = await db.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
