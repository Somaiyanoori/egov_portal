// src/pages/admin/ReportsPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { getSystemReports } from "../../services/adminService.js";

// کامپوننت کوچک و بهبود یافته برای کارت‌های آماری با آیکون
const StatCard = ({ title, value, icon, colorClass }) => (
  <div className="col-md-6 col-xl-3 mb-4">
    <div className={`card stat-card ${colorClass} text-white shadow-sm h-100`}>
      <div className="card-body">
        <div className="d-flex align-items-center">
          <i className={`fas ${icon} fa-3x me-3 opacity-75`}></i>
          <div>
            <h5 className="card-title mb-1">{title}</h5>
            <p className="card-text fs-2 fw-bold">{value}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ReportsPage = () => {
  const { language, t } = useLanguage(); // language را هم برای فرمت اعداد می‌گیریم
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getSystemReports();
        setReports(data);
      } catch (err) {
        setError("Failed to fetch reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <div>Loading reports...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!reports) return <div>No report data available.</div>;

  const { overallStats, statsByDepartment } = reports;
  const numberLocale = language === "fa" ? "fa-IR" : "en-US";

  return (
    <>
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1>{t("reportsTitle")}</h1>
        <Link to="/app/dashboard" className="btn btn-outline-secondary">
          <i className="fas fa-arrow-left me-2"></i>
          {t("backToDashboard")}
        </Link>
      </header>

      {/* بخش کارت‌های آماری */}
      <div className="row g-4 mb-4">
        <StatCard
          title={t("totalRequests")}
          value={overallStats.total_requests}
          icon="fa-file-alt"
          colorClass="bg-primary"
        />
        <StatCard
          title={t("approvedRequests")}
          value={overallStats.approved_requests}
          icon="fa-check-circle"
          colorClass="bg-success"
        />
        <StatCard
          title={t("rejectedRequests")}
          value={overallStats.rejected_requests}
          icon="fa-times-circle"
          colorClass="bg-danger"
        />
        <StatCard
          title={t("totalUsers")}
          value={overallStats.total_users}
          icon="fa-users"
          colorClass="bg-info text-dark"
        />
      </div>

      {/* بخش آمار به تفکک دپارتمان */}
      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="mb-0">{t("statsByDept")}</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th>{t("tableHeaderDepartment")}</th>
                  <th>{t("totalRequests")}</th>
                  <th>{t("approvedRequests")}</th>
                  <th>{t("rejectedRequests")}</th>
                  <th>{t("totalRevenue")}</th>
                </tr>
              </thead>
              <tbody>
                {statsByDepartment.map((dep) => (
                  <tr key={dep.id}>
                    <td>{dep.department_name}</td>
                    <td>{dep.total_requests}</td>
                    <td>{dep.approved_requests}</td>
                    <td>{dep.rejected_requests}</td>
                    <td>
                      {parseFloat(dep.department_revenue).toLocaleString(
                        numberLocale
                      )}
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

export default ReportsPage;
