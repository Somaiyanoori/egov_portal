import pool from "../config/db.js";

// Create a new service
export const createService = async (serviceData) => {
  const { name, description, department_id, fee, required_documents } =
    serviceData;
  const query = `
    INSERT INTO services (name, description, department_id, fee, required_documents)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [
    name,
    description,
    department_id,
    fee,
    JSON.stringify(required_documents || []),
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Get all services with department details
export const findAllServicesWithDetails = async () => {
  const query = `
    SELECT s.id, s.name, s.description, s.fee, s.is_active, d.name as department_name 
    FROM services s
    JOIN departments d ON s.department_id = d.id
    ORDER BY d.name, s.name ASC;
  `;
  const { rows } = await pool.query(query);
  return rows;
};

// Get a single service by ID
export const findServiceById = async (id) => {
  const query = `
    SELECT s.id, s.name, s.description, s.fee, s.is_active, s.required_documents, d.name as department_name 
    FROM services s
    JOIN departments d ON s.department_id = d.id
    WHERE s.id = $1;
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

// Update a service
export const updateService = async (id, serviceData) => {
  const {
    name,
    description,
    department_id,
    fee,
    required_documents,
    is_active,
  } = serviceData;
  const query = `
    UPDATE services
    SET name = $1,
        description = $2,
        department_id = $3,
        fee = $4,
        required_documents = $5,
        is_active = $6,
        updated_at = NOW()
    WHERE id = $7
    RETURNING *;
  `;
  const values = [
    name,
    description,
    department_id,
    fee,
    JSON.stringify(required_documents || []),
    is_active,
    id,
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Delete a service
export const deleteService = async (id) => {
  const query = `
    DELETE FROM services
    WHERE id = $1
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};
