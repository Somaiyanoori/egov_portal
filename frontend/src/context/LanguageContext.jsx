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
  fullNamePlaceholder: {
    fa: "نام و تخلص خود را وارد کنید",
    en: "Enter your full name",
  },
  passwordPlaceholderRegister: {
    fa: "یک رمز عبور قوی انتخاب کنید",
    en: "Choose a strong password",
  },
  confirmPasswordLabel: { fa: "تکرار رمز عبور", en: "Confirm Password" },
  confirmPasswordPlaceholder: {
    fa: "رمز عبور خود را تکرار کنید",
    en: "Confirm your password",
  },
  isCitizenLabel: { fa: "شهروند هستید؟", en: "Are you a citizen?" },
  nationalIdLabel: { fa: "کد ملی (تذکره)", en: "National ID" },
  nationalIdPlaceholder: {
    fa: "کد تذکره الکترونیکی خود را وارد کنید",
    en: "Enter your national ID number",
  },
  dobLabel: { fa: "تاریخ تولد", en: "Date of Birth" },
  phoneLabel: { fa: "شماره تماس", en: "Phone Number" },
  phonePlaceholder: { fa: "مثال: 079xxxxxxx", en: "Example: 079xxxxxxx" },
  registerButton: { fa: "ثبت‌نام", en: "Register" },
  registering: { fa: "در حال ثبت‌نام...", en: "Registering..." },
  alreadyAccount: {
    fa: "قبلاً ثبت‌نام کرده‌اید؟",
    en: "Already have an account?",
  },
  loginLink: { fa: "وارد شوید", en: "Log in" },
  passwordMismatchError: {
    fa: "رمزهای عبور با هم مطابقت ندارند.",
    en: "Passwords do not match.",
  },
  registerError: { fa: "ثبت‌نام ناموفق بود.", en: "Failed to register." },

  //================================================
  // Citizen Dashboard
  //================================================
  citizenDashboardTitle: { fa: "داشبورد شهروند", en: "Citizen Dashboard" },
  newRequestButton: { fa: "ثبت درخواست جدید", en: "New Request" },
  tableHeaderNumber: { fa: "#", en: "#" },
  tableHeaderService: { fa: "نام سرویس", en: "Service Name" },
  tableHeaderDepartment: { fa: "دپارتمان", en: "Department" },
  tableHeaderDate: { fa: "تاریخ ثبت", en: "Date" },
  tableHeaderStatus: { fa: "وضعیت", en: "Status" },
  tableHeaderActions: { fa: "عملیات", en: "Actions" },
  viewDetailsButton: { fa: "مشاهده جزئیات", en: "View Details" },
  statusApproved: { fa: "تایید شده", en: "Approved" },
  statusPending: { fa: "در حال بررسی", en: "Pending" },
  statusSubmitted: { fa: "ثبت شده", en: "Submitted" },
  statusRejected: { fa: "رد شده", en: "Rejected" },
  noRequests: {
    fa: "شما هنوز هیچ درخواستی ثبت نکرده‌اید.",
    en: "You have not submitted any requests yet.",
  },
  // New Request Page
  newRequestTitle: { fa: "ثبت درخواست جدید", en: "New Service Request" },
  backToDashboard: { fa: "بازگشت به داشبورد", en: "Back to Dashboard" },
  serviceTypeLabel: { fa: "نوع سرویس", en: "Service Type" },
  selectServicePlaceholder: {
    fa: "یک سرویس را انتخاب کنید...",
    en: "Select a service...",
  },
  uploadDocumentsLabel: { fa: "آپلود مدارک", en: "Upload Documents" },
  multipleFilesHint: {
    fa: "می‌توانید چندین فایل را انتخاب کنید.",
    en: "You can select multiple files.",
  },
  notesLabel: { fa: "توضیحات (اختیاری)", en: "Notes (Optional)" },
  notesPlaceholder: {
    fa: "اگر توضیحات اضافی دارید اینجا بنویسید...",
    en: "Enter any additional notes here...",
  },
  cancelButton: { fa: "انصراف", en: "Cancel" },
  submitRequestButton: { fa: "ارسال درخواست", en: "Submit Request" },
  submitting: { fa: "در حال ارسال...", en: "Submitting..." },
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
