// src/pages/admin/ManageDepartmentsPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
  getAllDepartments,
  createDepartment,
  deleteDepartment,
} from "../../services/adminService.js";

const ManageDepartmentsPage = () => {
  // --- Hooks & State ---
  const { t } = useLanguage();
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Data Fetching ---
  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllDepartments();
      setDepartments(data);
    } catch (err) {
      setError("Failed to fetch departments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // --- Event Handlers ---
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Send the request to create a new department
      const newDepartment = await createDepartment(formData);
      // Optimistic UI Update: Add the new department to the list immediately
      setDepartments((prev) => [...prev, newDepartment.department]);
      setFormData({ name: "", description: "" }); // Reset form
    } catch (err) {
      setError(err.message || "Failed to create department.");
    }
  };

  const handleDelete = async (departmentId) => {
    // Using a more generic confirmation message
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteDepartment(departmentId);
        // Optimistic UI Update: Remove the department from the list
        setDepartments((prev) => prev.filter((dep) => dep.id !== departmentId));
      } catch (err) {
        setError("Failed to delete department.");
      }
    }
  };

  // --- Render Logic ---
  if (loading) return <div>Loading Departments...</div>;

  return (
    <>
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1>{t("deptManagementTitle")}</h1>
        <Link to="/app/dashboard" className="btn btn-outline-secondary">
          <i className="fas fa-arrow-left me-2"></i>
          {t("backToDashboard")}
        </Link>
      </header>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Form to create a new department */}
      <div className="card shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="card-title">{t("createNewDeptTitle")}</h5>
          <hr className="mt-2 mb-4" />
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-5 mb-3">
                <label htmlFor="name" className="form-label">
                  {t("deptNameLabel")}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-5 mb-3">
                <label htmlFor="description" className="form-label">
                  {t("deptDescLabel")}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-2 d-flex align-items-end mb-3">
                <button type="submit" className="btn btn-primary w-100">
                  {t("createDeptButton")}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Table of existing departments */}
      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="mb-0">{t("existingDeptsTitle")}</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>{t("tableHeaderId")}</th>
                  <th>{t("tableHeaderName")}</th>
                  <th>{t("tableHeaderDescription")}</th>
                  <th>{t("tableHeaderActions")}</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dep) => (
                  <tr key={dep.id}>
                    <td>{dep.id}</td>
                    <td>{dep.name}</td>
                    <td>{dep.description || "N/A"}</td>
                    <td>
                      <div className="d-flex gap-2">
                        {/* The "Edit" button is now a functional Link */}
                        <Link
                          to={`/app/admin/departments/edit/${dep.id}`}
                          className="btn btn-sm btn-outline-warning"
                        >
                          {t("editButton")}
                        </Link>
                        <button
                          onClick={() => handleDelete(dep.id)}
                          className="btn btn-sm btn-outline-danger"
                        >
                          {t("deleteButton")}
                        </button>
                      </div>
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

export default ManageDepartmentsPage;
