// src/App.jsx
import { Routes, Route, Navigate, Link } from "react-router-dom"; // << Link را اینجا ایمپورت کنید

// ایمپورت کامپوننت‌های اصلی
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// ایمپورت تمام صفحات
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import NewRequestPage from "./pages/citizen/NewRequestPage.jsx";
import RequestDetailPage from "./pages/RequestDetailPage.jsx"; // مسیر را به پوشه اصلی pages تغییر دادم
import ManageUsersPage from "./pages/admin/ManageUsersPage.jsx";
import EditUserPage from "./pages/admin/EditUserPage.jsx";
import ManageDepartmentsPage from "./pages/admin/ManageDepartmentsPage.jsx";
import ReportsPage from "./pages/admin/ReportsPage.jsx";

// کامپوننت‌های خطا
const NotFoundPage = () => (
  <div className="auth-body">
    <div className="glass-container text-center p-5">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <Link to="/" className="btn btn-primary mt-3">
        Return to Home
      </Link>
    </div>
  </div>
);
const UnauthorizedPage = () => (
  <div className="auth-body">
    <div className="glass-container text-center p-5">
      <h1>403</h1>
      <h2>Unauthorized Access</h2>
      <Link to="/app/dashboard" className="btn btn-primary mt-3">
        Return to Dashboard
      </Link>
    </div>
  </div>
);

function App() {
  return (
    <Routes>
      {/* بخش ۱: روت‌های عمومی */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* بخش ۲: روت‌های محافظت شده داخل Layout */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />

        <Route
          path="requests/new"
          element={
            <ProtectedRoute allowedRoles={["citizen"]}>
              <NewRequestPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="requests/:requestId"
          element={<RequestDetailPage />} // نیازی به ProtectedRoute تودرتو نیست
        />

        <Route
          path="admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageUsersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/users/edit/:userId"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EditUserPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/departments"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageDepartmentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/reports"
          element={
            <ProtectedRoute allowedRoles={["admin", "head"]}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* بخش ۳: روت نهایی برای صفحات یافت نشده */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
