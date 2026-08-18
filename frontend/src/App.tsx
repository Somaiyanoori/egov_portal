import { Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "@/pages/landing-page";
import { LoginPage } from "@/features/auth/pages/login-page";
import { RegisterPage } from "@/features/auth/pages/register-page";
import { ForgotPasswordPage } from "@/features/auth/pages/forgot-password-page";
import { UnauthorizedPage } from "@/pages/unauthorized-page";
import { NotFoundPage } from "@/pages/not-found-page";
import { NotificationsPage } from "@/features/notifications/notifications-page";
import { DashboardPage } from "@/features/dashboard/dashboard-page";
import { NewRequestPage } from "@/features/requests/pages/new-request-page";
import { RequestsListPage } from "@/features/requests/pages/requests-list-page";
import { RequestDetailPage } from "@/features/requests/pages/request-detail-page";
import { UsersPage } from "@/features/admin/pages/users-page";
import { DepartmentsPage } from "@/features/admin/pages/departments-page";
import { ServicesPage } from "@/features/admin/pages/services-page";
import { ReportsPage } from "@/features/reports/reports-page";
import { ProfilePage } from "@/features/profile/profile-page";
import { SessionsPage } from "@/features/profile/sessions-page";
import { ProtectedRoute } from "@/routes/protected-route";
import { AppLayout } from "@/components/layout/app-layout";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected app routes */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="notifications" element={<NotificationsPage />} />

        {/* Requests */}
        <Route path="requests" element={<RequestsListPage />} />
        <Route
          path="requests/new"
          element={
            <ProtectedRoute allowedRoles={["CITIZEN"]}>
              <NewRequestPage />
            </ProtectedRoute>
          }
        />
        <Route path="requests/:id" element={<RequestDetailPage />} />

        {/* Admin */}
        <Route
          path="admin/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/departments"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DepartmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/services"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ServicesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/reports"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "HEAD"]}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        {/* Account */}
        <Route path="profile" element={<ProfilePage />} />
        <Route
          path="settings"
          element={<Navigate to="/app/profile" replace />}
        />
        <Route path="sessions" element={<SessionsPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
