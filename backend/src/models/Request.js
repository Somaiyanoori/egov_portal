import pool from "../config/db.js";

export const createRequest = async (citizenId, serviceId) => {
  const query = `
        INSERT INTO requests (citizen_id, service_id, status)
        VALUES ($1, $2, 'submitted')
        RETURNING *;
    `;
  const { rows } = await pool.query(query, [citizenId, serviceId]);
  return rows[0];
};

export const findRequestsByCitizenId = async (citizenId) => {
  const query = `
        SELECT r.id, r.status, r.created_at, s.name as service_name, d.name as department_name
        FROM requests r
        JOIN services s ON r.service_id = s.id
        JOIN departments d ON s.department_id = d.id
        WHERE r.citizen_id = $1
        ORDER BY r.created_at DESC;
    `;
  const { rows } = await pool.query(query, [citizenId]);
  return rows;
};

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

export const updateRequestStatus = async (requestId, newStatus) => {
  const query = `
        UPDATE requests SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *;
    `;
  const { rows } = await pool.query(query, [newStatus, requestId]);
  return rows[0];
};
export const findRequestByIdWithDetails = async (id) => {
  const query = `
        SELECT
            r.id,
            r.status,
            r.created_at,
            r.updated_at,
            json_build_object(
                'id', u.id,
                'name', u.name,
                'email', u.email
            ) AS citizen,
            json_build_object(
                'id', s.id,
                'name', s.name,
                'fee', s.fee
            ) AS service,
            json_build_object(
                'id', d.id,
                'name', d.name
            ) AS department,
            COALESCE(
                (SELECT json_agg(
                    json_build_object(
                        'id', doc.id,
                        'file_path', doc.file_path,
                        'uploaded_at', doc.uploaded_at
                    )
                )
                FROM documents doc WHERE doc.request_id = r.id),
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
