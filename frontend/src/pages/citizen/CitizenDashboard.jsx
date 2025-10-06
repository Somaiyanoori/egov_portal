import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { getMyRequests } from "../../services/requestService.js";
import { translateData } from "../../utils/translator.js";

// A component to display a request's status with appropriate styling.
const StatusBadge = ({ status, t }) => {
  const statusMap = {
    approved: { className: "status-approved", key: "statusApproved" },
    submitted: { className: "status-pending", key: "statusSubmitted" },
    under_review: { className: "status-pending", key: "statusPending" },
    rejected: { className: "status-rejected", key: "statusRejected" },
  };
  const { className, key } = statusMap[status] || {};
  return <span className={`status ${className}`}>{t(key)}</span>;
};

// The main dashboard component for citizens, displaying their service requests.
const CitizenDashboard = () => {
  const { language, t } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getMyRequests();
        setRequests(data.requests);
      } catch (err) {
        setError("Failed to fetch requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Handle loading and error states before rendering the main content.
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      {/* Page header with title and a link to create a new request. */}
      <header className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h1>{t("citizenDashboardTitle")}</h1>
        <Link
          to="/app/requests/new"
          className="btn btn-primary new-request-btn"
        >
          <i className="fas fa-plus me-2"></i>
          {t("newRequestButton")}
        </Link>
      </header>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle requests-table">
              <thead>
                <tr>
                  <th>{t("tableHeaderNumber")}</th>
                  <th>{t("tableHeaderService")}</th>
                  <th>{t("tableHeaderDepartment")}</th>
                  <th>{t("tableHeaderDate")}</th>
                  <th>{t("tableHeaderStatus")}</th>
                  <th>{t("tableHeaderActions")}</th>
                </tr>
              </thead>
              <tbody>
                {/* Check if there are any requests to display. */}
                {requests.length > 0 ? (
                  // Map through the requests and render a table row for each one.
                  requests.map((req, index) => (
                    <tr key={req.id}>
                      <td>{index + 1}</td>
                      <td>{req.service_name}</td>
                      <td>{req.department_name}</td>
                      <td>
                        {new Date(req.created_at).toLocaleDateString("fa-IR")}
                      </td>
                      <td>
                        <StatusBadge status={req.status} t={t} />
                      </td>
                      <td>
                        <Link
                          to={`/app/requests/${req.id}`}
                          className="btn btn-secondary btn-sm"
                        >
                          {t("viewDetailsButton")}
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  // Display a message if the user has no requests.
                  <tr>
                    <td colSpan="6" className="text-center">
                      {t("noRequests")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default CitizenDashboard;
