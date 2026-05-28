import { getStrings, type AppStrings } from "@/constants/i18n";
import { LANGUAGE_STORAGE_KEY } from "@/constants/settings";
import { storage } from "@/services/storage";
import { useCallback, useEffect, useState } from "react";

export function useAppStrings() {
  const [languageCode, setLanguageCode] = useState("en");
  const [strings, setStrings] = useState<AppStrings>(() => getStrings("en"));

  const refreshLanguage = useCallback(async () => {
    const stored = await storage.getItem(LANGUAGE_STORAGE_KEY);
    const nextCode = stored ?? "en";
    setLanguageCode(nextCode);
    setStrings(getStrings(nextCode));
  }, []);

  useEffect(() => {
    void refreshLanguage();
  }, [refreshLanguage]);

  return {
    languageCode,
    strings,
    refreshLanguage,
  };
}
