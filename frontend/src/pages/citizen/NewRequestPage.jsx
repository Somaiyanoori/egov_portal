// src/pages/citizen/NewRequestPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
  getAllServices,
  createRequest,
} from "../../services/requestService.js";
import { translateData } from "../../utils/translator.js";

const NewRequestPage = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedServiceInfo, setSelectedServiceInfo] = useState(null);
  const [files, setFiles] = useState(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getAllServices();
        setServices(data);
      } catch (err) {
        setError("Failed to fetch services list.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleServiceChange = (e) => {
    const id = e.target.value;
    setSelectedServiceId(id);
    const service = services.find((s) => s.id === parseInt(id, 10));
    setSelectedServiceInfo(service);
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedServiceId) {
      setError("Please select a service.");
      return;
    }
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("service_id", selectedServiceId);
    formData.append("notes", notes);
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append("documents", files[i]);
      }
    }
    try {
      await createRequest(formData);
      navigate("/app/dashboard");
    } catch (err) {
      setError(err.message || "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && services.length === 0) return <div>Loading services...</div>;

  return (
    <>
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1>{t("newRequestTitle")}</h1>
        <Link to="/app/dashboard" className="btn btn-outline-secondary">
          <i className="fas fa-arrow-left me-2"></i>
          {t("backToDashboard")}
        </Link>
      </header>

      <div className="card shadow-sm">
        <div className="card-body p-4">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="service-type" className="form-label">
                {t("serviceTypeLabel")}
              </label>
              <select
                className="form-select"
                id="service-type"
                value={selectedServiceId}
                onChange={handleServiceChange}
                required
              >
                <option value="" disabled>
                  {t("selectServicePlaceholder")}
                </option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {translateData(service.department_name, language)} -{" "}
                    {translateData(service.name, language)}
                  </option>
                ))}
              </select>
            </div>

            {/* --- بخش جدید برای نمایش هزینه --- */}
            {selectedServiceInfo && selectedServiceInfo.fee > 0 && (
              <div className="alert alert-info">
                {t("serviceFeeText", {
                  fee: parseFloat(selectedServiceInfo.fee).toLocaleString(
                    language === "fa" ? "fa-IR" : "en-US"
                  ),
                })}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="documents" className="form-label">
                {t("uploadDocumentsLabel")}
              </label>
              <input
                className="form-control"
                type="file"
                id="documents"
                onChange={handleFileChange}
                multiple
              />
              <div className="form-text">{t("multipleFilesHint")}</div>
            </div>

            <div className="mb-4">
              <label htmlFor="notes" className="form-label">
                {t("notesLabel")}
              </label>
              <textarea
                className="form-control"
                id="notes"
                name="notes"
                rows="4"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("notesPlaceholder")}
              ></textarea>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <Link to="/app/dashboard" className="btn btn-secondary">
                {t("cancelButton")}
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? t("submitting") : t("submitRequestButton")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NewRequestPage;
