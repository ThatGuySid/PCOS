import {
    LANGUAGE_OPTIONS,
    LANGUAGE_STORAGE_KEY,
    getLanguageLabel,
} from "@/constants/settings";
import { useAppStrings } from "@/hooks/useAppStrings";
import { storage } from "@/services/storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function LanguageScreen() {
  const router = useRouter();
  const { strings, refreshLanguage } = useAppStrings();
  const [selectedCode, setSelectedCode] = useState<string>("en");

  useEffect(() => {
    let isMounted = true;
    const loadLanguage = async () => {
      const saved = await storage.getItem(LANGUAGE_STORAGE_KEY);
      if (isMounted) {
        setSelectedCode(saved ?? "en");
      }
    };
    void loadLanguage();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelect = async (code: string) => {
    setSelectedCode(code);
    await storage.setItem(LANGUAGE_STORAGE_KEY, code);
    await refreshLanguage();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FAF4EB" }}>
      <ScrollView
        contentContainerStyle={{
          padding: 24,
          paddingTop: 56,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 20,
          }}
        >
          <Text style={{ color: "#C0162C", fontSize: 20 }}>←</Text>
          <Text style={{ color: "#C0162C", fontSize: 17, fontWeight: "700" }}>
            {strings.languageTitle}
          </Text>
        </TouchableOpacity>

        <View
          style={{ backgroundColor: "#fff", borderRadius: 20, padding: 18 }}
        >
          <Text
            style={{
              color: "#3A1A20",
              fontSize: 16,
              fontWeight: "800",
              marginBottom: 8,
            }}
          >
            {strings.languageHeaderTitle}
          </Text>
          <Text
            style={{
              color: "#8C5F66",
              fontSize: 13,
              lineHeight: 20,
              marginBottom: 12,
            }}
          >
            {strings.languageSummaryPrefix}
            {getLanguageLabel(selectedCode)}
            {strings.languageSummarySuffix}
          </Text>

          {LANGUAGE_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.code}
              onPress={() => handleSelect(option.code)}
              style={{
                borderWidth: 1,
                borderColor:
                  selectedCode === option.code ? "#C0162C" : "#F2D0D5",
                borderRadius: 14,
                paddingVertical: 12,
                paddingHorizontal: 14,
                marginBottom: 10,
                backgroundColor:
                  selectedCode === option.code ? "#FFF1F2" : "#fff",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{ color: "#3A1A20", fontSize: 14, fontWeight: "700" }}
              >
                {option.label}
              </Text>
              <Text style={{ color: "#C0162C", fontSize: 16 }}>
                {selectedCode === option.code ? "✓" : ""}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
