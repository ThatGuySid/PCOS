import PhaseWorkoutBanner from "@/components/workout/PhaseWorkoutBanner";
import SymptomWorkoutNote from "@/components/workout/SymptomWorkoutNote";
import WorkoutCard, { Workout } from "@/components/workout/WorkoutCard";
import { CyclePhase, useUser } from "@/context/UserContext";
import { buildAIContext, getWorkoutGuidance } from "@/services/aiservice";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const PHASE_WORKOUTS: Record<CyclePhase, Workout[]> = {
  Menstrual: [
    {
      id: "m1",
      name: "Restorative Yoga",
      duration: "20 min",
      intensity: "Low",
      emoji: "🧘",
      why: "During menstruation, estrogen and progesterone are at their lowest. Gentle yoga reduces cramps and supports blood flow without taxing your body.",
      steps: [
        "Start in child's pose for 3 minutes — breathe deeply into your lower back",
        "Move to supine twist (each side 2 min) to release lower back tension",
        "Cat-cow stretch for 5 minutes to ease cramps",
        "Legs-up-the-wall pose for 5 minutes to reduce fatigue",
        "End in savasana for 5 minutes",
      ],
    },
    {
      id: "m2",
      name: "Gentle Walking",
      duration: "25 min",
      intensity: "Low",
      emoji: "🚶",
      why: "Light walking maintains circulation and releases endorphins to naturally reduce period pain without overexerting during a low-energy phase.",
      steps: [
        "Walk at a comfortable, slow pace — no pushing",
        "Focus on deep belly breathing as you walk",
        "Keep to flat terrain, avoid hills today",
        "Finish with a gentle standing stretch",
      ],
    },
    {
      id: "m3",
      name: "Breathing & Stretching",
      duration: "15 min",
      intensity: "Low",
      emoji: "🌬️",
      why: "Diaphragmatic breathing activates the parasympathetic nervous system, reducing cramps and managing PCOS-related anxiety during your period.",
      steps: [
        "4-7-8 breathing: inhale 4s, hold 7s, exhale 8s — repeat 5 times",
        "Seated forward fold to stretch hamstrings and lower back",
        "Butterfly stretch 3 min to open the hips",
        "Neck and shoulder rolls to release tension",
      ],
    },
  ],
  Follicular: [
    {
      id: "f1",
      name: "Light Strength Training",
      duration: "30 min",
      intensity: "Medium",
      emoji: "💪",
      why: "Rising estrogen during the follicular phase improves muscle recovery — perfect for building strength progressively.",
      steps: [
        "Warm up: 5 min light cardio (marching in place)",
        "Bodyweight squats: 3 sets × 12 reps",
        "Push-ups (modified if needed): 3 sets × 10 reps",
        "Glute bridges: 3 sets × 15 reps",
        "Plank hold: 3 × 30 seconds",
        "Cool down with hip flexor stretch",
      ],
    },
    {
      id: "f2",
      name: "Brisk Walking / Light Jog",
      duration: "30 min",
      intensity: "Medium",
      emoji: "🏃",
      why: "Your energy is climbing now. A mix of walking and light jogging builds cardiovascular endurance while estrogen boosts mood and motivation.",
      steps: [
        "5 min easy warm-up walk",
        "Alternate: 2 min brisk walk, 1 min light jog — repeat 6 times",
        "5 min cool-down walk",
        "Calf and quad stretches",
      ],
    },
    {
      id: "f3",
      name: "Dance Cardio",
      duration: "25 min",
      intensity: "Medium",
      emoji: "💃",
      why: "The follicular phase boosts creativity and mood. Dance improves insulin sensitivity — important for PCOS management.",
      steps: [
        "Choose your favourite upbeat playlist",
        "5 min freestyle warm-up movement",
        "15 min of continuous dance — keep moving!",
        "5 min cool-down slow movement",
      ],
    },
  ],
  Ovulation: [
    {
      id: "o1",
      name: "HIIT Circuit",
      duration: "25 min",
      intensity: "High",
      emoji: "🔥",
      why: "Ovulation is your peak performance window — testosterone and estrogen are both high, maximising strength and speed. Go hard today!",
      steps: [
        "Warm up: 3 min jumping jacks",
        "Circuit (×4): 30s jump squats → 30s push-ups → 30s mountain climbers → 30s rest",
        "Burpees: 3 × 10 reps",
        "Cool down: 5 min stretching",
      ],
    },
    {
      id: "o2",
      name: "Cycling or Spinning",
      duration: "35 min",
      intensity: "High",
      emoji: "🚴",
      why: "High-intensity cardio at ovulation leverages peak estrogen to improve fat burning — especially beneficial for PCOS insulin management.",
      steps: [
        "5 min easy warm-up spin",
        "10 min moderate pace building intensity",
        "15 min high-intensity intervals (1 min hard, 1 min easy)",
        "5 min cool-down",
      ],
    },
    {
      id: "o3",
      name: "Heavy Strength Session",
      duration: "40 min",
      intensity: "High",
      emoji: "🏋️",
      why: "This is your strongest phase. Higher testosterone means better muscle recruitment — ideal for progressive overload that helps PCOS long-term.",
      steps: [
        "Warm up: dynamic stretches and mobility",
        "Romanian deadlifts: 4 × 8 reps",
        "Weighted squats: 4 × 8 reps",
        "Dumbbell rows: 3 × 10 each side",
        "Shoulder press: 3 × 10 reps",
        "Core finisher: 3 × 20 bicycle crunches",
      ],
    },
  ],
  Luteal: [
    {
      id: "l1",
      name: "Pilates Core",
      duration: "25 min",
      intensity: "Low",
      emoji: "🌀",
      why: "Progesterone dominates the luteal phase, causing fatigue. Pilates builds core strength without hormonal stress of intense cardio.",
      steps: [
        "Hundred breathing exercise: 5 sets",
        "Single leg stretch: 10 each side",
        "Double leg stretch: 10 reps",
        "Side-lying leg lifts: 15 each side",
        "Swimming exercise: 3 × 30 seconds",
        "Roll-up cool down",
      ],
    },
    {
      id: "l2",
      name: "Slow Flow Yoga",
      duration: "30 min",
      intensity: "Low",
      emoji: "🧘",
      why: "Slow yoga reduces PMS symptoms, cortisol, and anxiety that spikes in the luteal phase — intensified in PCOS.",
      steps: [
        "3 rounds of sun salutation A (slow, mindful)",
        "Warrior I and II holds: 1 min each side",
        "Seated forward fold: 3 min",
        "Supine spinal twist: 2 min each side",
        "Savasana: 5 min",
      ],
    },
    {
      id: "l3",
      name: "Swimming",
      duration: "30 min",
      intensity: "Medium",
      emoji: "🏊",
      why: "Water reduces bloating and joint pressure while still giving a full-body workout — ideal when luteal phase fatigue sets in.",
      steps: [
        "5 min easy warm-up laps or water walking",
        "20 min of moderate lap swimming",
        "5 min cool-down gentle stretching in water",
      ],
    },
  ],
};

function getSymptomNote(
  recentSymptoms: string[],
  phase: CyclePhase,
): string | null {
  const hasCramps = recentSymptoms.includes("Cramps");
  const hasFatigue = recentSymptoms.includes("Fatigue");
  const hasHeadache = recentSymptoms.includes("Headache");
  const hasBloating = recentSymptoms.includes("Bloating");

  if (hasCramps && (phase === "Ovulation" || phase === "Follicular"))
    return "You've logged cramps recently. We've kept today's workouts lighter — skip any high-intensity options and focus on the gentler ones.";
  if (hasFatigue && phase === "Ovulation")
    return "Fatigue logged recently. Even though it's your peak phase, listen to your body — medium intensity is fine today.";
  if (hasHeadache)
    return "You've had headaches recently. Avoid inverted poses and high-intensity movement. Opt for walking or gentle yoga today.";
  if (hasBloating && phase === "Luteal")
    return "Bloating is common in the luteal phase. Water-based exercise and pilates are especially helpful for reducing that feeling today.";
  return null;
}

function filterWorkouts(
  workouts: Workout[],
  recentSymptoms: string[],
): Workout[] {
  const shouldReduce =
    recentSymptoms.includes("Cramps") ||
    recentSymptoms.includes("Headache") ||
    recentSymptoms.includes("Fatigue");
  return shouldReduce
    ? workouts.filter((w) => w.intensity !== "High")
    : workouts;
}

export default function WorkoutScreen() {
  const router = useRouter();
  const { livePhase, liveCycleDay, user, recentSymptoms, cycleSnapshot } =
    useUser();

  const aiContext = useMemo(
    () =>
      buildAIContext({
        phase: livePhase,
        cycleDay: liveCycleDay,
        totalCycleDays: user.totalCycleDays,
        periodLengthDays: user.periodLengthDays,
        cycleRegularity: user.cycleRegularity,
        flowIntensity: user.flowIntensity,
        nextPeriodWindow: cycleSnapshot.nextPeriodWindow,
        recentSymptoms,
        symptomLogs: user.symptomLogs,
        periodEntries: user.periodEntries,
      }),
    [
      livePhase,
      liveCycleDay,
      user.totalCycleDays,
      user.periodLengthDays,
      user.cycleRegularity,
      user.flowIntensity,
      cycleSnapshot.nextPeriodWindow,
      recentSymptoms,
      user.symptomLogs,
      user.periodEntries,
    ],
  );

  const guidance = getWorkoutGuidance(aiContext);
  const hasData =
    guidance.hasEnoughData && livePhase !== null && liveCycleDay !== null;

  return (
    <View style={{ flex: 1, backgroundColor: "#F7C5CC" }}>
      <ScrollView
        contentContainerStyle={{
          padding: 24,
          paddingTop: 56,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 20,
          }}
        >
          <Text style={{ color: "#C0162C", fontSize: 20 }}>←</Text>
          <Text style={{ color: "#C0162C", fontSize: 17, fontWeight: "700" }}>
            Workout
          </Text>
        </TouchableOpacity>

        {hasData ? (
          <PhaseWorkoutBanner
            phase={livePhase}
            cycleDay={liveCycleDay}
            totalCycleDays={user.totalCycleDays}
          />
        ) : (
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 18,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: "#F2D0D5",
            }}
          >
            <Text
              style={{
                color: "#3A1A20",
                fontSize: 15,
                fontWeight: "800",
                marginBottom: 6,
              }}
            >
              Balanced baseline workout guidance
            </Text>
            <Text style={{ color: "#8C5F66", fontSize: 13, lineHeight: 20 }}>
              {guidance.summary}
            </Text>
          </View>
        )}

        <SymptomWorkoutNote note={guidance.symptomNote} />

        <Text
          style={{
            color: "#3A1A20",
            fontSize: 15,
            fontWeight: "700",
            marginBottom: 12,
          }}
        >
          Today's Recommended Workouts
        </Text>

        {guidance.workouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}

        {guidance.workouts.length === 0 && (
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 20,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 32, marginBottom: 8 }}>🛌</Text>
            <Text
              style={{
                color: "#C0162C",
                fontSize: 15,
                fontWeight: "700",
                marginBottom: 4,
              }}
            >
              Rest Day Recommended
            </Text>
            <Text
              style={{ color: "#8C5F66", fontSize: 13, textAlign: "center" }}
            >
              {guidance.summary}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
