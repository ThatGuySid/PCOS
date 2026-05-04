import DangerZone from "@/components/settings/DangerZone";
import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Platform,
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// decorative orbs removed from settings

function SettingRow({
  icon,
  label,
  sub,
  hasToggle,
  onPress,
}: {
  icon: string;
  label: string;
  sub?: string;
  hasToggle?: boolean;
  onPress?: () => void;
}) {
  const [enabled, setEnabled] = useState(false);
  return (
    <TouchableOpacity
      onPress={!hasToggle ? onPress : undefined}
      activeOpacity={0.75}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderColor: "#F5E0E3",
        gap: 14,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 14,
          backgroundColor: "#FEE8EB",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 18 }}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: "#3A0A12", fontSize: 14, fontWeight: "700" }}>
          {label}
        </Text>
        {sub && (
          <Text style={{ color: "#9A6070", fontSize: 12, marginTop: 2 }}>
            {sub}
          </Text>
        )}
      </View>
      {hasToggle ? (
        <Switch
          value={enabled}
          onValueChange={setEnabled}
          trackColor={{ false: "#F5E0E3", true: "#C0162C" }}
          thumbColor="#fff"
        />
      ) : (
        <Text style={{ color: "#C0162C", fontSize: 18 }}>›</Text>
      )}
    </TouchableOpacity>
  );
}

const SECTIONS = [
  {
    title: "Notifications",
    items: [
      {
        icon: "🔔",
        label: "Period Reminders",
        sub: "Get notified before your period",
        hasToggle: true,
      },
      {
        icon: "💊",
        label: "Medicine Alerts",
        sub: "Daily medication reminders",
        hasToggle: true,
      },
      {
        icon: "🥚",
        label: "Ovulation Alerts",
        sub: "Track your fertile window",
        hasToggle: true,
      },
    ],
  },
  {
    title: "Account",
    items: [
      { icon: "👤", label: "Edit Profile" },
      { icon: "🔒", label: "Privacy & Security" },
      { icon: "📤", label: "Export Health Data" },
    ],
  },
  {
    title: "App",
    items: [
      { icon: "🌐", label: "Language", sub: "English" },
      { icon: "ℹ️", label: "About HerFlow", sub: "v1.0.0" },
    ],
  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { resetUser, signOutUser } = useUser();

  // Full reset — deletes the account and returns to the login screen
  const handleResetAllData = async () => {
    const result = await resetUser();
    if (!result.success) {
      Alert.alert("Reset failed", result.error ?? "Please try again.");
      return;
    }
    router.replace("/login");
  };

  const performSignOut = async () => {
    const result = await signOutUser();
    if (!result.success) {
      Alert.alert("Sign out failed", result.error ?? "Please try again.");
      return;
    }
    router.replace("/login");
  };

  const handleSignOut = () => {
    if (Platform.OS === "web") {
      if (confirm("Sign Out?\n\nYou'll be taken to the login screen.")) {
        void performSignOut();
      }
    } else {
      Alert.alert("Sign Out", "Are you sure you want to sign out?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: () => {
            void performSignOut();
          },
        },
      ]);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FAF4EB" }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{ paddingTop: 60, paddingHorizontal: 24, paddingBottom: 28 }}
        >
          <Text
            style={{
              color: "#C0162C",
              fontSize: 11,
              fontWeight: "700",
              letterSpacing: 3,
              textTransform: "uppercase",
              opacity: 0.6,
              marginBottom: 6,
            }}
          >
            herFlow
          </Text>
          <Text style={{ color: "#3A0A12", fontSize: 28, fontWeight: "900" }}>
            Settings
          </Text>
        </View>

        {/* Setting sections */}
        {SECTIONS.map((section) => (
          <View
            key={section.title}
            style={{
              marginHorizontal: 20,
              marginBottom: 16,
              backgroundColor: "#fff",
              borderRadius: 24,
              paddingHorizontal: 20,
              shadowColor: "#C0162C",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.07,
              shadowRadius: 16,
              elevation: 4,
            }}
          >
            <Text
              style={{
                color: "#9A6070",
                fontSize: 11,
                fontWeight: "700",
                letterSpacing: 1.5,
                textTransform: "uppercase",
                paddingTop: 18,
                paddingBottom: 4,
              }}
            >
              {section.title}
            </Text>
            {section.items.map((item) => (
              <SettingRow
                key={item.label}
                {...item}
                onPress={
                  item.label === "Edit Profile"
                    ? () => router.push("/(tabs)/profile")
                    : undefined
                }
              />
            ))}
            <View style={{ height: 4 }} />
          </View>
        ))}

        {/* Sign out */}
        <View style={{ marginHorizontal: 20, marginBottom: 16 }}>
          <TouchableOpacity
            onPress={handleSignOut}
            style={{
              borderWidth: 1.5,
              borderColor: "#C0162C",
              borderRadius: 18,
              paddingVertical: 16,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#C0162C",
                fontSize: 14,
                fontWeight: "800",
                letterSpacing: 0.5,
              }}
            >
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone — always at the bottom, clearly separated */}
        <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
          <DangerZone onResetAllData={handleResetAllData} />
        </View>
      </ScrollView>
    </View>
  );
}
