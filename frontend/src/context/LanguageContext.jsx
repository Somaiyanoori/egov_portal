// src/context/LanguageContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";

const translations = {
  //================================================
  // General & Shared UI Elements
  //================================================
  langEnglish: { fa: "English", en: "English" },
  langFarsi: { fa: "فارسی", en: "Farsi" },
  welcome: { fa: "خوش آمدید،", en: "Welcome," },
  logout: { fa: "خروج", en: "Logout" },
  footerText: {
    fa: "پرتال خدمات دولت. تمام حقوق محفوظ است.",
    en: "E-Government Services Portal. All Rights Reserved.",
  },
  backToDashboard: { fa: "بازگشت به داشبورد", en: "Back to Dashboard" },
  editButton: { fa: "ویرایش", en: "Edit" },
  deleteButton: { fa: "حذف", en: "Delete" },

  //================================================
  // Table Headers (reusable)
  //================================================
  tableHeaderId: { fa: "ID", en: "ID" },
  tableHeaderName: { fa: "نام", en: "Name" },
  tableHeaderEmail: { fa: "ایمیل", en: "Email" },
  tableHeaderRole: { fa: "نقش", en: "Role" },
  tableHeaderDepartment: { fa: "دپارتمان", en: "Department" },
  tableHeaderActions: { fa: "عملیات", en: "Actions" },

  //================================================
  // Login Page
  //================================================
  loginTitle: {
    fa: "ورود به پرتال خدمات دولت",
    en: "Login to Government Portal",
  },
  emailLabel: { fa: "ایمیل", en: "Email" },
  passwordLabel: { fa: "رمز عبور", en: "Password" },
  emailPlaceholder: { fa: "ایمیل خود را وارد کنید", en: "Enter your email" },
  passwordPlaceholder: {
    fa: "رمز عبور خود را وارد کنید",
    en: "Enter your password",
  },
  loginError: {
    fa: "ایمیل یا رمز عبور اشتباه است.",
    en: "Invalid email or password.",
  },
  loggingIn: { fa: "در حال ورود...", en: "Logging in..." },
  loginButton: { fa: "ورود", en: "Login" },
  noAccount: { fa: "حساب کاربری ندارید؟", en: "Don't have an account?" },
  signUpLink: { fa: "ثبت‌نام کنید", en: "Sign up" },

  //================================================
  // Register Page
  //================================================
  registerTitle: { fa: "ایجاد حساب کاربری جدید", en: "Create a New Account" },
  fullNameLabel: { fa: "نام کامل", en: "Full Name" },
  // ... (بقیه ترجمه‌های صفحه ثبت‌نام)

  //================================================
  // Citizen Dashboard & New Request
  //================================================
  citizenDashboardTitle: { fa: "داشبورد شهروند", en: "Citizen Dashboard" },
  newRequestButton: { fa: "ثبت درخواست جدید", en: "New Request" },
  // ... (بقیه ترجمه‌های داشبورد شهروند)

  //================================================
  // Admin Pages
  //================================================
  userManagementTitle: { fa: "مدیریت کاربران", en: "User Management" },
  createNewUser: { fa: "ایجاد کاربر جدید", en: "Create New User" }, // << ترجمه جدید
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "fa"
  ); // زبان پیش‌فرض را فارسی قرار دادم

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
    localStorage.setItem("language", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "fa" ? "en" : "fa"));
  };

  // تابع ترجمه بهبود یافته
  const t = (key) => {
    const keyTranslations = translations[key];
    if (!keyTranslations) {
      console.warn(`Translation key "${key}" not found.`);
      return key;
    }
    return keyTranslations[language] || keyTranslations["fa"] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
