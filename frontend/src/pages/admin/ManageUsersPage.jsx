import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { getAllUsers, deleteUser } from "../../services/adminService.js";

const ManageUsersPage = () => {
  // --- Hooks ---
  const { t } = useLanguage();

  // --- State Management ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Data Fetching ---
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (err) {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  // --- Event Handlers ---
  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        // Refresh the list after successful deletion
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      } catch (err) {
        setError("Failed to delete user.");
      }
    }
  };

  // --- Render Logic ---
  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h1>{t("userManagementTitle")}</h1>
        <div>
          {/* دکمه جدید برای ایجاد کاربر */}
          <Link to="/app/admin/users/create" className="btn btn-primary me-2">
            <i className="fas fa-plus me-2"></i>
            {t("createNewUser")}
          </Link>
          <Link to="/app/dashboard" className="btn btn-secondary">
            {t("backToDashboard")}
          </Link>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>{t("tableHeaderId")}</th>
                  <th>{t("tableHeaderName")}</th>
                  <th>{t("tableHeaderEmail")}</th>
                  <th>{t("tableHeaderRole")}</th>
                  <th>{t("tableHeaderDepartment")}</th>
                  <th>{t("tableHeaderActions")}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="badge bg-primary">{user.role}</span>
                    </td>
                    <td>{user.department_name || "N/A"}</td>
                    <td>
                      <Link
                        to={`/app/admin/users/edit/${user.id}`}
                        className="btn btn-sm btn-warning me-2"
                      >
                        {t("editButton")}
                      </Link>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="btn btn-sm btn-danger"
                      >
                        {t("deleteButton")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsersPage;
