import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { logout as logoutService } from "../services/authService.js";

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutService();
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);

      logout();
      navigate("/login");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg shadow-sm">
      <div className="container-fluid">
        <div className="navbar-brand welcome-message">
          {t("welcome")} <span className="username">{user?.name}</span>
        </div>
        <div className="d-flex align-items-center ms-auto">
          <button onClick={toggleLanguage} className="lang-btn me-3">
            {language === "fa" ? t("langEnglish") : t("langFarsi")}
          </button>
          <button onClick={toggleTheme} className="icon-btn me-3">
            {theme === "light" ? (
              <i className="fas fa-moon"></i>
            ) : (
              <i className="fas fa-sun"></i>
            )}
          </button>
          <button onClick={handleLogout} className="btn logout-btn">
            {t("logout")}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
