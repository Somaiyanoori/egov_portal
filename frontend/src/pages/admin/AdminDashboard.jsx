import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();

  const cardStyle = {
    textDecoration: "none",
    color: "inherit",
  };

  const cardBodyStyle = {
    minHeight: "120px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };

  return (
    <div>
      <h1 className="mb-4">Admin Dashboard</h1>
      <p>Welcome, {user.name}!</p>

      <div className="row">
        {/* Card for User Management */}
        <div className="col-md-4 mb-4">
          <Link to="/admin/users" style={cardStyle}>
            <div className="card text-center h-100 shadow-sm">
              <div className="card-body" style={cardBodyStyle}>
                <h5 className="card-title">Manage Users</h5>
                <p className="card-text">View, edit, and manage all users.</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Card for Department Management */}
        <div className="col-md-4 mb-4">
          <Link to="/admin/departments" style={cardStyle}>
            <div className="card text-center h-100 shadow-sm">
              <div className="card-body" style={cardBodyStyle}>
                <h5 className="card-title">Manage Departments</h5>
                <p className="card-text">Add, edit, or remove departments.</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Card for Reports */}
        <div className="col-md-4 mb-4">
          <Link to="/admin/reports" style={cardStyle}>
            <div className="card text-center h-100 shadow-sm">
              <div className="card-body" style={cardBodyStyle}>
                <h5 className="card-title">View Reports</h5>
                <p className="card-text">
                  See system statistics and performance.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
