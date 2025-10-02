const dataTranslations = {
  // Department Names
  "Ministry of Interior": "وزارت امور داخله",
  "Ministry of Commerce": "وزارت تجارت و صنایع",
  // Service Names
  "Passport Renewal": "تمدید گذرنامه",
  "Business License Application": "درخواست جواز کسب",
  "National ID Card Update": "به‌روزرسانی تذکره",
};

export const translateData = (text, lang) => {
  if (lang === "fa" && dataTranslations[text]) {
    return dataTranslations[text];
  }
  return text;
};
