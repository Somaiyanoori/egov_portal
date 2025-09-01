import pool from "../config/db.js";

export const createDepartment = async (name, description) => {
  const query =
    "INSERT INTO departments (name, description) VALUES ($1, $2) RETURNING *";
  const { rows } = await pool.query(query, [name, description]);
  return rows[0];
};

export const findAllDepartments = async () => {
  const { rows } = await pool.query(
    "SELECT * FROM departments ORDER BY name ASC"
  );
  return rows;
};

export const updateDepartmentById = async (id, name, description) => {
  const query =
    "UPDATE departments SET name = $1, description = $2 WHERE id = $3 RETURNING *";
  const { rows } = await pool.query(query, [name, description, id]);
  return rows[0];
};

export const deleteDepartmentById = async (id) => {
  const { rows } = await pool.query(
    "DELETE FROM departments WHERE id = $1 RETURNING *",
    [id]
  );
  return rows[0];
};
