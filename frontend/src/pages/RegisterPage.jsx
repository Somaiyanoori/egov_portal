// Import necessary React hooks, router components, and services.
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { register } from "../services/authService.js";

// The component for the user registration page.
const RegisterPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  // State to manage all form input fields.
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    national_id: "",
    date_of_birth: "",
    contact_info: "",
  });

  // State to toggle the visibility of citizen-specific fields.
  const [isCitizen, setIsCitizen] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Updates the form data state on input changes.
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError(t("passwordMismatchError"));
      return;
    }
    setLoading(true);
    setError(null);

    // Prepare the data payload for the API.
    const dataToSubmit = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: "citizen",
    };

    // Add citizen-specific fields to the payload if the toggle is active.
    if (isCitizen) {
      dataToSubmit.national_id = formData.national_id;
      dataToSubmit.date_of_birth = formData.date_of_birth;
      dataToSubmit.contact_info = formData.contact_info;
    }

    try {
      await register(dataToSubmit);
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      setError(err.message || t("registerError"));
    } finally {
      setLoading(false);
    }
  };

  // Renders the registration form UI.
  return (
    <div className="auth-body">
      {/* Decorative background elements. */}
      <div className="background-shapes">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>
      </div>
      {/* Main form container with glass effect. */}
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
          <h1>{t("registerTitle")}</h1>
          <form onSubmit={handleSubmit}>
            {/* Input fields for user details. */}
            <div className="auth-input-group">
              <label htmlFor="name">{t("fullName")}</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder={t("fullName")}
              />
            </div>
            <div className="auth-input-group">
              <label htmlFor="email">{t("email")}</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder={t("email")}
              />
            </div>
            <div className="auth-input-group">
              <label htmlFor="password">{t("password")}</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder={t("password")}
              />
            </div>
            <div className="auth-input-group">
              <label htmlFor="confirmPassword">{t("confirmPassword")}</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={t("confirmPassword")}
              />
            </div>
            {/* Toggle switch for citizen-specific fields. */}
            <div className="auth-input-group user-type-toggle">
              <label>{t("isCitizenLabel")}</label>
              <label className="switch">
                <input
                  type="checkbox"
                  id="citizen-toggle"
                  checked={isCitizen}
                  onChange={(e) => setIsCitizen(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            {/* Container for citizen-specific fields, visibility is toggled by CSS. */}
            <div
              className={`citizen-fields-container ${
                isCitizen ? "visible" : "hidden"
              }`}
            >
              <div className="auth-input-group">
                <label htmlFor="national_id">{t("nationalId")}</label>
                <input
                  type="text"
                  id="national_id"
                  name="national_id"
                  value={formData.national_id}
                  onChange={handleChange}
                  placeholder={t("nationalId")}
                />
              </div>
              <div className="auth-input-group">
                <label htmlFor="date_of_birth"></label>
                <input
                  type="date"
                  id="date_of_birth"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                />
              </div>
              <div className="auth-input-group">
                <label htmlFor="contact_info">{t("phone number")}</label>
                <input
                  type="tel"
                  id="contact_info"
                  name="contact_info"
                  value={formData.contact_info}
                  onChange={handleChange}
                  placeholder={t("phone")}
                />
              </div>
            </div>
            {/* Display error message if it exists. */}
            {error && (
              <div className="error-message" style={{ display: "block" }}>
                {error}
              </div>
            )}
            {/* Submit button with loading state. */}
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? t("registering") : t("registerButton")}
            </button>
          </form>
          {/* Link to navigate to the login page. */}
          <div className="register-link">
            <p>
              <span>{t("alreadyAccount")} </span>
              <Link to="/login">{t("loginLink")}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
