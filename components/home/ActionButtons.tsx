import PeriodCalendar from "@/components/health/PeriodCalendar";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

type PredictionResult = {
  symptoms: string[];
  confidenceLabel: "High" | "Medium" | "Low";
};

const PREDICTION_MAP: Record<string, string[]> = {
  Cramps: [
    "cramp",
    "cramps",
    "abdomen pain",
    "lower belly pain",
    "pelvic pain",
  ],
  Bloating: ["bloat", "bloated", "gas", "swollen belly"],
  Headache: ["headache", "head pain", "migraine"],
  "Mood Swings": ["mood swing", "irritable", "irritated", "emotional", "angry"],
  Fatigue: ["fatigue", "tired", "low energy", "exhausted", "sleepy"],
  Acne: ["acne", "pimple", "breakout", "skin breakout"],
  Nausea: ["nausea", "nauseous", "queasy", "vomit"],
  Dizziness: ["dizzy", "dizziness", "lightheaded", "faint"],
  "Lower Back Pain": ["back pain", "lower back", "backache"],
  Anxiety: ["anxiety", "anxious", "panic"],
  Insomnia: ["insomnia", "can not sleep", "cant sleep", "sleepless"],
  "Food Cravings": ["craving", "cravings", "hungry", "sweet cravings"],
  Spotting: ["spotting", "spot", "light bleeding"],
  "Heavy Flow": ["heavy flow", "heavy bleeding", "soaking pad"],
};

const REMOVED_SYMPTOM = "Breast Tenderness";

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/\bi\s*am\b/g, "i am")
    .replace(/\bcan't\b/g, "cant")
    .replace(/\bcannot\b/g, "cant")
    .replace(/\bcan not\b/g, "cant")
    .replace(/\blight\s*headed\b/g, "lightheaded")
    .replace(/\bperiod\s*pain\b/g, "cramps")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshteinDistance(a: string, b: string) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) =>
      i === 0 ? j : j === 0 ? i : 0,
    ),
  );

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[a.length][b.length];
}

function isFuzzyTokenMatch(inputToken: string, keywordToken: string) {
  if (!inputToken || !keywordToken) return false;
  if (inputToken === keywordToken) return true;

  const maxDistance = keywordToken.length <= 5 ? 1 : 2;
  return levenshteinDistance(inputToken, keywordToken) <= maxDistance;
}

function keywordMatchesText(
  normalizedText: string,
  textTokens: string[],
  keyword: string,
) {
  if (!keyword) return false;

  const normalizedKeyword = normalizeText(keyword);
  if (!normalizedKeyword) return false;

  if (normalizedText.includes(normalizedKeyword)) {
    return true;
  }

  const keywordTokens = normalizedKeyword.split(" ").filter(Boolean);
  if (keywordTokens.length === 0) return false;

  return keywordTokens.every((keywordToken) =>
    textTokens.some((token) => isFuzzyTokenMatch(token, keywordToken)),
  );
}

function predictSymptomsFromText(input: string): PredictionResult {
  const normalized = normalizeText(input);

  if (!normalized) {
    return { symptoms: [], confidenceLabel: "Low" };
  }

  const textTokens = normalized.split(" ").filter(Boolean);

  const scoredMatches = Object.entries(PREDICTION_MAP)
    .map(([symptom, keywords]) => {
      let exactMatchCount = 0;
      let fuzzyMatchCount = 0;

      keywords.forEach((keyword) => {
        const normalizedKeyword = normalizeText(keyword);
        if (!normalizedKeyword) return;

        if (normalized.includes(normalizedKeyword)) {
          exactMatchCount += 1;
          return;
        }

        if (keywordMatchesText(normalized, textTokens, keyword)) {
          fuzzyMatchCount += 1;
        }
      });

      const score = exactMatchCount * 1 + fuzzyMatchCount * 0.55;

      return {
        symptom,
        exactMatchCount,
        fuzzyMatchCount,
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const predicted = scoredMatches.map((item) => item.symptom);

  const totalScore = scoredMatches.reduce((sum, item) => sum + item.score, 0);
  const strongSignals = scoredMatches.filter(
    (item) => item.exactMatchCount > 0 || item.score >= 1.2,
  ).length;

  const confidenceScore = Math.min(
    1,
    strongSignals * 0.35 +
      totalScore * 0.08 +
      Math.min(predicted.length, 4) * 0.06,
  );

  const confidenceLabel: PredictionResult["confidenceLabel"] =
    confidenceScore >= 0.75
      ? "High"
      : confidenceScore >= 0.45
        ? "Medium"
        : "Low";

  return { symptoms: predicted, confidenceLabel };
}

function buildPeriodRange(startDay: number | null, endDay: number | null) {
  if (startDay === null || endDay === null) return [];

  const low = Math.min(startDay, endDay);
  const high = Math.max(startDay, endDay);
  return Array.from({ length: high - low + 1 }, (_, idx) => low + idx);
}

export default function ActionButtons() {
  const { user, setUser } = useUser();
  const [openPanel, setOpenPanel] = useState<"period" | "symptoms" | null>(
    null,
  );
  const [symptomText, setSymptomText] = useState("");
  const [predictionMessage, setPredictionMessage] = useState("");
  const [periodMessage, setPeriodMessage] = useState("");
  const visibleSymptoms = user.symptoms.filter((s) => s !== REMOVED_SYMPTOM);

  useEffect(() => {
    if (!user.symptoms.includes(REMOVED_SYMPTOM)) return;
    setUser({ symptoms: user.symptoms.filter((s) => s !== REMOVED_SYMPTOM) });
  }, [setUser, user.symptoms]);

  const symptomOptions = [
    "Cramps",
    "Bloating",
    "Headache",
    "Mood Swings",
    "Fatigue",
    "Acne",
    "Nausea",
    "Dizziness",
    "Lower Back Pain",
    "Anxiety",
    "Insomnia",
    "Food Cravings",
    "Spotting",
    "Heavy Flow",
  ];

  const selectedDay = user.selectedPeriodDate?.getDate();
  const handleMarkPeriodStart = () => {
    if (selectedDay === undefined) return;

    const updatedDays = buildPeriodRange(selectedDay, user.periodEndDay);
    setUser({
      periodStartDay: selectedDay,
      periodDays: updatedDays,
    });
    setPeriodMessage(`Period start set to day ${selectedDay}.`);
  };

  const handleMarkPeriodEnd = () => {
    if (selectedDay === undefined) return;
    if (user.periodStartDay === null) {
      setPeriodMessage("Set period start first, then set period end.");
      return;
    }

    const updatedDays = buildPeriodRange(user.periodStartDay, selectedDay);
    setUser({
      periodEndDay: selectedDay,
      periodDays: updatedDays,
      periodLengthDays: updatedDays.length,
    });
    setPeriodMessage(`Period end set to day ${selectedDay}.`);
  };

  const handleMarkOvulation = () => {
    if (selectedDay === undefined) return;
    const isSameDay = user.ovulationDay === selectedDay;
    setUser({ ovulationDay: isSameDay ? null : selectedDay });
    setPeriodMessage(
      isSameDay
        ? "Ovulation marker removed."
        : `Ovulation marked for day ${selectedDay}.`,
    );
  };

  const toggleSymptom = (symptom: string) => {
    const existingSymptoms = user.symptoms.filter((s) => s !== REMOVED_SYMPTOM);
    const updatedSymptoms = existingSymptoms.includes(symptom)
      ? existingSymptoms.filter((s) => s !== symptom)
      : [...existingSymptoms, symptom];

    setUser({ symptoms: updatedSymptoms });
  };

  const handlePredictFromText = () => {
    const result = predictSymptomsFromText(symptomText);

    if (result.symptoms.length === 0) {
      setPredictionMessage(
        "Could not confidently detect symptoms yet. Please use chips for now.",
      );
      return;
    }

    const existingSymptoms = user.symptoms.filter((s) => s !== REMOVED_SYMPTOM);
    const merged = [...new Set([...existingSymptoms, ...result.symptoms])];
    setUser({ symptoms: merged });

    setPredictionMessage(
      `${result.confidenceLabel} confidence: detected ${result.symptoms.join(", ")}.`,
    );
  };

  return (
    <View>
      <View className="flex-row gap-3">
        {/* Log Period */}
        <TouchableOpacity
          onPress={() =>
            setOpenPanel((prev) => (prev === "period" ? null : "period"))
          }
          activeOpacity={0.85}
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            backgroundColor: "rgba(255,255,255,0.3)",
            borderRadius: 50,
            paddingVertical: 12,
          }}
        >
          <Text style={{ fontSize: 15 }}>🩸</Text>
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>
            Log Period
          </Text>
        </TouchableOpacity>

        {/* Symptoms */}
        <TouchableOpacity
          onPress={() =>
            setOpenPanel((prev) => (prev === "symptoms" ? null : "symptoms"))
          }
          activeOpacity={0.85}
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            backgroundColor: "rgba(255,255,255,0.3)",
            borderRadius: 50,
            paddingVertical: 12,
          }}
        >
          <Text style={{ fontSize: 15 }}>📋</Text>
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>
            Symptoms
          </Text>
        </TouchableOpacity>
      </View>

      {openPanel === "period" && (
        <View style={{ marginTop: 10 }}>
          <View
            style={{
              alignSelf: "flex-start",
              marginLeft: 14,
              width: 0,
              height: 0,
              borderLeftWidth: 10,
              borderRightWidth: 10,
              borderBottomWidth: 12,
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderBottomColor: "#FFFFFF",
            }}
          />

          <PeriodCalendar
            selectedDate={user.selectedPeriodDate}
            onSelectDate={(date) => setUser({ selectedPeriodDate: date })}
            periodDays={user.periodDays}
            periodStartDay={user.periodStartDay}
            periodEndDay={user.periodEndDay}
            ovulationDay={user.ovulationDay}
            compact
          />

          <View
            style={{
              marginTop: 8,
              flexDirection: "row",
              gap: 8,
              flexWrap: "nowrap",
            }}
          >
            <TouchableOpacity
              onPress={handleMarkPeriodStart}
              activeOpacity={0.85}
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: 50,
                paddingVertical: 9,
                paddingHorizontal: 6,
                borderWidth: 1,
                borderColor: "#F2D0D5",
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "#C0162C", fontSize: 11, fontWeight: "700" }}
              >
                Mark Start
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleMarkPeriodEnd}
              activeOpacity={0.85}
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: 50,
                paddingVertical: 9,
                paddingHorizontal: 6,
                borderWidth: 1,
                borderColor: "#F2D0D5",
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "#C0162C", fontSize: 11, fontWeight: "700" }}
              >
                Mark End
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleMarkOvulation}
              activeOpacity={0.85}
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: 50,
                paddingVertical: 9,
                paddingHorizontal: 6,
                borderWidth: 1,
                borderColor: "#B9E5C8",
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "#15803D", fontSize: 11, fontWeight: "700" }}
              >
                Ovulation
              </Text>
            </TouchableOpacity>
          </View>

          {!!periodMessage && (
            <Text
              style={{
                color: "#8C5F66",
                fontSize: 12,
                marginTop: 6,
              }}
            >
              {periodMessage}
            </Text>
          )}
        </View>
      )}

      {openPanel === "symptoms" && (
        <View style={{ marginTop: 10 }}>
          <View
            style={{
              alignSelf: "flex-end",
              marginRight: 14,
              width: 0,
              height: 0,
              borderLeftWidth: 10,
              borderRightWidth: 10,
              borderBottomWidth: 12,
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderBottomColor: "#FFFFFF",
            }}
          />

          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 18,
              padding: 14,
              shadowColor: "#C0162C",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <Text
              style={{
                color: "#C0162C",
                fontSize: 15,
                fontWeight: "800",
                marginBottom: 10,
              }}
            >
              Log Symptoms
            </Text>

            <View
              style={{
                flexDirection: "row",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <TextInput
                value={symptomText}
                onChangeText={setSymptomText}
                placeholder="e.g. I feel dizzy and bloated"
                placeholderTextColor="#B08890"
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#F2D0D5",
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: "#3A1A20",
                  fontSize: 13,
                  backgroundColor: "#FDF0F2",
                }}
              />
              <TouchableOpacity
                onPress={handlePredictFromText}
                activeOpacity={0.85}
                style={{
                  backgroundColor: "#C0162C",
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}
                >
                  Predict
                </Text>
              </TouchableOpacity>
            </View>

            {!!predictionMessage && (
              <Text
                style={{
                  color: "#8C5F66",
                  fontSize: 12,
                  marginBottom: 10,
                }}
              >
                {predictionMessage}
              </Text>
            )}

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {symptomOptions.map((symptom) => {
                const selected = user.symptoms.includes(symptom);

                return (
                  <TouchableOpacity
                    key={symptom}
                    onPress={() => toggleSymptom(symptom)}
                    activeOpacity={0.8}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      borderRadius: 50,
                      borderWidth: 1.5,
                      borderColor: selected ? "#C0162C" : "#E8A0A8",
                      backgroundColor: selected ? "#F7DDE0" : "#fff",
                    }}
                  >
                    <Text
                      style={{
                        color: selected ? "#C0162C" : "#8C5F66",
                        fontSize: 13,
                        fontWeight: selected ? "700" : "500",
                      }}
                    >
                      {symptom}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text
              style={{
                color: "#8C5F66",
                fontSize: 12,
                marginTop: 10,
              }}
            >
              {visibleSymptoms.length > 0
                ? `${visibleSymptoms.length} symptom${
                    visibleSymptoms.length > 1 ? "s" : ""
                  } selected`
                : "Select symptoms to log"}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
