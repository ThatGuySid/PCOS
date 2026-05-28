import { useAppStrings } from "@/hooks/useAppStrings";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function PrivacyScreen() {
  const router = useRouter();
  const { strings } = useAppStrings();

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
            {strings.privacyTitle}
          </Text>
        </TouchableOpacity>

        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 18,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              color: "#3A1A20",
              fontSize: 16,
              fontWeight: "800",
              marginBottom: 8,
            }}
          >
            {strings.privacyHeaderTitle}
          </Text>
          <Text
            style={{
              color: "#8C5F66",
              fontSize: 13,
              lineHeight: 20,
              marginBottom: 12,
            }}
          >
            {strings.privacySummary}
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/privacy-policy")}
            style={{
              backgroundColor: "#C0162C",
              borderRadius: 12,
              paddingVertical: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}>
              {strings.privacyPolicyButton}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 18,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              color: "#3A1A20",
              fontSize: 14,
              fontWeight: "800",
              marginBottom: 6,
            }}
          >
            {strings.privacyDataCollectedTitle}
          </Text>
          <Text style={{ color: "#8C5F66", fontSize: 13, lineHeight: 20 }}>
            {strings.privacyDataCollectedItems.join("\n")}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 18,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              color: "#3A1A20",
              fontSize: 14,
              fontWeight: "800",
              marginBottom: 6,
            }}
          >
            {strings.privacyUsageTitle}
          </Text>
          <Text style={{ color: "#8C5F66", fontSize: 13, lineHeight: 20 }}>
            {strings.privacyUsageItems.join("\n")}
          </Text>
        </View>

        <View
          style={{ backgroundColor: "#fff", borderRadius: 20, padding: 18 }}
        >
          <Text
            style={{
              color: "#3A1A20",
              fontSize: 14,
              fontWeight: "800",
              marginBottom: 6,
            }}
          >
            {strings.privacyControlsTitle}
          </Text>
          <Text style={{ color: "#8C5F66", fontSize: 13, lineHeight: 20 }}>
            {strings.privacyControlsItems.join("\n")}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
