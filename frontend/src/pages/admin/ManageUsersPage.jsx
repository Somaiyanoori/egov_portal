// src/pages/admin/ManageUsersPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { getAllUsers, deleteUser } from "../../services/adminService.js";

const RoleBadge = ({ role, t }) => {
  const roleMap = {
    citizen: { className: "bg-secondary", key: "roleCitizen" },
    officer: { className: "bg-info text-dark", key: "roleOfficer" },
    head: { className: "bg-primary", key: "roleOfficer" }, // or a new key
    admin: { className: "bg-danger", key: "roleAdmin" },
  };
  const { className, key } = roleMap[role] || {};
  return <span className={`badge ${className}`}>{t(key)}</span>;
};

const ManageUsersPage = () => {
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (err) {
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      } catch (err) {
        setError("Failed to delete user.");
      }
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1>{t("userManagementTitle")}</h1>
        <Link to="/app/admin/users/create" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>
          {t("addNewUser")}
        </Link>
      </header>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>{t("tableHeaderId")}</th>
                  <th>{t("tableHeaderFullName")}</th>
                  <th>{t("tableHeaderEmail")}</th>
                  <th>{t("tableHeaderRole")}</th>
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
                      <RoleBadge role={user.role} t={t} />
                    </td>
                    <td>
                      <Link
                        to={`/app/admin/users/edit/${user.id}`}
                        className="btn btn-sm btn-outline-warning me-2"
                      >
                        {t("editButton")}
                      </Link>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="btn btn-sm btn-outline-danger"
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
    </>
  );
};

export default ManageUsersPage;
