// src/components/StatusBadge.jsx
import React from "react";

const StatusBadge = ({ status, t }) => {
  const statusMap = {
    approved: { className: "status-approved", key: "statusApproved" },
    submitted: { className: "status-pending", key: "statusSubmitted" },
    under_review: { className: "status-pending", key: "statusPending" },
    rejected: { className: "status-rejected", key: "statusRejected" },
  };

  const { className, key } = statusMap[status] || {
    className: "bg-secondary text-white",
    key: status,
  };

  return <span className={`status ${className}`}>{t(key)}</span>;
};

export default StatusBadge;
