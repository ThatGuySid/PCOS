import { View, Text } from "react-native";
import { CyclePhase } from "@/context/UserContext";

type Props = {
  phase: CyclePhase;
  cycleDay: number;
};

const PHASE_FOOD_CONFIG: Record<
  CyclePhase,
  { emoji: string; color: string; bg: string; focus: string; tagline: string }
> = {
  Menstrual: {
    emoji: "🌙",
    color: "#C0162C",
    bg: "#F7DDE0",
    focus: "Iron · Anti-inflammatory · Warming foods",
    tagline: "Replenish what your body is losing. Focus on iron-rich and anti-inflammatory foods.",
  },
  Follicular: {
    emoji: "🌱",
    color: "#15803D",
    bg: "#DCFCE7",
    focus: "Light proteins · Fermented foods · Fresh greens",
    tagline: "Support rising estrogen with gut-friendly, nutrient-dense foods.",
  },
  Ovulation: {
    emoji: "⚡",
    color: "#D97706",
    bg: "#FEF3C7",
    focus: "Antioxidants · Fibre · Raw vegetables",
    tagline: "Peak phase — fuel it with antioxidants that support hormonal balance.",
  },
  Luteal: {
    emoji: "🍂",
    color: "#7C3AED",
    bg: "#EDE9FE",
    focus: "Magnesium · Complex carbs · Mood-boosting foods",
    tagline: "Reduce PMS symptoms with magnesium-rich and calming foods.",
  },
};

export default function PhaseFoodBanner({ phase, cycleDay }: Props) {
  const cfg = PHASE_FOOD_CONFIG[phase];

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
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <Text style={{ fontSize: 28 }}>{cfg.emoji}</Text>
        <View>
          <Text style={{ color: cfg.color, fontSize: 18, fontWeight: "800" }}>
            {phase} Phase — Day {cycleDay}
          </Text>
          <Text style={{ color: "#6B7280", fontSize: 12 }}>Nutrition focus</Text>
        </View>
      </View>
      <Text style={{ color: "#374151", fontSize: 13, lineHeight: 20, marginBottom: 8 }}>
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
        <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>{cfg.focus}</Text>
      </View>
    </View>
  );
}
