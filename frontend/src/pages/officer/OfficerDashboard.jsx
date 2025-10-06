import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { searchRequests } from "../../services/officerService.js";
import StatusBadge from "../../components/StatusBadge.jsx";

// The main dashboard component for department officers.
const OfficerDashboard = () => {
  const { t } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    citizenName: "",
    status: "submitted",
  });

  // Effect to fetch requests based on the current filters.
  useEffect(() => {
    const fetchOfficerRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const activeFilters = {};
        if (filters.citizenName) {
          activeFilters.citizenName = filters.citizenName;
        }
        if (filters.status) {
          activeFilters.status = filters.status;
        }

        const data = await searchRequests(activeFilters);
        setRequests(data.requests);
      } catch (err) {
        setError("Failed to fetch requests for your department.");
      } finally {
        setLoading(false);
      }
    };
    fetchOfficerRequests();
  }, [filters]);

  // Updates the filters state when a user types or selects a filter option.
  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  if (loading) return <div>Loading requests...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  // Renders the officer dashboard UI.
  return (
    <>
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1>{t("officerDashboardTitle")}</h1>
      </header>

      {/* Filter section for searching requests. */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title">{t("filterRequests")}</h5>
          <hr />
          <form
            className="row g-3 align-items-end"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Filter by citizen name */}
            <div className="col-md-5">
              <label htmlFor="citizenName" className="form-label">
                {t("searchByCitizen")}
              </label>
              <input
                type="text"
                id="citizenName"
                name="citizenName"
                className="form-control"
                value={filters.citizenName}
                onChange={handleFilterChange}
                placeholder={t("enterNamePlaceholder")}
              />
            </div>
            {/* Filter by request status */}
            <div className="col-md-5">
              <label htmlFor="status" className="form-label">
                {t("filterByStatus")}
              </label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">{t("allStatuses")}</option>
                <option value="submitted">{t("statusSubmitted")}</option>
                <option value="under_review">{t("statusPending")}</option>
                <option value="approved">{t("statusApproved")}</option>
                <option value="rejected">{t("statusRejected")}</option>
              </select>
            </div>
          </form>
        </div>
      </div>

      {/* Table to display the filtered requests. */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
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
                {/* Check if there are requests to display. */}
                {requests.length > 0 ? (
                  // Map through requests and render a row for each.
                  requests.map((req) => (
                    <tr key={req.id}>
                      <td>{req.id}</td>
                      <td>{req.citizen_name}</td>
                      <td>{req.service_name}</td>
                      <td>{new Date(req.created_at).toLocaleDateString()}</td>
                      <td>
                        <StatusBadge status={req.status} t={t} />
                      </td>
                      <td>
                        <Link
                          to={`/app/requests/${req.id}`}
                          className="btn btn-sm btn-secondary"
                        >
                          {t("detailsButton")}
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  // Display a message if no requests match the filters.
                  <tr>
                    <td colSpan="6" className="text-center">
                      {t("noPendingRequests")}
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

export default OfficerDashboard;
