import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { getAllServices } from "../../services/requestService.js";
import { translateData } from "../../utils/translator.js";
import { deleteService } from "../../services/adminService.js";

// A small component to display the service status as a colored badge.
const StatusBadge = ({ isActive, t }) => {
  const className = isActive ? "status-approved" : "status-inactive";
  const textKey = isActive ? "statusActive" : "statusInactive";
  return <span className={`status ${className}`}>{t(textKey)}</span>;
};

// Main component for managing services.
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

  // Handles the deletion of a service after user confirmation.
  const handleDelete = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteService(serviceId);
        setServices((prev) => prev.filter((s) => s.id !== serviceId));
      } catch (err) {
        setError("Failed to delete service.");
      }
    }
  };

  // Conditional rendering for loading and error states.
  if (loading) return <div>Loading services...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  return (
    <>
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1>{t("serviceManagementTitle")}</h1>
        <div>
          {/* Button to navigate to the create new service page. */}
          <Link to="/app/admin/services/new" className="btn btn-primary me-2">
            <i className="fas fa-plus me-2"></i>
            {t("addNewService")}
          </Link>
          {/* Button to navigate back to the dashboard. */}
          <Link to="/app/dashboard" className="btn btn-outline-secondary">
            <i className="fas fa-arrow-left me-2"></i>
            {t("backToDashboard")}
          </Link>
        </div>
      </header>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <tbody>
                {/* Map over the services to create a table row for each. */}
                {services.map((service) => (
                  <tr key={service.id}>
                    <td>{service.id}</td>
                    <td>{translateData(service.name, language)}</td>
                    <td>{translateData(service.department_name, language)}</td>
                    <td>
                      <StatusBadge isActive={service.is_active} t={t} />
                    </td>
                    <td>
                      {/* Edit and Delete action buttons for each service. */}
                      <Link
                        to={`/app/admin/services/edit/${service.id}`}
                        className="btn btn-sm btn-outline-warning me-2"
                      >
                        {t("editButton")}
                      </Link>
                      <button
                        onClick={() => handleDelete(service.id)}
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

export default ManageServicesPage;
