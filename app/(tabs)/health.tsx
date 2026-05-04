import { Asset } from "expo-asset";
import { useRouter } from "expo-router";
import {
    Image,
    ImageBackground,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SvgUri } from "react-native-svg";

const DINING_ROOM_URI = Asset.fromModule(
  require("@/assets/images/Dining Room.svg"),
).uri;
const WORKOUT_PNG = require("@/assets/images/workout emoji.png");
const AI_CHAT_PNG = require("@/assets/images/chatAI.png");

const MENU_ITEMS = [
  {
    icon: require("@/assets/images/Calendar.png"),
    iconType: "image" as const,
    backgroundColor: "#FF5476",
    title: "Period Log",
    subtitle: "Track your cycle, mark start/end & ovulation",
    route: "/period-log",
    tag: "Core",
  },
  {
    icon: WORKOUT_PNG,
    iconType: "image" as const,
    backgroundColor: "#FF9E16",
    title: "Workout",
    subtitle: "PCOS-friendly routines for every phase",
    route: "/workout",
    tag: "Fitness",
  },
  {
    icon: DINING_ROOM_URI,
    iconType: "svgUri" as const,
    backgroundColor: "#059669",
    title: "Food & Diet",
    subtitle: "Phase-based nutrition & AI food guide",
    route: "/food-diet",
    tag: "Nutrition",
  },
  {
    icon: AI_CHAT_PNG,
    iconType: "image" as const,
    backgroundColor: "#FF7691",
    title: "AI Assistant",
    subtitle: "Your personalised PCOS health companion",
    route: "/ai-assistant",
    tag: "AI",
  },
];

export default function HealthScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("@/assets/images/onboarding backgroud.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
      imageStyle={{ opacity: 1 }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(254, 244, 245, 0.14)",
        }}
      >
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
            {MENU_ITEMS.map((item) => {
              const isPeriod = item.title === "Period Log";
              const showShadow = isPeriod;

              return (
                <TouchableOpacity
                  key={item.route}
                  onPress={() => router.push(item.route as any)}
                  activeOpacity={0.85}
                  style={{
                    backgroundColor: "#FAF4EB",
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
                      width: item.title === "Food & Diet" ? 62 : 58,
                      height: item.title === "Food & Diet" ? 62 : 58,
                      borderRadius:
                        item.title === "Food & Diet"
                          ? 999
                          : isPeriod
                            ? 999
                            : 20,
                      backgroundColor: isPeriod
                        ? item.backgroundColor
                        : item.title === "Food & Diet"
                          ? "#34D01F"
                          : "transparent",
                      alignItems: "center",
                      justifyContent: "center",
                      shadowColor: showShadow
                        ? item.backgroundColor
                        : "transparent",
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: showShadow ? 0.3 : 0,
                      shadowRadius: 12,
                      elevation: showShadow ? 6 : 0,
                    }}
                  >
                    {item.iconType === "image" ? (
                      <Image
                        source={item.icon}
                        resizeMode="contain"
                        style={{
                          width:
                            item.title === "Workout" ||
                            item.title === "AI Assistant"
                              ? 36
                              : 30,
                          height:
                            item.title === "Workout" ||
                            item.title === "AI Assistant"
                              ? 36
                              : 30,
                        }}
                      />
                    ) : (
                      <SvgUri uri={item.icon} width={39} height={39} />
                    )}
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
                      style={{
                        color: "#9A6070",
                        fontSize: 13,
                        lineHeight: 18,
                      }}
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
                      backgroundColor: "#F8E6E0",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#C0162C",
                        fontSize: 16,
                        fontWeight: "700",
                      }}
                    >
                      ›
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}
