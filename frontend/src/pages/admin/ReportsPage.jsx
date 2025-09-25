// src/pages/admin/ReportsPage.jsx
import React, { useState, useEffect } from "react";
import { getSystemReports } from "../../services/adminService";
import { Link } from "react-router-dom";
const StatCard = ({ title, value, colorClass = "bg-light" }) => (
  <div className="col-md-3 mb-4">
    <div className={`card text-center h-100 ${colorClass}`}>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text fs-2 fw-bold">{value}</p>
      </div>
    </div>
  </div>
);

const ReportsPage = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getSystemReports();
        setReports(data);
      } catch (err) {
        setError("Failed to fetch reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <div>Loading reports...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!reports) return <div>No report data available.</div>;

  const { overallStats, statsByDepartment } = reports;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>System Reports</h1>
        <Link to="/dashboard" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>
      <div className="row">
        <StatCard
          title="Total Requests"
          value={overallStats.total_requests}
          colorClass="bg-primary text-white"
        />
        <StatCard
          title="Approved Requests"
          value={overallStats.approved_requests}
          colorClass="bg-success text-white"
        />
        <StatCard
          title="Rejected Requests"
          value={overallStats.rejected_requests}
          colorClass="bg-danger text-white"
        />
        <StatCard
          title="Total Users"
          value={overallStats.total_users}
          colorClass="bg-info text-dark"
        />
      </div>

      <h2 className="mt-5 mb-3">Statistics by Department</h2>

      {/* جدول آمار به تفکیک دپارتمان */}
      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
            <th>Department Name</th>
            <th>Total Requests</th>
            <th>Approved</th>
            <th>Rejected</th>
            <th>Revenue (Toman)</th>
          </tr>
        </thead>
        <tbody>
          {statsByDepartment.map((dep) => (
            <tr key={dep.id}>
              <td>{dep.department_name}</td>
              <td>{dep.total_requests}</td>
              <td>{dep.approved_requests}</td>
              <td>{dep.rejected_requests}</td>
              <td>
                {parseFloat(dep.department_revenue).toLocaleString("fa-IR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsPage;
