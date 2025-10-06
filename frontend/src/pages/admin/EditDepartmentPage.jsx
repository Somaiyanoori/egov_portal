import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
  getDepartmentById,
  updateDepartment,
} from "../../services/adminService.js";

// Component for editing an existing department.
const EditDepartmentPage = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect to fetch the department's data when the component mounts or ID changes.
  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const data = await getDepartmentById(departmentId);
        setFormData({
          name: data.department.name,
          description: data.department.description || "",
        });
      } catch (err) {
        setError("Failed to fetch department data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDepartment();
  }, [departmentId]);

  // Updates the form state when an input field is changed.
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handles the form submission to update the department.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await updateDepartment(departmentId, formData);
      // Navigate back to the departments list on success.
      navigate("/app/admin/departments");
    } catch (err) {
      setError(err.message || "Failed to update department.");
    } finally {
      setLoading(false);
    }
  };

  // Conditional rendering for loading and error states.
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  // Renders the edit department form.
  return (
    <>
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          {t("editUserTitle")}
          <span>{formData.name}</span>
        </h1>
        <Link to="/app/admin/departments" className="btn btn-outline-secondary">
          <i className="fas fa-arrow-left me-2"></i>
          {t("backToList")}
        </Link>
      </header>
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            {/* Department Name Input */}
            <div className="mb-3">
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
            {/* Department Description Input */}
            <div className="mb-3">
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
            {/* Form Action Buttons */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Link to="/app/admin/departments" className="btn btn-secondary">
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

export default EditDepartmentPage;
