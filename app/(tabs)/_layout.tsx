import { Tabs } from "expo-router";
import { Text } from "react-native";

// ── Icon components — inline SVG-style using emoji + styled views ─────────────
// Replace these with a proper icon library (e.g. lucide-react-native) if needed

function HomeIcon({ focused }: { focused: boolean }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.45 }}>🏠</Text>;
}

function HeartIcon({ focused }: { focused: boolean }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.45 }}>🤍</Text>;
}

function ProfileIcon({ focused }: { focused: boolean }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.45 }}>👤</Text>;
}

function SettingsIcon({ focused }: { focused: boolean }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.45 }}>⚙️</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Tab bar styling to match the herFlow design
        tabBarStyle: {
          backgroundColor: "#FDF0F2",
          borderTopColor: "#F2D0D5",
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#C0162C",
        tabBarInactiveTintColor: "#B08890",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <HomeIcon focused={focused} />,
        }}
      />

      {/* Health / Wellness — add app/(tabs)/health.tsx for this tab */}
      <Tabs.Screen
        name="health"
        options={{
          title: "Health",
          tabBarIcon: ({ focused }) => <HeartIcon focused={focused} />,
        }}
      />

      {/* Profile — add app/(tabs)/profile.tsx for this tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => <ProfileIcon focused={focused} />,
        }}
      />

      {/* Settings — add app/(tabs)/settings.tsx for this tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => <SettingsIcon focused={focused} />,
        }}
      />
    </Tabs>
  );
}
