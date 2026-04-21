import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useUser, CyclePhase } from "@/context/UserContext";
import PhaseFoodBanner from "@/components/food/PhaseFoodBanner";
import FoodCard, { FoodItem } from "@/components/food/FoodCard";
import SymptomFoodTip from "@/components/food/SymptomFoodTip";

// ── Food data per phase ───────────────────────────────────────────────────────
type PhaseFoodData = {
  favour: FoodItem[];
  avoid: FoodItem[];
};

const PHASE_FOODS: Record<CyclePhase, PhaseFoodData> = {
  Menstrual: {
    favour: [
      {
        emoji: "🥬",
        name: "Spinach & Dark Leafy Greens",
        reason: "Rich in iron to replenish what's lost during bleeding. Also high in magnesium which eases cramps.",
      },
      {
        emoji: "🫘",
        name: "Lentils & Legumes",
        reason: "Plant-based iron source. Combined with vitamin C foods, absorption doubles. Also keeps blood sugar stable — key for PCOS.",
      },
      {
        emoji: "🍫",
        name: "Dark Chocolate (70%+)",
        reason: "High in magnesium and iron. Releases endorphins that naturally ease period pain and mood dips.",
      },
      {
        emoji: "🫚",
        name: "Ginger & Turmeric",
        reason: "Potent anti-inflammatory compounds that reduce prostaglandins — the chemicals causing cramps.",
      },
      {
        emoji: "🐟",
        name: "Salmon & Fatty Fish",
        reason: "Omega-3s reduce inflammation and period pain. Studies show they can be as effective as ibuprofen for cramps.",
      },
    ],
    avoid: [
      {
        emoji: "☕",
        name: "Coffee & Caffeine",
        reason: "Constricts blood vessels and worsens cramps. Also disrupts iron absorption from your meals.",
      },
      {
        emoji: "🧂",
        name: "Salty & Processed Foods",
        reason: "Increases water retention and bloating — already common during menstruation.",
      },
      {
        emoji: "🍬",
        name: "Refined Sugar",
        reason: "Causes inflammation and blood sugar spikes that worsen mood swings and fatigue during your period.",
      },
    ],
  },
  Follicular: {
    favour: [
      {
        emoji: "🥚",
        name: "Eggs",
        reason: "Rich in choline and B vitamins that support rising estrogen metabolism. Great protein source for rebuilding energy.",
      },
      {
        emoji: "🥦",
        name: "Broccoli & Cruciferous Veg",
        reason: "Contains DIM (diindolylmethane) which helps your liver metabolise estrogen efficiently — crucial for PCOS.",
      },
      {
        emoji: "🫙",
        name: "Fermented Foods (Yogurt, Kefir)",
        reason: "Support gut microbiome which regulates estrogen recycling. A healthy gut = better hormonal balance.",
      },
      {
        emoji: "🥜",
        name: "Flaxseeds",
        reason: "Lignans in flax support healthy estrogen levels by binding excess estrogen — particularly helpful in PCOS.",
      },
      {
        emoji: "🫐",
        name: "Berries",
        reason: "Antioxidants protect follicles developing in your ovaries this phase. Also low glycaemic — great for PCOS insulin management.",
      },
    ],
    avoid: [
      {
        emoji: "🍺",
        name: "Alcohol",
        reason: "Disrupts estrogen metabolism in the liver right when your body needs it most to build up for ovulation.",
      },
      {
        emoji: "🍟",
        name: "Fried & High-Fat Foods",
        reason: "Trans fats interfere with hormone signalling and worsen PCOS-related insulin resistance.",
      },
    ],
  },
  Ovulation: {
    favour: [
      {
        emoji: "🍅",
        name: "Tomatoes & Lycopene-rich Foods",
        reason: "Lycopene is a powerful antioxidant that protects eggs from oxidative stress during ovulation.",
      },
      {
        emoji: "🥗",
        name: "Raw Salads & Fibre-rich Veg",
        reason: "Fibre binds excess estrogen in the gut and removes it — prevents estrogen dominance common in PCOS.",
      },
      {
        emoji: "🌰",
        name: "Pumpkin Seeds",
        reason: "High in zinc which is critical for ovulation and egg quality. Also boosts progesterone production.",
      },
      {
        emoji: "🍋",
        name: "Vitamin C foods (Citrus, Peppers)",
        reason: "Supports the corpus luteum after ovulation and improves iron absorption from plant sources.",
      },
    ],
    avoid: [
      {
        emoji: "🥩",
        name: "Red & Processed Meat",
        reason: "High saturated fat linked to poorer egg quality and increased inflammation during ovulation.",
      },
      {
        emoji: "🥛",
        name: "Full-fat Dairy",
        reason: "Can trigger excess androgen production — already elevated in PCOS — which may interfere with ovulation.",
      },
    ],
  },
  Luteal: {
    favour: [
      {
        emoji: "🍌",
        name: "Bananas",
        reason: "High in vitamin B6 which supports progesterone production and reduces PMS mood symptoms.",
      },
      {
        emoji: "🎃",
        name: "Pumpkin Seeds & Sunflower Seeds",
        reason: "Magnesium-rich and help with PMS bloating, cramps, and the notorious luteal phase chocolate cravings.",
      },
      {
        emoji: "🍠",
        name: "Sweet Potato & Complex Carbs",
        reason: "Stabilise blood sugar during the phase when cravings peak. Prevents the crash-binge cycle common in PCOS.",
      },
      {
        emoji: "🫖",
        name: "Chamomile & Herbal Tea",
        reason: "Reduces anxiety, improves sleep quality, and has mild anti-spasmodic effects for pre-period cramps.",
      },
      {
        emoji: "🥑",
        name: "Avocado",
        reason: "Healthy fats support progesterone synthesis and the fat-soluble vitamins (D, E, K) needed in this phase.",
      },
    ],
    avoid: [
      {
        emoji: "🧃",
        name: "Sugary Drinks & Juice",
        reason: "Causes rapid blood sugar spikes that worsen luteal phase mood swings, fatigue, and cravings.",
      },
      {
        emoji: "☕",
        name: "Excess Caffeine",
        reason: "Raises cortisol which depletes progesterone — worsening PMS, anxiety, and sleep issues in this phase.",
      },
      {
        emoji: "🍺",
        name: "Alcohol",
        reason: "Disrupts sleep (already fragmented in luteal phase) and increases estrogen while depleting magnesium.",
      },
    ],
  },
};

// ── Symptom-based food tips ───────────────────────────────────────────────────
type SymptomTip = { label: string; tip: string };

function getSymptomFoodTip(recentSymptoms: string[]): SymptomTip | null {
  if (recentSymptoms.includes("Bloating"))
    return {
      label: "bloating",
      tip: "Avoid cruciferous vegetables raw (cook them instead), reduce sodium, and try peppermint tea. Fennel seeds after meals also reduce bloating significantly.",
    };
  if (recentSymptoms.includes("Acne"))
    return {
      label: "acne",
      tip: "Reduce dairy and high-glycaemic foods which spike androgens and worsen PCOS acne. Increase zinc (pumpkin seeds, legumes) and omega-3 rich foods.",
    };
  if (recentSymptoms.includes("Fatigue"))
    return {
      label: "fatigue",
      tip: "Prioritise iron + B12 (eggs, lentils, spinach) and pair with vitamin C for better absorption. Eat small frequent meals to prevent energy crashes.",
    };
  if (recentSymptoms.includes("Cramps"))
    return {
      label: "cramps",
      tip: "Increase magnesium (dark chocolate, seeds, leafy greens) and omega-3 (salmon, flaxseed). Avoid caffeine and alcohol which constrict blood vessels and worsen pain.",
    };
  if (recentSymptoms.includes("Mood Swings"))
    return {
      label: "mood swings",
      tip: "Stabilise blood sugar with complex carbs + protein at every meal. B6 (bananas, chickpeas) and magnesium are natural mood stabilisers.",
    };
  if (recentSymptoms.includes("Spotting"))
    return {
      label: "spotting",
      tip: "Ensure adequate vitamin K (leafy greens) and avoid blood-thinning foods like ginger in excess. Stay well hydrated.",
    };
  return null;
}

// ── Screen ─────────────────────────────────────────────────────────────────────
export default function FoodDietScreen() {
  const router = useRouter();
  const { livePhase, liveCycleDay, recentSymptoms } = useUser();

  const foods = PHASE_FOODS[livePhase];
  const symptomTip = getSymptomFoodTip(recentSymptoms);

  return (
    <View style={{ flex: 1, backgroundColor: "#F7C5CC" }}>
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingTop: 56, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Back + title */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 20 }}
        >
          <Text style={{ color: "#C0162C", fontSize: 20 }}>←</Text>
          <Text style={{ color: "#C0162C", fontSize: 17, fontWeight: "700" }}>Food & Diet</Text>
        </TouchableOpacity>

        {/* Phase banner */}
        <PhaseFoodBanner phase={livePhase} cycleDay={liveCycleDay} />

        {/* Symptom-based tip */}
        <SymptomFoodTip
          tip={symptomTip?.tip ?? null}
          symptomLabel={symptomTip?.label ?? null}
        />

        {/* Foods to favour */}
        <Text style={{ color: "#15803D", fontSize: 15, fontWeight: "800", marginBottom: 12 }}>
          ✓ Foods to Favour
        </Text>
        {foods.favour.map((item) => (
          <FoodCard key={item.name} item={item} type="favour" />
        ))}

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: "#F2D0D5", marginVertical: 16 }} />

        {/* Foods to avoid */}
        <Text style={{ color: "#C0162C", fontSize: 15, fontWeight: "800", marginBottom: 12 }}>
          ✕ Foods to Avoid
        </Text>
        {foods.avoid.map((item) => (
          <FoodCard key={item.name} item={item} type="avoid" />
        ))}

        {/* Footer note */}
        <View
          style={{
            marginTop: 16,
            backgroundColor: "#fff",
            borderRadius: 14,
            padding: 14,
            borderWidth: 1,
            borderColor: "#F2D0D5",
          }}
        >
          <Text style={{ color: "#B08890", fontSize: 11, lineHeight: 18, textAlign: "center" }}>
            These recommendations are based on your current cycle phase and recent symptom logs.
            Always consult a healthcare provider for personalised medical nutrition advice.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
