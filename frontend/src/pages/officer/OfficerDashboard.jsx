// src/pages/officer/OfficerDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
  searchRequests,
  processRequest,
} from "../../services/officerService.js";
import { translateData } from "../../utils/translator.js";
import StatusBadge from "../../components/StatusBadge.jsx"; // StatusBadge را ایمپورت می‌کنیم

const OfficerDashboard = () => {
  // --- Hooks & State ---
  const { language, t } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for search filters
  const [filters, setFilters] = useState({
    citizenName: "",
    status: "",
  });

  // --- Data Fetching ---
  useEffect(() => {
    // This function now fetches data based on the current filters
    const fetchFilteredRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await searchRequests(filters);
        setRequests(data.requests);
      } catch (err) {
        setError("Failed to fetch requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredRequests();
  }, [filters]); // Re-fetch whenever the filters object changes

  // --- Event Handlers ---
  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleQuickProcess = async (requestId, status) => {
    // This logic remains the same
    try {
      await processRequest(requestId, status);
      // Optimistically remove the processed request from the list
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      setError(`Failed to process request #${requestId}.`);
    }
  };

  // --- Render Logic ---
  return (
    <>
      <header className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h1>{t("officerDashboardTitle")}</h1>
      </header>

      {/* Search and Filter Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <form className="row g-3 align-items-end">
            <div className="col-md-5">
              <label htmlFor="citizenName" className="form-label">
                Search by Citizen Name
              </label>
              <input
                type="text"
                id="citizenName"
                name="citizenName"
                className="form-control"
                value={filters.citizenName}
                onChange={handleFilterChange}
                placeholder="Enter citizen name..."
              />
            </div>
            <div className="col-md-5">
              <label htmlFor="status" className="form-label">
                Filter by Status
              </label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </form>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Requests Table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            {loading ? (
              <div className="text-center p-5">Loading requests...</div>
            ) : (
              <table className="table table-hover align-middle requests-table">
                <thead>
                  <tr>
                    <th>{t("tableHeaderRequestNumber")}</th>
                    <th>{t("tableHeaderCitizenName")}</th>
                    <th>{t("tableHeaderService")}</th>
                    <th>{t("tableHeaderDate")}</th>
                    <th>{t("tableHeaderStatus")}</th>
                    <th>{t("tableHeaderActions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length > 0 ? (
                    requests.map((req) => (
                      <tr key={req.id}>
                        <td>{req.id}</td>
                        <td>{req.citizen_name}</td>
                        <td>{translateData(req.service_name, language)}</td>
                        <td>
                          {new Date(req.created_at).toLocaleDateString(
                            language === "fa" ? "fa-IR" : "en-US"
                          )}
                        </td>
                        <td>
                          <StatusBadge status={req.status} t={t} />
                        </td>
                        <td>
                          <div className="d-flex gap-2 flex-wrap">
                            <Link
                              to={`/app/requests/${req.id}`}
                              className="btn btn-secondary btn-sm"
                            >
                              {t("detailsButton")}
                            </Link>
                            {/* Quick process buttons might only be relevant for 'submitted' or 'under_review' statuses */}
                            {(req.status === "submitted" ||
                              req.status === "under_review") && (
                              <>
                                <button
                                  onClick={() =>
                                    handleQuickProcess(req.id, "approved")
                                  }
                                  className="btn btn-success btn-sm"
                                >
                                  {t("quickApprove")}
                                </button>
                                <button
                                  onClick={() =>
                                    handleQuickProcess(req.id, "rejected")
                                  }
                                  className="btn btn-danger btn-sm"
                                >
                                  {t("quickReject")}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No requests match the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OfficerDashboard;
