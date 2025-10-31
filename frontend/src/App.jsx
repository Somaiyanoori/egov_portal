import { Routes, Route, Navigate, Link } from "react-router-dom";

// Import main layout and security components.
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Import all page components.
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import NewRequestPage from "./pages/citizen/NewRequestPage.jsx";
import RequestDetailPage from "./pages/RequestDetailPage.jsx";
import ManageUsersPage from "./pages/admin/ManageUsersPage.jsx";
import EditUserPage from "./pages/admin/EditUserPage.jsx";
import ManageDepartmentsPage from "./pages/admin/ManageDepartmentsPage.jsx";
import ReportsPage from "./pages/admin/ReportsPage.jsx";
import CreateUserPage from "./pages/admin/CreateUserPage.jsx";
import UnauthorizedPage from "./pages/UnauthorizedPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ManageServicesPage from "./pages/admin/ManageServicesPage.jsx";
import EditDepartmentPage from "./pages/admin/EditDepartmentPage.jsx";
import EditServicePage from "./pages/admin/EditServicePage.jsx";
import CreateServicePage from "./pages/admin/CreateServicePage.jsx";
import PaymentSuccessPage from "./pages/citizen/PaymentSuccessPage.jsx";
// The main application component that defines all the routes.
function App() {
  return (
    <Routes>
      {/* Section 1: Public routes accessible to anyone. */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      {/* Redirects the root path to the login page. */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Section 2: Protected routes nested within the main application Layout. */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* The default route within /app redirects to the dashboard. */}
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />

        {/* Route for citizens to create a new request. */}
        <Route
          path="requests/new"
          element={
            <ProtectedRoute allowedRoles={["citizen"]}>
              <NewRequestPage />
            </ProtectedRoute>
          }
        />

        {/* Route to view details of a specific request. Authorization is handled inside the component. */}
        <Route
          path="requests/:requestId"
          element={<RequestDetailPage />} // نیازی به ProtectedRoute تودرتو نیست
        />

        {/* Admin-only route to manage users. */}
        <Route
          path="admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageUsersPage />
            </ProtectedRoute>
          }
        />

        {/* Admin-only route to edit a specific user. */}
        <Route
          path="admin/users/edit/:userId"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EditUserPage />
            </ProtectedRoute>
          }
        />

        {/* Admin-only route to manage departments. */}
        <Route
          path="admin/departments"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageDepartmentsPage />
            </ProtectedRoute>
          }
        />
        {/* Admin-only route to edit a specific department. */}
        <Route
          path="admin/departments/edit/:departmentId"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EditDepartmentPage />
            </ProtectedRoute>
          }
        />
        {/* Route for admins and department heads to view reports. */}
        <Route
          path="admin/reports"
          element={
            <ProtectedRoute allowedRoles={["admin", "head"]}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        {/* Admin-only route to manage services. */}
        <Route
          path="admin/services"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageServicesPage />
            </ProtectedRoute>
          }
        />
        {/* Admin-only route to create a new service. */}
        <Route
          path="admin/services/new"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CreateServicePage />
            </ProtectedRoute>
          }
        />
        {/* Admin-only route to edit a specific service. */}
        <Route
          path="admin/services/edit/:serviceId"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EditServicePage />
            </ProtectedRoute>
          }
        />
        {/* Admin-only route to create a new user. */}
        <Route
          path="admin/users/create"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CreateUserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="payment-success"
          element={
            <ProtectedRoute allowedRoles={["citizen"]}>
              <PaymentSuccessPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback routes for unauthorized access and 404 Not Found pages. */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
