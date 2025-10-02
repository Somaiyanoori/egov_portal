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
  createNewUser: { fa: "ایجاد کاربر جدید", en: "Create New User" },
  // Officer Dashboard
  officerDashboardTitle: { fa: "داشبورد کارمند", en: "Officer Dashboard" },
  pendingRequests: { fa: "درخواست‌های در حال انتظار", en: "Pending Requests" },
  tableHeaderRequestNumber: { fa: "شماره درخواست", en: "Request #" },
  tableHeaderCitizenName: { fa: "نام شهروند", en: "Citizen Name" },
  quickApprove: { fa: "تایید", en: "Approve" },
  quickReject: { fa: "رد", en: "Reject" },
  detailsButton: { fa: "جزئیات", en: "Details" },
  noPendingRequests: {
    fa: "در حال حاضر هیچ درخواست در حال انتظاری برای دپارتمان شما وجود ندارد.",
    en: "There are currently no pending requests for your department.",
  },
  // Unauthorized Page
  unauthorizedTitle: { fa: "دسترسی غیرمجاز", en: "Unauthorized Access" },
  unauthorizedMessage: {
    fa: "شما اجازه دسترسی به این صفحه را ندارید.",
    en: "You do not have permission to access this page.",
  },
  // Not Found Page
  notFoundTitle: { fa: "صفحه یافت نشد", en: "Page Not Found" },
  notFoundMessage: {
    fa: "صفحه‌ای که به دنبال آن بودید یافت نشد.",
    en: "The page you were looking for was not found.",
  },
  returnHome: { fa: "بازگشت به صفحه اصلی", en: "Return to Home Page" },
  // Admin Manage Users Page
  userManagementTitle: { fa: "مدیریت کاربران", en: "User Management" },
  addNewUser: { fa: "افزودن کاربر جدید", en: "Add New User" },
  tableHeaderFullName: { fa: "نام کامل", en: "Full Name" },
  roleCitizen: { fa: "شهروند", en: "Citizen" },
  roleOfficer: { fa: "کارمند", en: "Officer" },
  roleAdmin: { fa: "ادمین", en: "Admin" },

  // Admin Edit User Page
  editUserTitle: { fa: "ویرایش کاربر: ", en: "Edit User: " },
  backToList: { fa: "بازگشت به لیست", en: "Back to List" },
  changePasswordHint: {
    fa: "برای تغییر رمز عبور، این فیلد را پر کنید.",
    en: "Fill this field to change the password.",
  },
  newPasswordLabel: { fa: "رمز عبور جدید", en: "New Password" },
  saveChangesButton: { fa: "ذخیره تغییرات", en: "Save Changes" },
  saving: { fa: "در حال ذخیره...", en: "Saving..." },
  // Admin Manage Departments Page
  deptManagementTitle: {
    fa: "مدیریت دپارتمان‌ها",
    en: "Department Management",
  },
  createNewDeptTitle: {
    fa: "ایجاد دپارتمان جدید",
    en: "Create New Department",
  },
  deptNameLabel: { fa: "نام دپارتمان", en: "Department Name" },
  deptDescLabel: { fa: "توضیحات (اختیاری)", en: "Description (Optional)" },
  createDeptButton: { fa: "ایجاد دپارتمان", en: "Create Department" },
  existingDeptsTitle: {
    fa: "لیست دپارتمان‌های موجود",
    en: "Existing Departments",
  },
  tableHeaderDescription: { fa: "توضیحات", en: "Description" },
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
