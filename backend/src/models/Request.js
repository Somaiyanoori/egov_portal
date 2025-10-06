// Import the database connection pool.
import pool from "../config/db.js";

// Creates a new service request in the database.
export const createRequest = async (citizenId, serviceId, notes = null) => {
  const query = `
    INSERT INTO requests (citizen_id, service_id, status, notes)
    VALUES ($1, $2, 'submitted', $3)
    RETURNING *;
  `;
  const values = [citizenId, serviceId, notes];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Finds all requests submitted by a specific citizen, including service and department names.
export const findRequestsByCitizenId = async (citizenId) => {
  const query = `
    SELECT 
        r.id, r.status, r.created_at, 
        s.name as service_name, 
        d.name as department_name
    FROM requests r
    JOIN services s ON r.service_id = s.id
    JOIN departments d ON s.department_id = d.id
    WHERE r.citizen_id = $1
    ORDER BY r.created_at DESC;
  `;
  const { rows } = await pool.query(query, [citizenId]);
  return rows;
};

// Retrieves a single request by its ID with comprehensive details and related data.
export const findRequestByIdWithDetails = async (id) => {
  const query = `
    SELECT
      r.id, r.status, r.created_at, r.updated_at, r.notes,
      json_build_object('id', u.id, 'name', u.name, 'email', u.email) AS citizen,
      json_build_object('id', s.id, 'name', s.name) AS service,
      json_build_object('id', d.id, 'name', d.name) AS department,
      COALESCE(
        (SELECT json_agg(
          json_build_object('id', doc.id, 'file_path', doc.file_path, 'uploaded_at', doc.uploaded_at)
        ) FROM documents doc WHERE doc.request_id = r.id),
        '[]'::json
      ) AS documents
    FROM requests r
    JOIN users u ON r.citizen_id = u.id
    JOIN services s ON r.service_id = s.id
    JOIN departments d ON s.department_id = d.id
    WHERE r.id = $1;
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

// Finds all pending requests for a specific department.
export const findPendingRequestsByDepartment = async (departmentId) => {
  const query = `
        SELECT r.id, r.status, r.created_at, u.name as citizen_name, s.name as service_name
        FROM requests r
        JOIN users u ON r.citizen_id = u.id
        JOIN services s ON r.service_id = s.id
        WHERE s.department_id = $1 AND r.status IN ('submitted', 'under_review')
        ORDER BY r.created_at ASC;
    `;
  const { rows } = await pool.query(query, [departmentId]);
  return rows;
};

// Updates the status of a specific request by its ID.
export const updateRequestStatus = async (requestId, newStatus) => {
  const query = `
        UPDATE requests SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *;
    `;
  const { rows } = await pool.query(query, [newStatus, requestId]);
  return rows[0];
};

// Searches for requests within a department using dynamic filters.
export const searchRequestsByDepartment = async (
  departmentId,
  filters = {}
) => {
  let query = `
        SELECT 
            r.id, 
            r.status, 
            r.created_at, 
            u.name as citizen_name, 
            s.name as service_name
        FROM requests r
        JOIN users u ON r.citizen_id = u.id
        JOIN services s ON r.service_id = s.id
        WHERE s.department_id = $1
    `;

  // Parameters for the query
  const params = [departmentId];
  let paramIndex = 2;

  // Dynamically add filter conditions to the query.
  if (filters.status) {
    query += ` AND r.status = $${paramIndex++}`;
    params.push(filters.status);
  }
  if (filters.citizenName) {
    query += ` AND u.name ILIKE $${paramIndex++}`;
    params.push(`%${filters.citizenName}%`);
  }
  if (filters.serviceId) {
    query += ` AND s.id = $${paramIndex++}`;
    params.push(filters.serviceId);
  }
  if (filters.startDate) {
    query += ` AND r.created_at >= $${paramIndex++}`;
    params.push(filters.startDate);
  }
  if (filters.endDate) {
    // Add 1 day to endDate to include the entire day.
    const endDate = new Date(filters.endDate);
    endDate.setDate(endDate.getDate() + 1);
    query += ` AND r.created_at < $${paramIndex++}`;
    params.push(endDate);
  }

  query += ` ORDER BY r.created_at DESC;`;

  console.log("Executing search query:", query);
  console.log("With params:", params);

  const { rows } = await pool.query(query, params);
  return rows;
};
