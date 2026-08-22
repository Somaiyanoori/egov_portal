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

  // Show the label of the OTHER language (what you'll switch TO)
  const otherLangLabel = i18n.language === "en" ? "فارسی" : "English";

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
          {otherLangLabel}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
