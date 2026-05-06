import type {
    CyclePhase,
    PeriodEntry,
    SymptomLogEntry,
} from "@/context/UserContext";
import type { CycleSnapshot } from "@/services/cycleService";
import { fromDateKey } from "@/services/dateService";

export type AIContext = {
  phase: CyclePhase | null;
  cycleDay: number | null;
  totalCycleDays: number;
  periodLengthDays: number | null;
  cycleRegularity: "Regular" | "Irregular" | null;
  flowIntensity: "Light" | "Medium" | "Heavy" | null;
  nextPeriodWindow: CycleSnapshot["nextPeriodWindow"] | null;
  recentSymptoms: string[];
  symptomLogs: SymptomLogEntry[];
  periodEntries: PeriodEntry[];
};

export type FoodSuggestion = {
  emoji: string;
  name: string;
  reason: string;
};

export type WorkoutSuggestion = {
  id: string;
  name: string;
  duration: string;
  intensity: "Low" | "Medium" | "High";
  emoji: string;
  why: string;
  steps: string[];
};

export type DietGuidance = {
  hasEnoughData: boolean;
  summary: string;
  foodsToFavor: FoodSuggestion[];
  foodsToAvoid: FoodSuggestion[];
  symptomNote: string | null;
};

export type WorkoutGuidance = {
  hasEnoughData: boolean;
  summary: string;
  workouts: WorkoutSuggestion[];
  symptomNote: string | null;
};

export type AssistantGuidance = {
  hasEnoughData: boolean;
  response: string;
};

const FOOD_GUIDANCE: Record<
  CyclePhase,
  { favour: FoodSuggestion[]; avoid: FoodSuggestion[]; summary: string }
> = {
  Menstrual: {
    favour: [
      {
        emoji: "🥬",
        name: "Spinach & Dark Leafy Greens",
        reason:
          "Rich in iron to replenish what's lost during bleeding. Also high in magnesium which eases cramps.",
      },
      {
        emoji: "🫘",
        name: "Lentils & Legumes",
        reason:
          "Plant-based iron source. Combined with vitamin C foods, absorption improves. Also keeps blood sugar steadier.",
      },
      {
        emoji: "🫚",
        name: "Ginger & Turmeric",
        reason:
          "Anti-inflammatory support that can help calm cramps and reduce that heavy, achy feeling.",
      },
      {
        emoji: "🐟",
        name: "Salmon & Fatty Fish",
        reason:
          "Omega-3s support inflammation balance and can feel especially supportive when cramps are stronger.",
      },
    ],
    avoid: [
      {
        emoji: "☕",
        name: "Coffee & Caffeine",
        reason:
          "Can make cramps feel sharper and may worsen the low, tense feeling some people notice during bleeding.",
      },
      {
        emoji: "🧂",
        name: "Salty & Processed Foods",
        reason:
          "Often add bloating and water retention when your body already feels tender.",
      },
      {
        emoji: "🍬",
        name: "Refined Sugar",
        reason:
          "Can swing energy and mood when you need things to feel calm and steady.",
      },
    ],
    summary:
      "This phase usually asks for warmth, iron, and meals that feel steady rather than heavy.",
  },
  Follicular: {
    favour: [
      {
        emoji: "🥚",
        name: "Eggs",
        reason:
          "A simple protein source that supports rising energy and steadier meals.",
      },
      {
        emoji: "🥦",
        name: "Broccoli & Cruciferous Veg",
        reason:
          "Helpful for a lighter, fresher eating pattern as energy starts climbing.",
      },
      {
        emoji: "🫙",
        name: "Fermented Foods",
        reason:
          "Good for gut support, which can make the rest of your routine feel more settled.",
      },
      {
        emoji: "🫐",
        name: "Berries",
        reason:
          "Bright, low-glycaemic foods that fit well when your appetite and energy are building.",
      },
    ],
    avoid: [
      {
        emoji: "🍺",
        name: "Alcohol",
        reason:
          "Can make energy and recovery feel less stable right when your body is rebuilding momentum.",
      },
      {
        emoji: "🍟",
        name: "Fried & High-Fat Foods",
        reason:
          "May feel heavy when your body is moving into a more active phase.",
      },
    ],
    summary:
      "This is usually a good window for lighter, fresher meals that support rising energy.",
  },
  Ovulation: {
    favour: [
      {
        emoji: "🍅",
        name: "Tomatoes & Lycopene-rich Foods",
        reason:
          "A supportive choice when your body is in a peak window and needs antioxidant coverage.",
      },
      {
        emoji: "🥗",
        name: "Raw Salads & Fibre-rich Veg",
        reason:
          "Can help keep meals light and balanced when your cycle is at its most active point.",
      },
      {
        emoji: "🌰",
        name: "Pumpkin Seeds",
        reason:
          "Easy to add for a little mineral support without making meals complicated.",
      },
      {
        emoji: "🍋",
        name: "Vitamin C Foods",
        reason:
          "Pairing these with meals helps keep the overall plate feeling bright and supportive.",
      },
    ],
    avoid: [
      {
        emoji: "🥩",
        name: "Red & Processed Meat",
        reason:
          "Can feel heavy when a lighter, more balanced meal pattern would serve you better.",
      },
      {
        emoji: "🥛",
        name: "Full-fat Dairy",
        reason:
          "If this is a trigger for you, this phase is a good time to keep meals simpler and observe patterns.",
      },
    ],
    summary:
      "This phase works best with lighter, balanced meals that keep your energy feeling clear.",
  },
  Luteal: {
    favour: [
      {
        emoji: "🍌",
        name: "Bananas",
        reason:
          "A calm, easy snack when cravings and mood shifts start to show up more strongly.",
      },
      {
        emoji: "🎃",
        name: "Pumpkin Seeds & Sunflower Seeds",
        reason:
          "Handy for magnesium support and a more grounded snack pattern.",
      },
      {
        emoji: "🍠",
        name: "Sweet Potato & Complex Carbs",
        reason:
          "These can help keep blood sugar from swinging too sharply when appetite is less predictable.",
      },
      {
        emoji: "🫖",
        name: "Chamomile & Herbal Tea",
        reason:
          "A gentle way to soften the evening wind-down and support a calmer routine.",
      },
      {
        emoji: "🥑",
        name: "Avocado",
        reason: "A steady, filling food that helps meals feel more anchored.",
      },
    ],
    avoid: [
      {
        emoji: "🧃",
        name: "Sugary Drinks & Juice",
        reason:
          "Can make cravings and energy dips feel more chaotic than they already do.",
      },
      {
        emoji: "☕",
        name: "Excess Caffeine",
        reason:
          "If you’re already feeling keyed up, this can make the edge sharper.",
      },
      {
        emoji: "🍺",
        name: "Alcohol",
        reason:
          "Usually works against rest and recovery when the body is asking for more calm.",
      },
    ],
    summary:
      "This phase usually responds well to grounding meals, slower pacing, and fewer blood sugar swings.",
  },
};

const WORKOUT_GUIDANCE: Record<
  CyclePhase,
  { workouts: WorkoutSuggestion[]; summary: string }
> = {
  Menstrual: {
    workouts: [
      {
        id: "m1",
        name: "Restorative Yoga",
        duration: "20 min",
        intensity: "Low",
        emoji: "🧘",
        why: "Gentle movement can help cramps and fatigue feel more manageable without asking too much from your body.",
        steps: [
          "Child's pose for a few minutes",
          "Supine twists on each side",
          "Cat-cow to ease lower-back tightness",
          "Legs-up-the-wall to finish calmly",
        ],
      },
      {
        id: "m2",
        name: "Gentle Walking",
        duration: "25 min",
        intensity: "Low",
        emoji: "🚶",
        why: "Light walking supports circulation and can feel easier on low-energy days.",
        steps: [
          "Walk at a comfortable pace",
          "Keep the route flat if possible",
          "Breathe slowly through the walk",
        ],
      },
      {
        id: "m3",
        name: "Breathing & Stretching",
        duration: "15 min",
        intensity: "Low",
        emoji: "🌬️",
        why: "A calm option when your body wants care more than intensity.",
        steps: [
          "Slow 4-7-8 breathing",
          "Seated forward fold",
          "Butterfly stretch",
        ],
      },
    ],
    summary: "This phase usually calls for gentler movement and a softer pace.",
  },
  Follicular: {
    workouts: [
      {
        id: "f1",
        name: "Light Strength Training",
        duration: "30 min",
        intensity: "Medium",
        emoji: "💪",
        why: "A good middle-ground when energy is rising and your body is often more ready to build.",
        steps: [
          "Warm up with easy cardio",
          "Bodyweight squats",
          "Push-ups or modified push-ups",
          "Glute bridges",
        ],
      },
      {
        id: "f2",
        name: "Brisk Walking / Light Jog",
        duration: "30 min",
        intensity: "Medium",
        emoji: "🏃",
        why: "Helpful when you want movement that feels energising without going all-out.",
        steps: [
          "Easy walk warm-up",
          "Alternate brisk walking and light jogging",
          "Cool down and stretch",
        ],
      },
      {
        id: "f3",
        name: "Dance Cardio",
        duration: "25 min",
        intensity: "Medium",
        emoji: "💃",
        why: "A lighter cardio option that feels upbeat and less rigid.",
        steps: [
          "Pick a playlist you actually enjoy",
          "Move continuously for a short block",
          "Cool down with slower movement",
        ],
      },
    ],
    summary:
      "This phase is often better for building momentum and trying moderate movement.",
  },
  Ovulation: {
    workouts: [
      {
        id: "o1",
        name: "HIIT Circuit",
        duration: "25 min",
        intensity: "High",
        emoji: "🔥",
        why: "If you feel strong and symptom-free, this can be a peak-energy window.",
        steps: [
          "Warm up well first",
          "Short circuit with bodyweight moves",
          "Rest between rounds",
          "Cool down thoroughly",
        ],
      },
      {
        id: "o2",
        name: "Cycling or Spinning",
        duration: "35 min",
        intensity: "High",
        emoji: "🚴",
        why: "A stronger cardio option if your body is responding well today.",
        steps: [
          "Warm up at an easy pace",
          "Build intensity gradually",
          "Use intervals if that feels good",
        ],
      },
      {
        id: "o3",
        name: "Heavy Strength Session",
        duration: "40 min",
        intensity: "High",
        emoji: "🏋️",
        why: "A good option when you want a challenging session and feel steady.",
        steps: [
          "Dynamic mobility warm-up",
          "Main compound lifts",
          "Core finisher",
          "Extended cool-down",
        ],
      },
    ],
    summary:
      "This is the most energetic window for many people, so stronger workouts can fit well here.",
  },
  Luteal: {
    workouts: [
      {
        id: "l1",
        name: "Pilates Core",
        duration: "25 min",
        intensity: "Low",
        emoji: "🌀",
        why: "Good when you want to keep moving without pushing too hard.",
        steps: [
          "Hundred breathing exercise",
          "Single leg stretch",
          "Side-lying leg lifts",
          "Roll-up cool down",
        ],
      },
      {
        id: "l2",
        name: "Slow Flow Yoga",
        duration: "30 min",
        intensity: "Low",
        emoji: "🧘",
        why: "Helps the body settle when energy starts to taper off.",
        steps: [
          "Slow sun salutations",
          "Warrior holds",
          "Forward folds and twists",
          "Long savasana",
        ],
      },
      {
        id: "l3",
        name: "Swimming",
        duration: "30 min",
        intensity: "Medium",
        emoji: "🏊",
        why: "Water can feel kinder when bloating or heaviness show up.",
        steps: [
          "Easy warm-up laps",
          "Steady moderate swimming",
          "Gentle cool-down in water",
        ],
      },
    ],
    summary:
      "This phase usually benefits from lower-impact movement and less pressure to perform.",
  },
};

const BASELINE_FOOD_GUIDANCE = {
  favour: [
    {
      emoji: "🥗",
      name: "Leafy Greens & Veggies",
      reason:
        "A great baseline for balancing blood sugar and reducing overall inflammation.",
    },
    {
      emoji: "🍗",
      name: "Lean Proteins",
      reason: "Helps maintain steady energy levels throughout the day.",
    },
    {
      emoji: "🥑",
      name: "Healthy Fats",
      reason: "Essential for hormone production and a satisfied gut.",
    },
    {
      emoji: "🚰",
      name: "Water & Hydration",
      reason: "Keeps energy up and supports overall body processes.",
    },
  ],
  avoid: [
    {
      emoji: "🍬",
      name: "Refined Sugar",
      reason: "Can lead to sudden energy crashes and mood swings.",
    },
    {
      emoji: "🧂",
      name: "Highly Processed Foods",
      reason: "Often lack the nutrients needed for steady daily support.",
    },
  ],
};

const BASELINE_WORKOUT_GUIDANCE = {
  workouts: [
    {
      id: "b1",
      name: "Gentle Walking",
      duration: "20 min",
      intensity: "Low",
      emoji: "🚶",
      why: "A great universal way to keep moving and clear your head without stress.",
      steps: [
        "Find a comfortable pace",
        "Focus on steady breathing",
        "Keep it relaxed",
      ],
    },
    {
      id: "b2",
      name: "Beginner Yoga Floor Flow",
      duration: "15 min",
      intensity: "Low",
      emoji: "🧘",
      why: "Helps release tension and connect with your body.",
      steps: ["Child's pose", "Gentle cat-cow", "Downward dog if comfortable"],
    },
    {
      id: "b3",
      name: "Mobility & Stretching",
      duration: "10 min",
      intensity: "Low",
      emoji: "🤸",
      why: "Keeps joints feeling open and reduces general stiffness.",
      steps: ["Shoulder rolls", "Torso twists", "Hip circles"],
    },
  ] as WorkoutSuggestion[],
};

const SYMPTOM_NOTE_MAP: Record<string, string> = {
  Bloating:
    "You’ve logged bloating, so I’m favouring gentler movement and foods that feel lighter on the gut.",
  Acne: "You’ve logged acne, so I’m keeping suggestions steady and avoiding anything that usually spikes your skin triggers.",
  Fatigue:
    "You’ve logged fatigue, so I’m keeping the guidance softer and avoiding overly demanding workouts.",
  Cramps:
    "You’ve logged cramps, so I’m prioritising comfort, warmth, and lower-impact options.",
  "Mood Swings":
    "You’ve logged mood swings, so I’m leaning toward steadier meals and calmer movement.",
  Spotting:
    "You’ve logged spotting, so I’m keeping the guidance gentle and focused on support rather than intensity.",
  Headache:
    "You’ve logged headaches, so I’m avoiding anything too intense or overstimulating.",
};

function formatDateKeyLabel(dateKey: string | null) {
  if (!dateKey) return null;
  const date = fromDateKey(dateKey);
  if (!date) return null;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function getRecurringSymptoms(symptomLogs: SymptomLogEntry[]) {
  const counts = new Map<string, number>();
  for (const log of symptomLogs) {
    for (const symptom of log.symptoms) {
      counts.set(symptom, (counts.get(symptom) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .filter(([, count]) => count >= 2)
    .map(([symptom]) => symptom);
}

function hasEnoughCycleData(
  context: AIContext,
): context is AIContext & { phase: CyclePhase; cycleDay: number } {
  return context.phase !== null && context.cycleDay !== null;
}

function buildSymptomNote(context: AIContext) {
  const directNote = context.recentSymptoms
    .map((symptom) => SYMPTOM_NOTE_MAP[symptom])
    .find(Boolean);

  if (directNote) return directNote;

  const recurringSymptoms = getRecurringSymptoms(context.symptomLogs);
  if (recurringSymptoms.length > 0) {
    return `You’ve logged ${recurringSymptoms[0].toLowerCase()} more than once, so I’m leaning into a more careful, supportive approach.`;
  }

  return null;
}

function buildProfileSupportSentence(context: AIContext) {
  const parts: string[] = [];

  if (context.cycleRegularity === "Irregular") {
    parts.push(
      "your cycle is marked irregular, so I’m keeping the timing guidance approximate",
    );
  }

  if (context.flowIntensity === "Heavy") {
    parts.push(
      "your flow is heavy, so I’m leaning more toward iron-supportive foods and lower-impact movement",
    );
  } else if (context.flowIntensity === "Light") {
    parts.push(
      "your flow is light, so I’m keeping the guidance balanced rather than overly focused on recovery",
    );
  }

  if (context.periodLengthDays !== null) {
    parts.push(`your logged period length is ${context.periodLengthDays} days`);
  }

  return parts.length > 0 ? `Because ${parts.join(", ")}.` : "";
}

export function buildAIContext({
  phase,
  cycleDay,
  totalCycleDays,
  periodLengthDays,
  cycleRegularity,
  flowIntensity,
  nextPeriodWindow,
  recentSymptoms,
  symptomLogs,
  periodEntries,
}: AIContext): AIContext {
  return {
    phase,
    cycleDay,
    totalCycleDays,
    periodLengthDays,
    cycleRegularity,
    flowIntensity,
    nextPeriodWindow,
    recentSymptoms,
    symptomLogs,
    periodEntries,
  };
}

export function getDietGuidance(context: AIContext): DietGuidance {
  const symptomNote = buildSymptomNote(context);

  if (!hasEnoughCycleData(context)) {
    return {
      hasEnoughData: false,
      summary:
        "Here’s a healthy starting point. Once your period start and a few symptoms are logged, I can make this much more personalized for you.",
      foodsToFavor: BASELINE_FOOD_GUIDANCE.favour,
      foodsToAvoid: BASELINE_FOOD_GUIDANCE.avoid,
      symptomNote,
    };
  }

  const phaseData = FOOD_GUIDANCE[context.phase];
  const nextPeriodLabel = context.nextPeriodWindow?.point
    ? formatDateKeyLabel(context.nextPeriodWindow.point)
    : null;
  const summaryParts = [
    phaseData.summary,
    buildProfileSupportSentence(context),
  ].filter(Boolean);

  if (nextPeriodLabel) {
    summaryParts.push(
      `Your next period is currently estimated around ${nextPeriodLabel}.`,
    );
  }

  return {
    hasEnoughData: true,
    summary: summaryParts.join(" "),
    foodsToFavor: phaseData.favour,
    foodsToAvoid: phaseData.avoid,
    symptomNote,
  };
}

export function getWorkoutGuidance(context: AIContext): WorkoutGuidance {
  const symptomNote = buildSymptomNote(context);

  if (!hasEnoughCycleData(context)) {
    return {
      hasEnoughData: false,
      summary:
        "Here are some universal, gentle ways to move. As you log your cycle data, I'll tailor the intensity and style specifically for you.",
      workouts: BASELINE_WORKOUT_GUIDANCE.workouts,
      symptomNote,
    };
  }

  const phaseData = WORKOUT_GUIDANCE[context.phase];
  const shouldAvoidHighIntensity =
    context.recentSymptoms.includes("Fatigue") ||
    context.recentSymptoms.includes("Headache") ||
    context.recentSymptoms.includes("Cramps");

  const workouts = shouldAvoidHighIntensity
    ? phaseData.workouts.filter(
        (workout: WorkoutSuggestion) => workout.intensity !== "High",
      )
    : phaseData.workouts;

  const summaryParts = [
    phaseData.summary,
    buildProfileSupportSentence(context),
  ].filter(Boolean);

  return {
    hasEnoughData: true,
    summary: summaryParts.join(" "),
    workouts,
    symptomNote,
  };
}

export function getAssistantGuidance(
  context: AIContext,
  userMessage: string,
): AssistantGuidance {
  const trimmed = userMessage.trim();
  const hasData = hasEnoughCycleData(context);

  if (!trimmed) {
    return {
      hasEnoughData: hasData,
      response: hasData
        ? "Ask me about your food, workouts, symptoms, or cycle timing, and I’ll keep it grounded in your current data."
        : "Ask me about food, workouts, or symptoms. While I don't have your cycle data yet, I can still offer some gentle, supportive guidance.",
    };
  }

  const lowered = trimmed.toLowerCase();
  const dietGuidance = getDietGuidance(context);
  const workoutGuidance = getWorkoutGuidance(context);

  const phaseText = hasData
    ? `${context.phase} phase, day ${context.cycleDay} of your cycle.`
    : "While I don't have your cycle data yet to personalise this,";

  if (
    lowered.includes("diet") ||
    lowered.includes("food") ||
    lowered.includes("eat")
  ) {
    const picks = dietGuidance.foodsToFavor
      .slice(0, 2)
      .map((item) => item.name)
      .join(" and ");
    return {
      hasEnoughData: true,
      response:
        `${phaseText} ${dietGuidance.summary} I’d keep meals anchored around ${picks}. ${dietGuidance.symptomNote ?? ""}`.trim(),
    };
  }

  if (
    lowered.includes("workout") ||
    lowered.includes("exercise") ||
    lowered.includes("move") ||
    lowered.includes("gym")
  ) {
    const picks = workoutGuidance.workouts
      .slice(0, 2)
      .map((item) => item.name)
      .join(" and ");
    return {
      hasEnoughData: true,
      response:
        `${phaseText} ${workoutGuidance.summary} Good options today are ${picks}. ${workoutGuidance.symptomNote ?? ""}`.trim(),
    };
  }

  if (
    lowered.includes("symptom") ||
    lowered.includes("pain") ||
    lowered.includes("bloating") ||
    lowered.includes("cramp")
  ) {
    return {
      hasEnoughData: true,
      response:
        `${phaseText} ${buildSymptomNote(context) ?? "I don’t see a strong symptom pattern logged yet, so I’m staying careful and general."} ${dietGuidance.summary}`.trim(),
    };
  }

  return {
    hasEnoughData: true,
    response:
      `${phaseText} ${dietGuidance.summary} On the movement side, ${workoutGuidance.summary.toLowerCase()} ${dietGuidance.symptomNote ?? workoutGuidance.symptomNote ?? ""}`.trim(),
  };
}

function getGeminiApiKey() {
  return typeof process !== "undefined"
    ? (process.env.EXPO_PUBLIC_GEMINI_API_KEY?.trim() ?? "")
    : "";
}

function getGeminiModel() {
  return typeof process !== "undefined"
    ? process.env.EXPO_PUBLIC_GEMINI_MODEL?.trim() || "gemini-1.5-flash"
    : "gemini-1.5-flash";
}

function getRecurringSymptomPatterns(symptomLogs: SymptomLogEntry[]) {
  const counts = new Map<string, number>();
  for (const log of symptomLogs) {
    for (const symptom of log.symptoms) {
      counts.set(symptom, (counts.get(symptom) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .filter(([, count]) => count >= 2)
    .map(([symptom, count]) => `${symptom} (${count} logs)`);
}

function buildAssistantPrompt(context: AIContext, userMessage: string) {
  const recurringSymptoms = getRecurringSymptomPatterns(context.symptomLogs);
  const symptomHistory = context.symptomLogs
    .slice(-6)
    .map((log) => `${log.dateKey}: ${log.symptoms.join(", ") || "No symptoms"}`)
    .join("; ");

  const profileHints = [
    context.cycleRegularity
      ? `cycle regularity: ${context.cycleRegularity}`
      : null,
    context.flowIntensity ? `flow intensity: ${context.flowIntensity}` : null,
    context.periodLengthDays !== null
      ? `period length: ${context.periodLengthDays} days`
      : null,
    context.nextPeriodWindow?.point
      ? `next period estimate: ${context.nextPeriodWindow.point}`
      : null,
  ]
    .filter(Boolean)
    .join("; ");

  const contextSummary = [
    `Current phase: ${context.phase ?? "not tracked yet"}`,
    `Cycle day: ${context.cycleDay ?? "not tracked yet"}`,
    `Total cycle days: ${context.totalCycleDays}`,
    `Recent symptoms: ${context.recentSymptoms.length ? context.recentSymptoms.join(", ") : "none logged yet"}`,
    `Recurring patterns: ${recurringSymptoms.length ? recurringSymptoms.join(", ") : "none yet"}`,
    `Symptom history: ${symptomHistory || "none"}`,
    profileHints
      ? `Profile details: ${profileHints}`
      : "Profile: not yet detailed",
  ].join("\n");

  return [
    `User says: "${userMessage}"`,
    "",
    "Person's cycle & health context:",
    contextSummary,
  ].join("\n");
}

function extractGeminiText(payload: unknown) {
  const response = payload as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  return (
    response.candidates
      ?.flatMap((candidate) => candidate.content?.parts ?? [])
      .map((part) => part.text ?? "")
      .join(" ")
      .trim() || null
  );
}

async function generateGeminiAssistantResponse(
  context: AIContext,
  userMessage: string,
) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${getGeminiModel()}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const prompt = buildAssistantPrompt(context, userMessage);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [
          {
            text: `You are a warm, nurturing, and deeply compassionate health companion for someone navigating PCOS and period health.

Your tone is always:
- Soft and gentle, never clinical or robotic
- Warm and understanding, validating their experience
- Practical yet encouraging
- Conversational, like a caring friend
- Non-judgmental and supportive

When responding:
1. Feel the human behind the question — respond with empathy first
2. Use the provided cycle and symptom context to personalize your answer
3. Keep responses 2-4 sentences max — concise and digestible
4. If data is limited, acknowledge that gently and offer what help you can
5. Suggest logging more data naturally, without pressure
6. Never use bullet points or lists — write naturally
7. Use gentle, inclusive language ("your body," "we can work with this," etc.)
8. If you mention food or movement, keep it light and suggest 1-2 ideas max
9. Never make medical claims — stay supportive and practical
10. Embody calm presence. You're here to support, not to solve everything.`,
          },
        ],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.6,
        topP: 0.85,
        topK: 40,
        maxOutputTokens: 200,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini request failed with ${response.status}`);
  }

  const data = (await response.json()) as unknown;
  return extractGeminiText(data);
}

export async function generateAssistantResponse(
  context: AIContext,
  userMessage: string,
): Promise<AssistantGuidance> {
  const trimmed = userMessage.trim();

  if (!trimmed) {
    return getAssistantGuidance(context, userMessage);
  }

  try {
    const aiText = await generateGeminiAssistantResponse(context, trimmed);
    if (aiText) {
      return {
        hasEnoughData: hasEnoughCycleData(context),
        response: aiText,
      };
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    // Only fall back to preset if Gemini truly fails
  }

  // Fallback only if Gemini fails
  return getAssistantGuidance(context, userMessage);
}
