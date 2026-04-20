import HealthMenuCard from "@/components/health/HealthMenuCard";
import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";

const MENU_ITEMS = [
  {
    icon: "📅",
    iconBg: "#E8637A",
    title: "Period Log",
    subtitle: "Mark start/end, ovulation,\nand log symptoms",
    route: "/period-log",
  },
  {
    icon: "⚡",
    iconBg: "#F59E0B",
    title: "Workout",
    subtitle: "PCOS/PCOD-friendly\nworkout routines",
    route: "/workout",
  },
  {
    icon: "🥗",
    iconBg: "#22C55E",
    title: "Food & Diet",
    subtitle: "Nutrition guide",
    route: "/food-diet",
  },
  {
    icon: "💬",
    iconBg: "#E8637A",
    title: "AI Assistant",
    subtitle: "Personalized health\nassistant",
    route: "/ai-assistant",
  },
];

export default function HealthScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "#F7C5CC" }}>
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingTop: 56 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Page title */}
        <Text
          style={{
            color: "#C0162C",
            fontSize: 24,
            fontWeight: "800",
            marginBottom: 24,
          }}
        >
          Your Wellness Hub
        </Text>

        {/* Menu cards */}
        {MENU_ITEMS.map((item) => (
          <HealthMenuCard
            key={item.route}
            icon={item.icon}
            iconBg={item.iconBg}
            title={item.title}
            subtitle={item.subtitle}
            onPress={() => router.push(item.route as any)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
