// src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useNotifications } from "../context/NotificationContext.jsx"; // Import the notifications hook
import { logout as logoutService } from "../services/authService.js";

const Header = () => {
  // --- Hooks ---
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { notifications, unreadCount, markOneAsRead } = useNotifications(); // Get notification data
  const navigate = useNavigate();

  // --- Event Handlers ---
  const handleLogout = async () => {
    try {
      await logoutService();
    } catch (error) {
      console.error("Backend logout failed:", error);
    } finally {
      // Always log out on the frontend and redirect
      logout();
      navigate("/login");
    }
  };

  const handleNotificationClick = (e, id) => {
    e.preventDefault(); // Prevent default link behavior
    markOneAsRead(id);
    // Optional: you could also navigate to the related request page
    // navigate(`/app/requests/${id}`);
  };

  // --- Render Logic ---
  return (
    <nav className="navbar navbar-expand-lg shadow-sm">
      <div className="container-fluid">
        {/* Welcome Message and Brand Link */}
        <Link className="navbar-brand welcome-message" to="/app/dashboard">
          {t("welcome")} <span className="username">{user?.name}</span>
        </Link>

        {/* Right-aligned controls */}
        <div className="d-flex align-items-center ms-auto">
          {/* Language Toggle */}
          <button onClick={toggleLanguage} className="lang-btn me-3">
            {language === "fa" ? t("langEnglish") : t("langFarsi")}
          </button>

          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="icon-btn me-3">
            {theme === "light" ? (
              <i className="fas fa-moon"></i>
            ) : (
              <i className="fas fa-sun"></i>
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="dropdown me-3">
            <button
              className="icon-btn position-relative"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              aria-label="Notifications"
            >
              <i className="fas fa-bell"></i>
              {unreadCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {unreadCount}
                  <span className="visually-hidden">unread messages</span>
                </span>
              )}
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end"
              style={{
                minWidth: "350px",
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              {notifications.length === 0 ? (
                <li>
                  <span className="dropdown-item text-muted">
                    You have no new notifications.
                  </span>
                </li>
              ) : (
                notifications.map((n) => (
                  <li key={n.id}>
                    <a
                      className={`dropdown-item ${!n.is_read ? "fw-bold" : ""}`}
                      href="#"
                      onClick={(e) => handleNotificationClick(e, n.id)}
                    >
                      <p className="mb-1">{n.message}</p>
                      <small className="text-muted">
                        {new Date(n.created_at).toLocaleString()}
                      </small>
                    </a>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Logout Button */}
          <button onClick={handleLogout} className="btn logout-btn">
            {t("logout")}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
