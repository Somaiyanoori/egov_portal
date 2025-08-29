import db from "../config/db.js";

export const createRequest = async (citizenId, serviceId) => {
  const query = `
    INSERT INTO requests (citizen_id, service_id, status)
    VALUES ($1, $2, 'submitted')
    RETURNING *;
  `;
  const values = [citizenId, serviceId];
  try {
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (error) {
    console.error("Error creating request in model:", error);
    throw error;
  }
};
export const getRequestsByCitizen = async (citizenId) => {
  const query = `
    SELECT r.id, r.status, r.created_at, s.name as service_name
    FROM requests r
    JOIN services s ON r.service_id = s.id
    WHERE r.citizen_id = $1
    ORDER BY r.created_at DESC;
  `;
  try {
    const { rows } = await db.query(query, [citizenId]);
    return rows;
  } catch (error) {
    console.error("Error fetching requests by citizen:", error);
    throw error;
  }
};

export const getPendingRequestsByDepartment = async (departmentId) => {
  const query = `
    SELECT r.id, r.status, r.created_at, u.name as citizen_name, s.name as service_name
    FROM requests r
    JOIN users u ON r.citizen_id = u.id
    JOIN services s ON r.service_id = s.id
    WHERE s.department_id = $1 AND r.status = 'submitted'
    ORDER BY r.created_at ASC; -- قدیمی‌ترین‌ها اول نمایش داده می‌شوند
  `;
  try {
    const { rows } = await db.query(query, [departmentId]);
    return rows;
  } catch (error) {
    console.error("Error fetching pending requests by department:", error);
    throw error;
  }
};

export const updateRequestStatus = async (requestId, newStatus) => {
  const query = `
    UPDATE requests
    SET status = $2
    WHERE id = $1
    RETURNING *;
  `;
  const values = [requestId, newStatus];
  try {
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (error) {
    console.error("Error updating request status:", error);
    throw error;
  }
};
