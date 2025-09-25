// src/pages/DashboardPage.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import CitizenDashboard from "./citizen/CitizenDashboard";
import OfficerDashboard from "./officer/OfficerDashboard";
import AdminDashboard from "./admin/AdminDashboard";

const DashboardPage = () => {
  const { user } = useAuth();
  switch (user?.role) {
    case "citizen":
      return <CitizenDashboard />;
    case "officer":
    case "head":
      return <OfficerDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      return <div>Your user role is invalid.</div>;
  }
};

export default DashboardPage;
