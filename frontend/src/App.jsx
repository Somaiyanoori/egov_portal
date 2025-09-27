import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import NewRequestPage from "./pages/citizen/NewRequestPage";
import RequestDetailPage from "./pages/officer/RequestDetailPage";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import EditUserPage from "./pages/admin/EditUserPage";
import ManageDepartmentsPage from "./pages/admin/ManageDepartmentsPage";
import ReportsPage from "./pages/admin/ReportsPage";
import RegisterPage from "./pages/RegisterPage.jsx";

const NotFoundPage = () => <h2>404 - Page Not Found</h2>;
const UnauthorizedPage = () => (
  <h2>403 - You are not authorized to view this page.</h2>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests/new"
        element={
          <ProtectedRoute allowedRoles={["citizen"]}>
            {" "}
            <NewRequestPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests/:requestId"
        element={
          <ProtectedRoute allowedRoles={["citizen", "officer", "head"]}>
            <RequestDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests/:requestId"
        element={
          <ProtectedRoute>
            <RequestDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageUsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/edit/:userId"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <EditUserPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/departments"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageDepartmentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={["admin", "head"]}>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
