import DangerZone from "@/components/settings/DangerZone";
import {
    APP_VERSION,
    LANGUAGE_STORAGE_KEY,
    getLanguageLabel,
} from "@/constants/settings";
import { useUser } from "@/context/UserContext";
import { useAppStrings } from "@/hooks/useAppStrings";
import { getMedicineTracker } from "@/services/medicineService";
import {
    cancelAllNotifications,
    requestPermission,
    scheduleAllCycleNotifications,
    scheduleCuteNotifications,
    scheduleMedicineNotifications,
} from "@/services/notificationService";
import { storage } from "@/services/storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
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
  value,
  onValueChange,
  onPress,
}: {
  icon: string;
  label: string;
  sub?: string;
  hasToggle?: boolean;
  value?: boolean;
  onValueChange?: (next: boolean) => void;
  onPress?: () => void;
}) {
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
          value={value ?? false}
          onValueChange={onValueChange}
          trackColor={{ false: "#F5E0E3", true: "#C0162C" }}
          thumbColor="#fff"
        />
      ) : (
        <Text style={{ color: "#C0162C", fontSize: 18 }}>›</Text>
      )}
    </TouchableOpacity>
  );
}

type SettingAction =
  | "edit-profile"
  | "privacy"
  | "export-data"
  | "language"
  | "about";

type SettingItem = {
  icon: string;
  label: string;
  sub?: string;
  hasToggle?: boolean;
  action?: SettingAction;
};

const buildSections = (
  languageLabel: string,
  strings: ReturnType<typeof useAppStrings>["strings"],
) => [
  {
    title: strings.settingsSectionNotifications,
    items: [
      {
        icon: "🔔",
        label: strings.settingsItemPeriodRemindersTitle,
        sub: strings.settingsItemPeriodRemindersSub,
        hasToggle: true,
      },
      {
        icon: "💊",
        label: strings.settingsItemMedicineAlertsTitle,
        sub: strings.settingsItemMedicineAlertsSub,
        hasToggle: true,
      },
      {
        icon: "🥚",
        label: strings.settingsItemOvulationAlertsTitle,
        sub: strings.settingsItemOvulationAlertsSub,
        hasToggle: true,
      },
    ],
  },
  {
    title: strings.settingsSectionAccount,
    items: [
      {
        icon: "👤",
        label: strings.settingsItemEditProfileTitle,
        action: "edit-profile",
      },
      {
        icon: "🔒",
        label: strings.settingsItemPrivacyTitle,
        action: "privacy",
      },
      {
        icon: "📤",
        label: strings.settingsItemExportTitle,
        action: "export-data",
      },
    ],
  },
  {
    title: strings.settingsSectionApp,
    items: [
      {
        icon: "🌐",
        label: strings.settingsItemLanguageTitle,
        sub: languageLabel,
        action: "language",
      },
      {
        icon: "ℹ️",
        label: strings.settingsItemAboutTitle,
        sub: `v${APP_VERSION}`,
        action: "about",
      },
    ],
  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { resetUser, signOutUser, user, setUser, cycleSnapshot, firebaseUser } =
    useUser();
  const { strings, refreshLanguage } = useAppStrings();
  const [languageLabel, setLanguageLabel] = useState("English");
  const sections = useMemo(
    () => buildSections(languageLabel, strings),
    [languageLabel, strings],
  );

  const handleAction = (action?: SettingAction) => {
    if (!action) return;
    if (action === "edit-profile") {
      router.push("/(tabs)/profile");
    } else if (action === "privacy") {
      router.push("/privacy");
    } else if (action === "export-data") {
      router.push("/export-data");
    } else if (action === "language") {
      router.push("/language");
    } else if (action === "about") {
      router.push("/about");
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const loadLanguage = async () => {
        await refreshLanguage();
        const saved = await storage.getItem(LANGUAGE_STORAGE_KEY);
        if (isActive) {
          setLanguageLabel(getLanguageLabel(saved));
        }
      };
      void loadLanguage();
      return () => {
        isActive = false;
      };
    }, []),
  );

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

  const handleNotificationsToggle = async (nextValue: boolean) => {
    setUser({ notificationsEnabled: nextValue });

    if (!nextValue) {
      await cancelAllNotifications();
      return;
    }

    const granted = await requestPermission();
    if (!granted) {
      Alert.alert(
        "Notifications disabled",
        "Enable notifications in your device settings to receive reminders.",
      );
      setUser({ notificationsEnabled: false });
      return;
    }

    await scheduleAllCycleNotifications(cycleSnapshot);
    await scheduleCuteNotifications();

    if (firebaseUser) {
      const tracker = await getMedicineTracker(firebaseUser.uid);
      await scheduleMedicineNotifications(tracker.medicines);
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
            {strings.settingsTitle}
          </Text>
        </View>

        {/* Setting sections */}
        {sections.map((section) => (
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
            {section.items.map((item: SettingItem) => (
              <SettingRow
                key={item.action ?? item.label}
                {...item}
                value={item.hasToggle ? user.notificationsEnabled : undefined}
                onValueChange={
                  item.hasToggle ? handleNotificationsToggle : undefined
                }
                onPress={
                  item.hasToggle ? undefined : () => handleAction(item.action)
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
              {strings.settingsSignOut}
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
