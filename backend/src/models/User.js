import pool from "../config/db.js";

/** Creates a new user in the database. */
export const createUser = async (userData) => {
  const {
    name,
    email,
    password,
    role,
    department_id = null,
    national_id = null,
    date_of_birth = null,
    contact_info = null,
    job_title = null,
  } = userData;
  const query = `
    INSERT INTO users (name, email, password, role, department_id, national_id, date_of_birth, contact_info, job_title)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id, name, email, role, department_id, national_id, date_of_birth, contact_info, job_title;
  `;
  const values = [
    name,
    email,
    password,
    role,
    department_id,
    national_id,
    date_of_birth,
    contact_info,
    job_title,
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

/** Finds a single user by their email (includes password for login verification). */
export const findUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1";
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

/** Finds a single user by their ID (excludes password for security). */
export const findUserById = async (id) => {
  const query =
    "SELECT id, name, email, role, department_id, national_id, date_of_birth, contact_info, job_title FROM users WHERE id = $1";
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

/** Finds all users with their department name for the admin list. */
export const findAllUsers = async () => {
  const query = `
    SELECT u.id, u.name, u.email, u.role, d.name as department_name 
    FROM users u 
    LEFT JOIN departments d ON u.department_id = d.id 
    ORDER BY u.created_at DESC`;
  const { rows } = await pool.query(query);
  return rows;
};

export const updateUserById = async (id, userData) => {
  const validUpdates = Object.entries(userData).reduce((acc, [key, value]) => {
    if (value !== "") {
      acc[key] = value;
    }
    return acc;
  }, {});

  const fields = Object.keys(validUpdates);
  const values = Object.values(validUpdates);

  if (fields.length === 0) {
    return findUserById(id);
  }

  // Creates a string like "name" = $1, "email" = $2, ...
  const setClauses = fields
    .map((field, index) => `"${field}" = $${index + 1}`)
    .join(", ");

  const query = `
    UPDATE users 
    SET ${setClauses} 
    WHERE id = $${fields.length + 1}
    RETURNING id, name, email, role, department_id;
  `;

  const { rows } = await pool.query(query, [...values, id]);
  return rows[0];
};

/** Deletes a user by their ID. */
export const deleteUserById = async (id) => {
  const query = "DELETE FROM users WHERE id = $1 RETURNING id;";
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};
