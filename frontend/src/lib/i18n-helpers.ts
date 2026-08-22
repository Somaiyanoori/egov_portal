import i18n from "@/i18n";

/**
 * Translate a data name that might have Fa version
 * e.g., service.name (EN) vs service.nameFa (Farsi)
 */
export function localizeName(
  item: { name: string; nameFa?: string | null } | null | undefined,
): string {
  if (!item) return "";
  if (i18n.language === "fa" && item.nameFa) {
    return item.nameFa;
  }
  return item.name;
}

/**
 * Translate description similarly
 */
export function localizeDescription(
  item:
    | { description?: string | null; descriptionFa?: string | null }
    | null
    | undefined,
): string {
  if (!item) return "";
  if (i18n.language === "fa" && item.descriptionFa) {
    return item.descriptionFa;
  }
  return item.description ?? "";
}

/**
 * Get current locale for date-fns
 */
import { faIR, enUS } from "date-fns/locale";

export function getDateLocale() {
  return i18n.language === "fa" ? faIR : enUS;
}
