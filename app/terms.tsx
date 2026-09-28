import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// TODO: template text — have a lawyer review before release, and replace the
// placeholder contact email with a real, monitored inbox.
const SECTIONS: { title: string; body: string }[] = [
  {
    title: "Using HerFlow",
    body: "By creating an account or using HerFlow, you agree to these Terms & Conditions and our Privacy Policy. If you do not agree, please do not use the app.",
  },
  {
    title: "Not medical advice",
    body: "HerFlow, including its predictions, tips, and AI Assistant, is for general information and tracking only. It is not medical advice, diagnosis, or treatment. Always talk to a qualified doctor about your health, and seek urgent care in an emergency. Cycle and ovulation predictions are estimates and must not be relied on for contraception or medical decisions.",
  },
  {
    title: "AI Assistant",
    body: "AI replies may be inaccurate or incomplete. Do not share information in the chat that you are not comfortable sharing with a third-party AI provider.",
  },
  {
    title: "Your account",
    body: "You are responsible for keeping your login details secure and for the information you enter. You can delete your account and data at any time from Settings > Danger Zone.",
  },
  {
    title: "Acceptable use",
    body: "Do not misuse the app, attempt to access other users' data, interfere with its operation, or use it for anything unlawful.",
  },
  {
    title: "Our content",
    body: "The app, its design, and its content belong to HerFlow. You may use them for personal, non-commercial purposes only.",
  },
  {
    title: "Availability and liability",
    body: "HerFlow is provided \"as is\" without warranties. To the fullest extent permitted by law, we are not liable for any loss or harm arising from your use of, or reliance on, the app.",
  },
  {
    title: "Changes and termination",
    body: "We may update these terms or suspend the service from time to time. Continued use after an update means you accept the new terms.",
  },
  {
    title: "Governing law",
    body: "These terms are governed by the laws of India. Courts in Delhi have jurisdiction, subject to any consumer rights you have under the law of your country.",
  },
  {
    title: "Contact",
    body: "Questions about these terms? Email privacy@herflow.app.",
  },
];

export default function TermsScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "#FAF4EB" }}>
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingTop: 56, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 20 }}
        >
          <Text style={{ color: "#C0162C", fontSize: 20 }}>←</Text>
          <Text style={{ color: "#C0162C", fontSize: 17, fontWeight: "700" }}>
            Terms & Conditions
          </Text>
        </TouchableOpacity>

        <Text style={{ color: "#9A6070", fontSize: 12, marginBottom: 14 }}>
          Last updated: 2026-09-28
        </Text>

        {SECTIONS.map((s) => (
          <View
            key={s.title}
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 18,
              marginBottom: 16,
            }}
          >
            <Text style={{ color: "#3A1A20", fontSize: 14, fontWeight: "800", marginBottom: 6 }}>
              {s.title}
            </Text>
            <Text style={{ color: "#8C5F66", fontSize: 13, lineHeight: 20 }}>
              {s.body}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
