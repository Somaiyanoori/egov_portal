import pool from "../config/db.js";

// Creates a new department in the database.
export const createDepartment = async (name, description) => {
  const query =
    "INSERT INTO departments (name, description) VALUES ($1, $2) RETURNING *";
  const { rows } = await pool.query(query, [name, description]);
  return rows[0];
};

// Retrieves all departments from the database, ordered by name.
export const findAllDepartments = async () => {
  const { rows } = await pool.query(
    "SELECT * FROM departments ORDER BY name ASC"
  );
  return rows;
};

// Updates an existing department's details by its ID.
export const updateDepartmentById = async (id, name, description) => {
  const query =
    "UPDATE departments SET name = $1, description = $2 WHERE id = $3 RETURNING *";
  const { rows } = await pool.query(query, [name, description, id]);
  return rows[0];
};

// Deletes a department from the database by its ID.
export const deleteDepartmentById = async (id) => {
  const { rows } = await pool.query(
    "DELETE FROM departments WHERE id = $1 RETURNING *",
    [id]
  );
  return rows[0];
};

// Finds a single department by its ID.
export const findDepartmentById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM departments WHERE id = $1", [
    id,
  ]);
  return rows[0];
};
