import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { Linking, ScrollView, Text, View } from "react-native";
import DangerZone from "../../components/settings/DangerZone";
import SettingToggleRow from "../../components/settings/SettingToggleRow";

export default function SettingsScreen() {
  const { user, setUser, resetUser } = useUser();
  const router = useRouter();

  const handleResetAllData = async () => {
    await resetUser();
    // Send back to onboarding after reset
    router.replace("/onboarding");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F7C5CC" }}>
      <ScrollView
        contentContainerStyle={{
          padding: 24,
          paddingTop: 56,
          paddingBottom: 48,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Title ── */}
        <Text
          style={{
            color: "#C0162C",
            fontSize: 24,
            fontWeight: "800",
            marginBottom: 24,
          }}
        >
          Settings
        </Text>

        {/* ── Notifications ── */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 18,
            paddingHorizontal: 18,
            marginBottom: 16,
            shadowColor: "#C0162C",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Text
            style={{
              color: "#C0162C",
              fontSize: 14,
              fontWeight: "800",
              paddingTop: 16,
              paddingBottom: 4,
            }}
          >
            Notifications
          </Text>

          <SettingToggleRow
            type="toggle"
            emoji="🔔"
            label="Period Reminders"
            description="Get notified 2 days before your predicted period"
            value={user.notificationsEnabled}
            onToggle={(v: boolean) => setUser({ notificationsEnabled: v })}
          />

          <SettingToggleRow
            type="toggle"
            emoji="💊"
            label="Daily Log Reminder"
            description="Remind me to log symptoms each day"
            value={false}
            onToggle={() => {}}
          />
        </View>

        {/* ── App ── */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 18,
            paddingHorizontal: 18,
            marginBottom: 16,
            shadowColor: "#C0162C",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Text
            style={{
              color: "#C0162C",
              fontSize: 14,
              fontWeight: "800",
              paddingTop: 16,
              paddingBottom: 4,
            }}
          >
            App
          </Text>

          <SettingToggleRow
            type="button"
            emoji="🔒"
            label="Privacy Policy"
            onPress={() => Linking.openURL("https://herflow.app/privacy")}
          />

          <SettingToggleRow
            type="button"
            emoji="📋"
            label="Terms of Service"
            onPress={() => Linking.openURL("https://herflow.app/terms")}
          />

          <SettingToggleRow
            type="button"
            emoji="💌"
            label="Send Feedback"
            onPress={() => Linking.openURL("mailto:hello@herflow.app")}
          />
        </View>

        {/* ── About ── */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 18,
            padding: 18,
            marginBottom: 24,
            shadowColor: "#C0162C",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Text
            style={{
              color: "#C0162C",
              fontSize: 14,
              fontWeight: "800",
              marginBottom: 10,
            }}
          >
            About
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "#8C5F66", fontSize: 13 }}>App Version</Text>
            <Text style={{ color: "#3A1A20", fontSize: 13, fontWeight: "600" }}>
              1.0.0
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            <Text style={{ color: "#8C5F66", fontSize: 13 }}>Built for</Text>
            <Text style={{ color: "#3A1A20", fontSize: 13, fontWeight: "600" }}>
              PCOS / PCOD
            </Text>
          </View>
        </View>

        {/* ── Danger zone ── */}
        <DangerZone onResetAllData={handleResetAllData} />
      </ScrollView>
    </View>
  );
}
