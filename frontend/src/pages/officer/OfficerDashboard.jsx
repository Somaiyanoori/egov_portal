// src/pages/officer/OfficerDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
  searchRequests,
  processRequest,
} from "../../services/officerService.js";
import { translateData } from "../../utils/translator.js";
import StatusBadge from "../../components/StatusBadge.jsx";

const OfficerDashboard = () => {
  const { language, t } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    citizenName: "",
    status: "submitted",
  });

  useEffect(() => {
    const fetchOfficerRequests = async () => {
      try {
        setLoading(true);
        const data = await searchRequests(filters);
        setRequests(data.requests);
      } catch (err) {
        setError("Failed to fetch requests for your department.");
      } finally {
        setLoading(false);
      }
    };
    fetchOfficerRequests();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleQuickProcess = async (requestId, status) => {
    // ... (این تابع بدون تغییر)
  };

  if (loading) return <div>Loading requests...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1>{t("officerDashboardTitle")}</h1>
      </header>

      {/* --- بخش جستجو با ترجمه --- */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title">{t("filterRequests")}</h5>
          <hr />
          <form className="row g-3 align-items-end">
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

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              {/* ... (بخش thead با ترجمه) ... */}
              <tbody>
                {requests.length > 0 ? (
                  requests.map((req) => (
                    <tr key={req.id}>{/* ... (بقیه ردیف‌ها) ... */}</tr>
                  ))
                ) : (
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
