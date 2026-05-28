export const APP_VERSION = "1.0.0";
export const LANGUAGE_STORAGE_KEY = "settings.language";

export const LANGUAGE_OPTIONS = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "hi", label: "Hindi" },
];

export function getLanguageLabel(code?: string | null): string {
  const match = LANGUAGE_OPTIONS.find((option) => option.code === code);
  return match?.label ?? "English";
}
