import { useAppStrings } from "@/hooks/useAppStrings";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function PrivacyPolicyScreen() {
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
            {strings.privacyPolicyTitle}
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
              fontSize: 14,
              fontWeight: "800",
              marginBottom: 6,
            }}
          >
            {strings.privacyPolicyUpdatedLabel}: 2026-05-28
          </Text>
          <Text style={{ color: "#8C5F66", fontSize: 13, lineHeight: 20 }}>
            {strings.privacyPolicyOverviewBody}
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
            {strings.privacyPolicyDataTitle}
          </Text>
          <Text style={{ color: "#8C5F66", fontSize: 13, lineHeight: 20 }}>
            {strings.privacyPolicyDataBody.join("\n")}
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
            {strings.privacyPolicyUseTitle}
          </Text>
          <Text style={{ color: "#8C5F66", fontSize: 13, lineHeight: 20 }}>
            {strings.privacyPolicyUseBody.join("\n")}
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
            {strings.privacyPolicyShareTitle}
          </Text>
          <Text style={{ color: "#8C5F66", fontSize: 13, lineHeight: 20 }}>
            {strings.privacyPolicyShareBody}
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
            {strings.privacyPolicySecurityTitle}
          </Text>
          <Text style={{ color: "#8C5F66", fontSize: 13, lineHeight: 20 }}>
            {strings.privacyPolicySecurityBody}
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
            {strings.privacyPolicyChoicesTitle}
          </Text>
          <Text style={{ color: "#8C5F66", fontSize: 13, lineHeight: 20 }}>
            {strings.privacyPolicyChoicesBody.join("\n")}
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
            {strings.privacyPolicyContactTitle}
          </Text>
          <Text style={{ color: "#8C5F66", fontSize: 13, lineHeight: 20 }}>
            {strings.privacyPolicyContactBody}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
