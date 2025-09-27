import React, { createContext, useState, useContext, useEffect } from "react";

// تمام متن‌های چند زبانه را اینجا مرکزی می‌کنیم
const translations = {
  langEnglish: { fa: "English", en: "English" },
  langFarsi: { fa: "فارسی", en: "Farsi" },

  // Register Page Translations
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
  langEnglish: { fa: "English", en: "English" },
  langFarsi: { fa: "فارسی", en: "Farsi" },
  // ... ترجمه‌های صفحات دیگر بعداً اضافه می‌شوند
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
    localStorage.setItem("language", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "fa" ? "en" : "fa"));
  };

  const t = (key) => translations[key]?.[language] || key;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
