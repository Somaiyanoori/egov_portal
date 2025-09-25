import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
//  a new prop 'allowedRoles'
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // New check: If allowedRoles is provided, check if the user's role is included
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User is logged in but doesn't have the required role
    // Redirect them to a 'not authorized' page or back to the dashboard
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
