import pool from "../config/db.js";

/** Creates a new service. */
export const createService = async (serviceData) => {
  const { name, description, department_id, fee, is_active } = serviceData;
  const query = `
    INSERT INTO services (name, description, department_id, fee, is_active)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [name, description, department_id, fee, is_active];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

/** Finds all services with their associated department name. */
export const findAllServicesWithDetails = async () => {
  const query = `
    SELECT 
        s.id, s.name, s.fee, s.is_active, d.name as department_name 
    FROM services s
    JOIN departments d ON s.department_id = d.id
    ORDER BY d.name, s.name ASC;
  `;
  const { rows } = await pool.query(query);
  return rows;
};

/** Finds a single service by its ID. */
export const findServiceById = async (id) => {
  const query = `
    SELECT s.*, d.name as department_name 
    FROM services s
    JOIN departments d ON s.department_id = d.id
    WHERE s.id = $1;
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

export const updateServiceById = async (id, serviceData) => {
  const fields = Object.keys(serviceData);
  if (fields.length === 0) {
    return findServiceById(id);
  }
  const setClauses = fields.map((field, index) => `"${field}" = $${index + 1}`).join(", ");
  const values = Object.values(serviceData);
  const query = `
    UPDATE services 
    SET ${setClauses}, updated_at = NOW()
    WHERE id = $${fields.length + 1}
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [...values, id]);
  return rows[0];
};

  // Add updated_at timestamp automatically
  const setClauses = fields
    .map((field, index) => `"${field}" = $${index + 1}`)
    .join(", ");
  const values = Object.values(serviceData);

  const query = `
    UPDATE services 
    SET ${setClauses}, updated_at = NOW()
    WHERE id = $${fields.length + 1}
    RETURNING *;
  `;

  const { rows } = await pool.query(query, [...values, id]);
  return rows[0];
};

/** Deletes a service by its ID. */
export const deleteServiceById = async (id) => {
  const query = "DELETE FROM services WHERE id = $1 RETURNING *;";
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};
