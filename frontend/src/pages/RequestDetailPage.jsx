// src/pages/RequestDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getRequestById } from "../services/requestService.js";
import { processRequest } from "../services/officerService.js";
import { translateData } from "../utils/translator.js";
import StatusBadge from "../components/StatusBadge.jsx";

const RequestDetailPage = () => {
  const { requestId } = useParams();
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getRequestById(requestId);
        setRequest(data.request);
      } catch (err) {
        setError(err.message || "Failed to fetch request details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [requestId]);

  const handleProcess = async (status) => {
    try {
      await processRequest(requestId, status);
      navigate("/app/dashboard");
    } catch (err) {
      setError("Failed to process the request.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger m-4">{error}</div>;
  if (!request) return <div>Request not found.</div>;

  const baseURL = "https://egov-portal-backend.onrender.com/";

  return (
    <>
      <header className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h1>
          {t("requestDetailsTitle")}
          <span className="request-id">{request.id}</span>
        </h1>
        <Link to="/app/dashboard" className="btn btn-outline-secondary">
          <i className="fas fa-arrow-left me-2"></i>
          {t("backToDashboard")}
        </Link>
      </header>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title mb-4">{t("generalInfo")}</h5>
              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">{t("currentStatus")}</span>
                  <span className="detail-value">
                    <StatusBadge status={request.status} t={t} />
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t("submissionDate")}</span>
                  <span className="detail-value">
                    {new Date(request.created_at).toLocaleDateString(
                      language === "fa" ? "fa-IR" : "en-US"
                    )}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t("serviceName")}</span>
                  <span className="detail-value">
                    {translateData(request.service.name, language)}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{t("citizenName")}</span>
                  <span className="detail-value">{request.citizen.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title mb-3">{t("submittedDocs")}</h5>
              {request.documents?.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {request.documents.map((doc) => (
                    <li
                      key={doc.id}
                      className="list-group-item d-flex justify-content-between align-items-center px-0"
                    >
                      <div className="document-info">
                        <i className="fas fa-file-alt fa-lg me-3"></i>
                        <span>{doc.file_path.split("/").pop()}</span>
                      </div>
                      <a
                        href={`${baseURL}/${doc.file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        {t("download")}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">{t("noDocs")}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* بخش Actions برای کارمندان */}
      {(user.role === "officer" || user.role === "head") && (
        <div className="card shadow-sm mt-4">
          <div className="card-body">
            <h5 className="card-title">{t("processRequest")}</h5>
            <p className="card-text text-muted">{t("changeStatusHint")}</p>
            <div className="d-flex gap-2 flex-wrap">
              <button
                onClick={() => handleProcess("approved")}
                className="btn btn-success"
              >
                {t("approveButton")}
              </button>
              <button
                onClick={() => handleProcess("rejected")}
                className="btn btn-danger"
              >
                {t("rejectButton")}
              </button>
              <button
                onClick={() => handleProcess("under_review")}
                className="btn btn-warning"
              >
                {t("setPendingButton")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RequestDetailPage;
