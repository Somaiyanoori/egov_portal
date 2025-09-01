import pool from "../config/db.js";

export const createUser = async (userData) => {
  const { name, email, password, role, department_id = null } = userData;
  const query = `
        INSERT INTO users (name, email, password, role, department_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, email, role, department_id;
    `;
  const values = [name, email, password, role, department_id];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const findUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1";
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

export const findUserById = async (id) => {
  const query =
    "SELECT id, name, email, role, department_id FROM users WHERE id = $1";
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

export const findAllUsers = async () => {
  const query =
    "SELECT u.id, u.name, u.email, u.role, d.name as department_name FROM users u LEFT JOIN departments d ON u.department_id = d.id ORDER BY u.created_at DESC";
  const { rows } = await pool.query(query);
  return rows;
};

export const updateUserById = async (id, userData) => {
  const { name, email, role, department_id } = userData;
  const query = `
        UPDATE users 
        SET name = $1, email = $2, role = $3, department_id = $4 
        WHERE id = $5
        RETURNING id, name, email, role, department_id;
    `;
  const values = [name, email, role, department_id, id];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const deleteUserById = async (id) => {
  const query = "DELETE FROM users WHERE id = $1 RETURNING id;";
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};
