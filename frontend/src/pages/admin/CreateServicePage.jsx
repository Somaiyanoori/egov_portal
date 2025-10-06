import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
  createService,
  getAllDepartments,
} from "../../services/adminService.js";

// Component for creating a new service.
const CreateServicePage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // State to manage the form data for the new service.
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    department_id: "",
    fee: 0,
    is_active: true,
  });
  // State to store the list of available departments.
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Effect to fetch the list of departments when the component mounts.
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getAllDepartments();
        setDepartments(data);
      } catch (err) {
        setError("Failed to fetch departments.");
      }
    };
    fetchDepartments();
  }, []); // Empty dependency array ensures this runs only once.

  // Handles changes in form inputs and updates the state.
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handles the form submission to create a new service.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createService(formData);
      // Navigate to the services list page on success.
      navigate("/app/admin/services");
    } catch (err) {
      setError(err.message || "Failed to create service.");
    } finally {
      setLoading(false);
    }
  };

  // Renders the create service form UI.
  return (
    <>
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1>{t("createNewServiceTitle")}</h1>
        <Link to="/app/admin/services" className="btn btn-outline-secondary">
          {t("backToList")}
        </Link>
      </header>

      <div className="card shadow-sm">
        <div className="card-body p-4">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            {/* Service Name Input */}
            <div className="mb-3">
              <label className="form-label">{t("tableHeaderService")}</label>
              <input
                type="text"
                name="name"
                required
                className="form-control"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            {/* Description Input */}
            <div className="mb-3">
              <label className="form-label">
                {t("tableHeaderDescription")}
              </label>
              <input
                type="text"
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            {/* Department Selection */}
            <div className="mb-3">
              <label className="form-label">{t("tableHeaderDepartment")}</label>
              <select
                name="department_id"
                required
                className="form-select"
                value={formData.department_id}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select a department...
                </option>
                {departments.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Fee Input */}
            <div className="mb-3">
              <label className="form-label">{t("feeLabel")}</label>
              <input
                type="number"
                name="fee"
                className="form-control"
                value={formData.fee}
                onChange={handleChange}
              />
            </div>
            {/* Is Active Toggle */}
            <div className="form-check form-switch mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              <label className="form-check-label">{t("isActiveLabel")}</label>
            </div>

            {/* Form Action Buttons */}
            <div className="d-flex justify-content-end gap-2">
              <Link to="/app/admin/services" className="btn btn-secondary">
                {t("cancelButton")}
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? t("saving") : "Create Service"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateServicePage;
