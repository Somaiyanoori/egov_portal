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
  backToList: { fa: "بازگشت به لیست", en: "Back to List" },
  editButton: { fa: "ویرایش", en: "Edit" },
  deleteButton: { fa: "حذف", en: "Delete" },
  cancelButton: { fa: "انصراف", en: "Cancel" },
  download: { fa: "دانلود", en: "Download" },

  //================================================
  // Reusable Table Headers & Form Labels
  //================================================
  tableHeaderId: { fa: "ID", en: "ID" },
  tableHeaderName: { fa: "نام", en: "Name" },
  fullNameLabel: { fa: "نام کامل", en: "Full Name" },
  emailLabel: { fa: "ایمیل", en: "Email" },
  passwordLabel: { fa: "رمز عبور", en: "Password" },
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
  // Register Page (Added missing keys)
  //================================================
  registerTitle: { fa: "ایجاد حساب کاربری جدید", en: "Create a New Account" },
  fullNamePlaceholder: {
    fa: "نام کامل خود را وارد کنید",
    en: "Enter your full name",
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
  // Citizen & Request Pages
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
  serviceFeeText: {
    fa: `هزینه این سرویس: {fee} افغانی`,
    en: `This service has a fee of: {fee} AFN`,
  },
  requestDetailsTitle: { fa: "جزئیات درخواست #", en: "Request Details #" },
  generalInfo: { fa: "اطلاعات کلی", en: "General Information" },
  currentStatus: { fa: "وضعیت", en: "Status" },
  submissionDate: { fa: "تاریخ ثبت", en: "Submission Date" },
  serviceName: { fa: "نام سرویس", en: "Service Name" },
  submittedDocs: { fa: "مدارک ارسال شده", en: "Submitted Documents" },
  noDocs: {
    fa: "هیچ مدرکی برای این درخواست آپلود نشده است.",
    en: "No documents were uploaded for this request.",
  },

  //================================================
  // Officer Pages
  //================================================
  officerDashboardTitle: { fa: "داشبورد کارمند", en: "Officer Dashboard" },
  detailsButton: { fa: "جزئیات", en: "Details" },
  noPendingRequests: {
    fa: "در حال حاضر هیچ درخواست در حال انتظاری برای دپارتمان شما وجود ندارد.",
    en: "There are currently no pending requests for your department.",
  },
  processRequest: { fa: "پردازش درخواست", en: "Process Request" },
  changeStatusHint: {
    fa: "وضعیت این درخواست را تغییر دهید.",
    en: "Change the status of this request.",
  },
  approveButton: { fa: "تایید نهایی", en: "Approve" },
  rejectButton: { fa: "رد کردن", en: "Reject" },
  setPendingButton: { fa: "در حال بررسی", en: "Set to Under Review" },
  filterRequests: { fa: "فیلتر کردن درخواست‌ها", en: "Filter Requests" },
  searchByCitizen: {
    fa: "جستجو بر اساس نام شهروند",
    en: "Search by Citizen Name",
  },
  enterNamePlaceholder: {
    fa: "نام شهروند را وارد کنید...",
    en: "Enter a name...",
  },
  filterByStatus: { fa: "فیلتر بر اساس وضعیت", en: "Filter by Status" },
  allStatuses: { fa: "همه وضعیت‌ها", en: "All Statuses" },

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
  addNewService: { fa: "افزودن سرویس جدید", en: "Add New Service" },
  createNewServiceTitle: { fa: "ایجاد سرویس جدید", en: "Create New Service" },
  feeLabel: { fa: "هزینه (افغانی)", en: "Fee (AFN)" },
  isActiveLabel: { fa: "سرویس فعال است؟", en: "Is Service Active?" },
  statusActive: { fa: "فعال", en: "Active" },
  statusInactive: { fa: "غیرفعال", en: "Inactive" },

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
};

// 1. Create the context to hold language state.
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "fa"
  );

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
    localStorage.setItem("language", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "fa" ? "en" : "fa"));
  };

  const t = (key, options = {}) => {
    const keyTranslations = translations[key];
    if (!keyTranslations) {
      console.warn(`Translation key "${key}" not found.`);
      return key;
    }
    let translation = keyTranslations[language] || keyTranslations["en"] || key;

    Object.keys(options).forEach((optionKey) => {
      translation = translation.replace(`{${optionKey}}`, options[optionKey]);
    });

    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
export const useLanguage = () => useContext(LanguageContext);
