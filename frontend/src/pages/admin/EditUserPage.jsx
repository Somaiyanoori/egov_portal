import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
  getUserById,
  updateUser,
  getAllDepartments,
} from "../../services/adminService.js";

const EditUserPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [formData, setFormData] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /** Fetches initial user and department data to populate the form. */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, deptsRes] = await Promise.all([
          getUserById(userId),
          getAllDepartments(),
        ]);

        setFormData({
          name: userRes.user.name || "",
          email: userRes.user.email || "",
          role: userRes.user.role || "citizen",
          password: "", // Always start empty for security
        });

        setDepartments(deptsRes);
      } catch (err) {
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  /** Updates the form state as the admin types. */
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /** Handles form submission to update the user's data. */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dataToSubmit = { ...formData };

    // Don't send the password field if it's empty.
    if (!dataToSubmit.password) {
      delete dataToSubmit.password;
    }

    try {
      await updateUser(userId, dataToSubmit);
      navigate("/app/admin/users");
    } catch (err) {
      setError(err.message || "Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading user data...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!formData) return <div>User not found.</div>;

  return (
    <>
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          {t("editUserTitle")}
          <span>{formData.name}</span>
        </h1>
        <Link to="/app/admin/users" className="btn btn-outline-secondary">
          <i className="fas fa-arrow-left me-2"></i>
          {t("backToList")}
        </Link>
      </header>

      <div className="card shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                {t("fullNameLabel")}
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                {t("emailLabel")}
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="role" className="form-label">
                {t("tableHeaderRole")}
              </label>
              <select
                className="form-select"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="citizen">{t("roleCitizen")}</option>
                <option value="officer">{t("roleOfficer")}</option>
                <option value="head">Department Head</option>
                <option value="admin">{t("roleAdmin")}</option>
              </select>
            </div>

            {/* Conditional fields shown only for officer/head roles. */}
            {(formData.role === "officer" || formData.role === "head") && (
              <>
                <div className="mb-3">
                  <label htmlFor="job_title" className="form-label">
                    Job Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="job_title"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="department_id" className="form-label">
                    {t("tableHeaderDepartment")}
                  </label>
                  <select
                    className="form-select"
                    id="department_id"
                    name="department_id"
                    value={formData.department_id}
                    onChange={handleChange}
                  >
                    <option value="">Select Department...</option>
                    {departments.map((dep) => (
                      <option key={dep.id} value={dep.id}>
                        {dep.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <hr className="my-4" />
            <p className="text-muted">{t("changePasswordHint")}</p>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                {t("newPasswordLabel")}
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Link to="/app/admin/users" className="btn btn-secondary">
                {t("cancelButton")}
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? t("saving") : t("saveChangesButton")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditUserPage;
