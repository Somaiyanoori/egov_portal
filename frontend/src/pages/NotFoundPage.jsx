import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

const NotFoundPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div className="auth-body">
      <div className="background-shapes">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>
      </div>
      <div className="glass-container error-page-container">
        <div className="form-header">
          <button onClick={toggleTheme} className="icon-btn">
            {theme === "light" ? (
              <i className="fas fa-moon"></i>
            ) : (
              <i className="fas fa-sun"></i>
            )}
          </button>
          <button onClick={toggleLanguage} className="lang-btn">
            {language === "fa" ? t("langEnglish") : t("langFarsi")}
          </button>
        </div>
        <div className="error-content">
          <h1 className="error-code">{language === "fa" ? "۴۰۴" : "404"}</h1>
          <p className="error-message-text">{t("notFoundMessage")}</p>
          <Link to="/" className="login-button">
            {t("returnHome")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
