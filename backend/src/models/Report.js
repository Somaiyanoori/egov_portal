import pool from "../config/db.js";

// Retrieves overall system statistics, including request counts, user totals, and revenue.
export const getOverallStats = async () => {
  const query = `
        SELECT
            (SELECT COUNT(*) FROM requests) AS total_requests,
            
            (SELECT COUNT(*) FROM requests WHERE status = 'approved') AS approved_requests,
            
            (SELECT COUNT(*) FROM requests WHERE status = 'rejected') AS rejected_requests,
            
            (SELECT COUNT(*) FROM requests WHERE status IN ('submitted', 'under_review')) AS pending_requests,
            
            (SELECT COUNT(*) FROM users) AS total_users,
            
            (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'success') AS total_revenue
    `;
  const { rows } = await pool.query(query);
  return rows[0];
};

// Calculates and returns request and revenue statistics grouped by department.
export const getStatsByDepartment = async () => {
  const query = `
        SELECT
            d.id,
            d.name AS department_name,
            COUNT(r.id) AS total_requests,
            
            COUNT(r.id) FILTER (WHERE r.status = 'approved') AS approved_requests,
            
            COUNT(r.id) FILTER (WHERE r.status = 'rejected') AS rejected_requests,
            
            COALESCE(SUM(p.amount) FILTER (WHERE p.status = 'success'), 0) AS department_revenue
        FROM departments d
        LEFT JOIN services s ON d.id = s.department_id
        LEFT JOIN requests r ON s.id = r.service_id
        LEFT JOIN payments p ON r.id = p.request_id
        GROUP BY d.id, d.name
        ORDER BY total_requests DESC;
    `;
  const { rows } = await pool.query(query);
  return rows;
};
