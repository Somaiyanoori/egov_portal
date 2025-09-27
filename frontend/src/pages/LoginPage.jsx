import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { login as loginService } from "../services/authService.js";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="auth-body">
      <div className="background-shapes">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>
      </div>
      <div className="glass-container">
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
        <div className="form-content">
          <h1>{t("loginTitle")}</h1>
          <form onSubmit={handleSubmit}>
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
            {error && (
              <div className="error-message" style={{ display: "block" }}>
                {error}
              </div>
            )}
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? t("loggingIn") : t("loginButton")}
            </button>
          </form>
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
