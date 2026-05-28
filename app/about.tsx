import { APP_VERSION } from "@/constants/settings";
import { useAppStrings } from "@/hooks/useAppStrings";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function AboutScreen() {
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
            {strings.aboutTitle}
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
              fontSize: 18,
              fontWeight: "800",
              marginBottom: 8,
            }}
          >
            {strings.aboutCardTitle}
          </Text>
          <Text style={{ color: "#8C5F66", fontSize: 14, lineHeight: 20 }}>
            {strings.aboutDescription}
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
              fontSize: 15,
              fontWeight: "800",
              marginBottom: 8,
            }}
          >
            {strings.aboutFeaturesTitle}
          </Text>
          <Text style={{ color: "#8C5F66", fontSize: 13, lineHeight: 20 }}>
            {strings.aboutFeatures.join("\n")}
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
            {strings.aboutInfoTitle}
          </Text>
          <Text style={{ color: "#8C5F66", fontSize: 13, lineHeight: 20 }}>
            {strings.aboutInfoVersionLabel} {APP_VERSION}
            {"\n"}
            {strings.aboutInfoSupportLabel}: support@herflow.app
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
