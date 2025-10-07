import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { login as loginService } from "../services/authService.js";

// The main login page component.
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  // Handles the form submission for logging in.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await loginService(email, password);
      login(data.user);
      navigate("/app/dashboard");
    } catch (err) {
      setError(t("loginError"));
    } finally {
      setLoading(false);
    }
  };

  // Renders the login page UI.
  return (
    <div className="auth-body">
      {/* Decorative background shapes. */}
      <div className="background-shapes">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>
      </div>
      {/* Main glass-effect container for the form. */}
      <div className="glass-container">
        <div className="form-header">
          {/* Theme and language toggle buttons. */}
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
        <div className="form-content">
          <h1>{t("loginTitle")}</h1>
          <form onSubmit={handleSubmit}>
            {/* Email input field. */}
            <div className="auth-input-group">
              <label htmlFor="email">{t("emailLabel")}</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
              />
            </div>
            {/* Password input field. */}
            <div className="auth-input-group">
              <label htmlFor="password">{t("passwordLabel")}</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("passwordPlaceholder")}
              />
            </div>
            {/* Conditionally display the error message. */}
            {error && (
              <div className="error-message" style={{ display: "block" }}>
                {error}
              </div>
            )}
            {/* Submit button with loading state. */}
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? t("loggingIn") : t("loginButton")}
            </button>
          </form>
          {/* Link to the registration page. */}
          <div className="register-link">
            <p>
              <span>{t("noAccount")} </span>
              <Link to="/register">{t("signUpLink")}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
