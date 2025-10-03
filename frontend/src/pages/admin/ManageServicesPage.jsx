// src/pages/admin/ManageServicesPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { getAllServices } from "../../services/requestService.js"; // می‌توانیم از این سرویس استفاده کنیم
import { translateData } from "../../utils/translator.js";

const StatusBadge = ({ isActive, t }) => {
  const className = isActive ? "status-approved" : "status-inactive";
  const textKey = isActive ? "statusActive" : "statusInactive";
  return <span className={`status ${className}`}>{t(textKey)}</span>;
};

const ManageServicesPage = () => {
  const { language, t } = useLanguage();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getAllServices();
        setServices(data);
      } catch (err) {
        setError("Failed to fetch services.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) return <div>Loading services...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1>{t("serviceManagementTitle")}</h1>
        <Link to="/app/admin/services/new" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>
          {t("addNewService")}
        </Link>
      </header>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>{t("tableHeaderId")}</th>
                  <th>{t("tableHeaderService")}</th>
                  <th>{t("tableHeaderDepartment")}</th>
                  <th>{t("tableHeaderStatus")}</th>
                  <th>{t("tableHeaderActions")}</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td>{service.id}</td>
                    <td>{translateData(service.name, language)}</td>
                    <td>{translateData(service.department_name, language)}</td>
                    <td>
                      <StatusBadge isActive={service.is_active} t={t} />
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-warning me-2"
                        disabled
                      >
                        {t("editButton")}
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        disabled
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

export default ManageServicesPage;
