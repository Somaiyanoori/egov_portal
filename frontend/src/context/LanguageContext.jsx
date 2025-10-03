// src/context/LanguageContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";

// Central object for all static text translations
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
  backToList: { fa: "بازگشت به لیست", en: "Back to List" },
  editButton: { fa: "ویرایش", en: "Edit" },
  deleteButton: { fa: "حذف", en: "Delete" },
  cancelButton: { fa: "انصراف", en: "Cancel" },

  //================================================
  // Reusable Table Headers
  //================================================
  tableHeaderId: { fa: "ID", en: "ID" },
  tableHeaderName: { fa: "نام", en: "Name" },
  tableHeaderFullName: { fa: "نام کامل", en: "Full Name" },
  tableHeaderEmail: { fa: "ایمیل", en: "Email" },
  tableHeaderRole: { fa: "نقش", en: "Role" },
  tableHeaderDepartment: { fa: "دپارتمان", en: "Department" },
  tableHeaderActions: { fa: "عملیات", en: "Actions" },
  tableHeaderService: { fa: "نام سرویس", en: "Service Name" },
  tableHeaderDate: { fa: "تاریخ ثبت", en: "Date" },
  tableHeaderStatus: { fa: "وضعیت", en: "Status" },
  tableHeaderRequestNumber: { fa: "شماره درخواست", en: "Request #" },
  tableHeaderCitizenName: { fa: "نام شهروند", en: "Citizen Name" },
  tableHeaderDescription: { fa: "توضیحات", en: "Description" },

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
  // Citizen Pages (Dashboard & New Request)
  //================================================
  citizenDashboardTitle: { fa: "داشبورد شهروند", en: "Citizen Dashboard" },
  newRequestButton: { fa: "ثبت درخواست جدید", en: "New Request" },
  viewDetailsButton: { fa: "مشاهده جزئیات", en: "View Details" },
  statusApproved: { fa: "تایید شده", en: "Approved" },
  statusPending: { fa: "در حال بررسی", en: "Pending" },
  statusSubmitted: { fa: "ثبت شده", en: "Submitted" },
  statusRejected: { fa: "رد شده", en: "Rejected" },
  noRequests: {
    fa: "شما هنوز هیچ درخواستی ثبت نکرده‌اید.",
    en: "You have not submitted any requests yet.",
  },
  newRequestTitle: { fa: "ثبت درخواست جدید", en: "New Service Request" },
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
  submitRequestButton: { fa: "ارسال درخواست", en: "Submit Request" },
  submitting: { fa: "در حال ارسال...", en: "Submitting..." },

  //================================================
  // Officer Pages
  //================================================
  officerDashboardTitle: { fa: "داشبورد کارمند", en: "Officer Dashboard" },
  pendingRequests: { fa: "درخواست‌های در حال انتظار", en: "Pending Requests" },
  quickApprove: { fa: "تایید", en: "Approve" },
  quickReject: { fa: "رد", en: "Reject" },
  detailsButton: { fa: "جزئیات", en: "Details" },
  noPendingRequests: {
    fa: "در حال حاضر هیچ درخواست در حال انتظاری برای دپارتمان شما وجود ندارد.",
    en: "There are currently no pending requests for your department.",
  },

  //================================================
  // Admin Pages
  //================================================
  adminDashboardTitle: { fa: "داشبورد مدیریت کل", en: "Admin Dashboard" },
  userManagementTitle: { fa: "مدیریت کاربران", en: "User Management" },
  userManagementDesc: {
    fa: "افزودن، ویرایش و حذف کاربران",
    en: "Add, edit, and remove users",
  },
  deptManagementTitle: {
    fa: "مدیریت دپارتمان‌ها",
    en: "Department Management",
  },
  deptManagementDesc: {
    fa: "ایجاد و مدیریت دپارتمان‌های دولتی",
    en: "Create and manage departments",
  },
  serviceManagementTitle: { fa: "مدیریت سرویس‌ها", en: "Service Management" },
  serviceManagementDesc: {
    fa: "افزودن و پیکربندی سرویس‌های قابل ارائه",
    en: "Configure available services",
  },
  viewReportsTitle: { fa: "مشاهده گزارش‌ها", en: "View Reports" },
  viewReportsDesc: {
    fa: "تحلیل و بررسی آمار درخواست‌ها",
    en: "Analyze request statistics",
  },
  createNewUser: { fa: "ایجاد کاربر جدید", en: "Add New User" },
  roleCitizen: { fa: "شهروند", en: "Citizen" },
  roleOfficer: { fa: "کارمند", en: "Officer" },
  roleAdmin: { fa: "ادمین", en: "Admin" },
  editUserTitle: { fa: "ویرایش کاربر: ", en: "Edit User: " },
  changePasswordHint: {
    fa: "برای تغییر رمز عبور، این فیلد را پر کنید.",
    en: "Fill this field to change the password.",
  },
  newPasswordLabel: { fa: "رمز عبور جدید", en: "New Password" },
  saveChangesButton: { fa: "ذخیره تغییرات", en: "Save Changes" },
  saving: { fa: "در حال ذخیره...", en: "Saving..." },
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
  reportsTitle: { fa: "گزارش‌های سیستم", en: "System Reports" },
  totalRequests: { fa: "مجموع درخواست‌ها", en: "Total Requests" },
  approvedRequests: { fa: "تایید شده", en: "Approved" },
  rejectedRequests: { fa: "رد شده", en: "Rejected" },
  totalUsers: { fa: "مجموع کاربران", en: "Total Users" },
  statsByDept: { fa: "آمار به تفکیک دپارتمان", en: "Stats by Department" },
  totalRevenue: { fa: "درآمد (افغانی)", en: "Revenue (AFN)" },

  //================================================
  // Error Pages
  //================================================
  unauthorizedTitle: { fa: "دسترسی غیرمجاز", en: "Unauthorized Access" },
  unauthorizedMessage: {
    fa: "شما اجازه دسترسی به این صفحه را ندارید.",
    en: "You do not have permission to access this page.",
  },
  notFoundTitle: { fa: "صفحه یافت نشد", en: "Page Not Found" },
  notFoundMessage: {
    fa: "صفحه‌ای که به دنبال آن بودید یافت نشد.",
    en: "The page you were looking for was not found.",
  },
  returnHome: { fa: "بازگشت به صفحه اصلی", en: "Return to Home Page" },
  // Admin Manage Services Page

  addNewService: { fa: "افزودن سرویس جدید", en: "Add New Service" },
  statusActive: { fa: "فعال", en: "Active" },
  statusInactive: { fa: "غیرفعال", en: "Inactive" },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Get language from localStorage or default to 'fa'
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "fa"
  );

  // Effect to update HTML attributes whenever language changes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
    localStorage.setItem("language", language);
  }, [language]);

  // Function to toggle between 'fa' and 'en'
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "fa" ? "en" : "fa"));
  };

  /**
   * Translation function.
   * @param {string} key - The key for the translation text.
   * @returns {string} The translated text in the current language, or a fallback.
   */
  const t = (key) => {
    const keyTranslations = translations[key];
    if (!keyTranslations) {
      // If the key doesn't exist in our dictionary, warn the developer and return the key itself.
      console.warn(`Translation key "${key}" not found.`);
      return key;
    }
    // Return the translation for the current language.
    // If it doesn't exist, fall back to Persian, then to the key itself.
    return keyTranslations[language] || keyTranslations["fa"] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for easy access to the language context
export const useLanguage = () => useContext(LanguageContext);
