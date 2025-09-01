import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //Check if user still exists in DB
    const { rows } = await pool.query(
      "SELECT id, role FROM users WHERE id = $1",
      [decoded.id]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed." });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' is not authorized to access this route.`,
      });
    }
    next();
  };
};
