// src/pages/citizen/PaymentSuccessPage.jsx

import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext.jsx";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  // Read the request ID from the navigation state
  const requestId = location.state?.requestId;

  // After a few seconds, automatically redirect the user to the dashboard
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/app/dashboard");
    }, 5000); // 5-second delay

    // Cleanup the timer if the component is unmounted
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container text-center mt-5">
      <div className="card shadow-sm p-5">
        <i className="fas fa-check-circle fa-5x text-success mb-4"></i>

        {/* Use the 't' function for all static text */}
        <h1 className="mb-3">{t("paymentSuccessTitle")}</h1>

        {/* Display the request ID if it exists */}
        {requestId && (
          <p
            className="lead"
            // Use dangerouslySetInnerHTML because our translation includes <strong> tags
            dangerouslySetInnerHTML={{
              __html: t("paymentSuccessMessage", { requestId: requestId }),
            }}
          />
        )}

        <p className="text-muted">{t("paymentSuccessRedirect")}</p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
