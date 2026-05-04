import { CyclePhase } from "@/context/UserContext";
import { Image, Text, View } from "react-native";

type Props = {
  phase: CyclePhase;
  cycleDay: number;
  totalCycleDays: number;
};

const PHASE_CONFIG: Record<
  CyclePhase,
  { color: string; bg: string; tagline: string; energy: string }
> = {
  Menstrual: {
    color: "#C0162C",
    bg: "#F7DDE0",
    tagline: "Rest & restore — your body is working hard.",
    energy: "Low energy · Gentle movement",
  },
  Follicular: {
    color: "#15803D",
    bg: "#DCFCE7",
    tagline: "Energy is rising — great time to build strength.",
    energy: "Rising energy · Cardio friendly",
  },
  Ovulation: {
    color: "#D97706",
    bg: "#FEF3C7",
    tagline: "Peak power — push your limits today!",
    energy: "Peak energy · High intensity OK",
  },
  Luteal: {
    color: "#7C3AED",
    bg: "#EDE9FE",
    tagline: "Wind down — focus on low-impact and calm.",
    energy: "Declining energy · Low impact",
  },
};

export default function PhaseWorkoutBanner({
  phase,
  cycleDay,
  totalCycleDays,
}: Props) {
  const cfg = PHASE_CONFIG[phase];

  return (
    <View
      style={{
        backgroundColor: cfg.bg,
        borderRadius: 20,
        padding: 18,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: cfg.color,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginBottom: 8,
        }}
      >
        <View
          style={{
            width: 56,
            height: 56,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("@/assets/images/workout emoji.png")}
            resizeMode="contain"
            style={{ width: 56, height: 56 }}
          />
        </View>
        <View>
          <Text style={{ color: cfg.color, fontSize: 18, fontWeight: "800" }}>
            {phase} Phase
          </Text>
          <Text style={{ color: "#6B7280", fontSize: 12 }}>
            Day {cycleDay} of {totalCycleDays}
          </Text>
        </View>
      </View>
      <Text
        style={{
          color: "#374151",
          fontSize: 13,
          lineHeight: 20,
          marginBottom: 6,
        }}
      >
        {cfg.tagline}
      </Text>
      <View
        style={{
          backgroundColor: cfg.color,
          borderRadius: 50,
          paddingVertical: 4,
          paddingHorizontal: 12,
          alignSelf: "flex-start",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>
          {cfg.energy}
        </Text>
      </View>
    </View>
  );
}
