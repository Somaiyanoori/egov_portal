import db from "../config/db.js";

export const createUser = async (
  name,
  email,
  hashedPassword,
  role,
  department_id
) => {
  const query = `
    INSERT INTO users (name, email, password, role, department_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, role;
  `;
  const values = [name, email, hashedPassword, role, department_id];
  const { rows } = await db.query(query, values);
  return rows[0];
};

export const findUserByEmail = async (email) => {
  const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return rows[0];
};
