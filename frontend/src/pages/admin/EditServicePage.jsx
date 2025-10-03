import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { getServiceById, updateService } from "../../services/adminService.js";

const EditServicePage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    fee: 0,
    is_active: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await getServiceById(serviceId);
        setFormData({
          name: data.service.name,
          description: data.service.description || "",
          fee: data.service.fee || 0,
          is_active: data.service.is_active,
        });
      } catch (err) {
        setError("Failed to fetch service data.");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [serviceId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await updateService(serviceId, formData);
      navigate("/app/admin/services");
    } catch (err) {
      setError(err.message || "Failed to update service.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading service data...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          {t("editUserTitle")} <span>{formData.name}</span>
        </h1>
        <Link to="/app/admin/services" className="btn btn-outline-secondary">
          <i className="fas fa-arrow-left me-2"></i>
          {t("backToList")}
        </Link>
      </header>

      <div className="card shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                {t("tableHeaderService")}
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
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                {t("tableHeaderDescription")}
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
            <div className="mb-3">
              <label htmlFor="fee" className="form-label">
                Fee
              </label>
              <input
                type="number"
                className="form-control"
                id="fee"
                name="fee"
                value={formData.fee}
                onChange={handleChange}
              />
            </div>
            <div className="form-check form-switch mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="is_active">
                Active
              </label>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <Link to="/app/admin/services" className="btn btn-secondary">
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

export default EditServicePage;
