import React from "react";
import { useLanguage } from "../context/LanguageContext.jsx";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="app-footer text-muted text-center py-3">
      <div className="container">
        &copy; {new Date().getFullYear()} {t("footerText")}
      </div>
    </footer>
  );
};

export default Footer;
