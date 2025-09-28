import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

import CitizenDashboard from "./citizen/CitizenDashboard.jsx";
import OfficerDashboard from "./officer/OfficerDashboard.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";

const DashboardPage = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div>Loading user information...</div>;
  }
  switch (user?.role) {
    case "citizen":
      return <CitizenDashboard />;
    case "officer":
    case "head":
      return <OfficerDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      return (
        <div>Error: User role is not recognized. Please contact support.</div>
      );
  }
};

export default DashboardPage;
