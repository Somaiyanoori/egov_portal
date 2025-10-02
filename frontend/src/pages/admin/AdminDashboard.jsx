import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.jsx";

const AdminCard = ({ to, icon, title, description }) => (
  <div className="col-12 col-md-6 col-lg-6 mb-4">
    <Link to={to} className="card-link">
      <div className="card admin-card shadow-sm h-100">
        <div className="card-body text-center p-4">
          <div className="admin-card-icon">
            <i className={`fas ${icon} fa-3x`}></i>
          </div>
          <h5 className="card-title">{title}</h5>
          <p className="card-text text-muted">{description}</p>
        </div>
      </div>
    </Link>
  </div>
);

const AdminDashboard = () => {
  const { t } = useLanguage();

  return (
    <>
      <header className="mb-4">
        <h1>{t("adminDashboardTitle")}</h1>
      </header>

      <div className="row g-4">
        <AdminCard
          to="/app/admin/users"
          icon="fa-users"
          title={t("userManagementTitle")}
          description={t("userManagementDesc")}
        />
        <AdminCard
          to="/app/admin/departments"
          icon="fa-building"
          title={t("deptManagementTitle")}
          description={t("deptManagementDesc")}
        />
        <AdminCard
          to="/app/admin/services"
          icon="fa-list-check"
          title={t("serviceManagementTitle")}
          description={t("serviceManagementDesc")}
        />
        <AdminCard
          to="/app/admin/reports"
          icon="fa-chart-pie"
          title={t("viewReportsTitle")}
          description={t("viewReportsDesc")}
        />
      </div>
    </>
  );
};

export default AdminDashboard;
