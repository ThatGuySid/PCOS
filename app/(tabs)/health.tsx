import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const MENU_ITEMS = [
  {
    icon: "📅",
    gradient: ["#C0162C", "#E8637A"],
    title: "Period Log",
    subtitle: "Track your cycle, mark start/end & ovulation",
    route: "/period-log",
    tag: "Core",
  },
  {
    icon: "⚡",
    gradient: ["#D97706", "#F59E0B"],
    title: "Workout",
    subtitle: "PCOS-friendly routines for every phase",
    route: "/workout",
    tag: "Fitness",
  },
  {
    icon: "🥗",
    gradient: ["#059669", "#22C55E"],
    title: "Food & Diet",
    subtitle: "Phase-based nutrition & AI food guide",
    route: "/food-diet",
    tag: "Nutrition",
  },
  {
    icon: "💬",
    gradient: ["#7C3AED", "#A855F7"],
    title: "AI Assistant",
    subtitle: "Your personalised PCOS health companion",
    route: "/ai-assistant",
    tag: "AI",
  },
];

function Orb({
  size,
  color,
  style,
}: {
  size: number;
  color: string;
  style?: object;
}) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          position: "absolute",
          opacity: 0.1,
        },
        style,
      ]}
    />
  );
}

export default function HealthScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "#FEF4F5" }}>
      <Orb size={240} color="#E8556A" style={{ top: -80, right: -60 }} />
      <Orb size={140} color="#F4A0B0" style={{ bottom: 200, left: -50 }} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{ paddingTop: 60, paddingHorizontal: 24, paddingBottom: 32 }}
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
          <Text
            style={{
              color: "#3A0A12",
              fontSize: 28,
              fontWeight: "900",
              lineHeight: 34,
            }}
          >
            Your Wellness{"\n"}
            <Text style={{ color: "#C0162C" }}>Hub</Text>
          </Text>
          <Text style={{ color: "#9A6070", fontSize: 14, marginTop: 8 }}>
            Everything you need, beautifully in one place.
          </Text>
        </View>

        {/* Cards */}
        <View style={{ paddingHorizontal: 20, gap: 14 }}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.route}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.85}
              style={{
                backgroundColor: "#fff",
                borderRadius: 24,
                padding: 20,
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
                shadowColor: "#C0162C",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.08,
                shadowRadius: 18,
                elevation: 5,
              }}
            >
              {/* Icon */}
              <View
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 20,
                  backgroundColor: item.gradient[0],
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: item.gradient[0],
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 6,
                }}
              >
                <Text style={{ fontSize: 26 }}>{item.icon}</Text>
              </View>

              {/* Text */}
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <Text
                    style={{
                      color: "#3A0A12",
                      fontSize: 16,
                      fontWeight: "800",
                    }}
                  >
                    {item.title}
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#FEF0F2",
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: "#C0162C",
                        fontSize: 9,
                        fontWeight: "700",
                        letterSpacing: 0.8,
                      }}
                    >
                      {item.tag}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{ color: "#9A6070", fontSize: 13, lineHeight: 18 }}
                >
                  {item.subtitle}
                </Text>
              </View>

              {/* Arrow */}
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 12,
                  backgroundColor: "#FEF0F2",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "#C0162C", fontSize: 16, fontWeight: "700" }}
                >
                  ›
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
