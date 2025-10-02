// src/pages/officer/OfficerDashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
  getPendingRequests,
  processRequest,
} from "../../services/officerService.js";
import { translateData } from "../../utils/translator.js";

const OfficerDashboard = () => {
  const { language, t } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPendingRequests();
      setRequests(data.requests);
    } catch (err) {
      setError("Failed to fetch pending requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleQuickProcess = async (requestId, status) => {
    // Optimistic UI update: remove the item from the list immediately
    const originalRequests = [...requests];
    setRequests((prev) => prev.filter((r) => r.id !== requestId));

    try {
      await processRequest(requestId, status);
      // On success, we don't need to do anything as it's already removed.
    } catch (err) {
      setError(`Failed to process request #${requestId}.`);
      // On error, revert the list to its original state
      setRequests(originalRequests);
    }
  };

  if (loading) return <div>Loading pending requests...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <header className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h1>{t("officerDashboardTitle")}</h1>
      </header>

      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="mb-0">{t("pendingRequests")}</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle requests-table">
              <thead>
                <tr>
                  <th>{t("tableHeaderRequestNumber")}</th>
                  <th>{t("tableHeaderCitizenName")}</th>
                  <th>{t("tableHeaderService")}</th>
                  <th>{t("tableHeaderDate")}</th>
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
                        {new Date(req.created_at).toLocaleDateString("fa-IR")}
                      </td>
                      <td>
                        <div className="d-flex gap-2 flex-wrap">
                          <Link
                            to={`/app/requests/${req.id}`}
                            className="btn btn-secondary btn-sm"
                          >
                            {t("detailsButton")}
                          </Link>
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
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
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
