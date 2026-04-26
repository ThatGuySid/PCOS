import { Tabs } from "expo-router";
import { Text, View } from "react-native";

function TabIcon({
  emoji,
  focused,
  label,
}: {
  emoji: string;
  focused: boolean;
  label: string;
}) {
  return (
    <View style={{ alignItems: "center", gap: 2 }}>
      <View
        style={{
          width: 40,
          height: 30,
          borderRadius: 12,
          backgroundColor: focused ? "#FEE8EB" : "transparent",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.4 }}>
          {emoji}
        </Text>
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#F5E0E3",
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
          shadowColor: "#C0162C",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 16,
          elevation: 12,
        },
        tabBarActiveTintColor: "#C0162C",
        tabBarInactiveTintColor: "#C0A0A8",
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" focused={focused} label="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          title: "Health",
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🌸" focused={focused} label="Health" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" focused={focused} label="Profile" />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="⚙️" focused={focused} label="Settings" />
          ),
        }}
      />
    </Tabs>
  );
}
