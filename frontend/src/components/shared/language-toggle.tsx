import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface LanguageToggleProps {
  variant?: "default" | "glass";
}

export function LanguageToggle({ variant = "default" }: LanguageToggleProps) {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "fa" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant={variant === "glass" ? "glass" : "ghost"}
      size="sm"
      onClick={toggleLanguage}
      className="gap-2"
    >
      <Languages className="h-4 w-4" />
      <AnimatePresence mode="wait">
        <motion.span
          key={i18n.language}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.15 }}
        >
          {i18n.language === "en" ? "فارسی" : "English"}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
