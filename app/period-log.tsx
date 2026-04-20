import PeriodCalendar from "@/components/health/PeriodCalendar";
import {
    buildDateRangeKeys,
    flattenUniqueDateKeys,
    getLatestPeriodEntry,
    sortPeriodEntriesByStartDate,
    toDateKey,
} from "@/constants/cycleUtils";
import {
    predictSymptomsFromText,
    SYMPTOM_OPTIONS,
} from "@/constants/symptomPrediction";
import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const REMOVED_SYMPTOM = "Breast Tenderness";

export default function PeriodLogScreen() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [symptomText, setSymptomText] = useState("");
  const [predictionMessage, setPredictionMessage] = useState("");
  const [periodMessage, setPeriodMessage] = useState("");

  useEffect(() => {
    if (!user.symptoms.includes(REMOVED_SYMPTOM)) return;
    setUser({ symptoms: user.symptoms.filter((s) => s !== REMOVED_SYMPTOM) });
  }, [setUser, user.symptoms]);

  const selectedDay = user.selectedPeriodDate?.getDate();
  const visibleSymptoms = user.symptoms.filter((s) => s !== REMOVED_SYMPTOM);
  const isAwaitingPeriodEnd =
    !!user.periodStartDateKey && !user.periodEndDateKey;

  // Period section (health): full control including editing/deleting older entries.

  const handleMarkPeriodStart = () => {
    if (!user.selectedPeriodDate || selectedDay === undefined) return;

    const startKey = toDateKey(user.selectedPeriodDate);
    setUser({
      periodStartDateKey: startKey,
      periodEndDateKey: null,
      periodDateKeys: [],
    });
    setPeriodMessage(`Period start set to day ${selectedDay}.`);
  };

  const handleMarkPeriodEnd = () => {
    if (!user.selectedPeriodDate || selectedDay === undefined) return;
    if (!user.periodStartDateKey) {
      setPeriodMessage("Set period start first, then set period end.");
      return;
    }

    const endKey = toDateKey(user.selectedPeriodDate);
    if (endKey < user.periodStartDateKey) {
      setPeriodMessage("End date cannot be before start date.");
      return;
    }

    const rangeKeys = buildDateRangeKeys(user.periodStartDateKey, endKey);
    const newEntry = {
      startDateKey: user.periodStartDateKey,
      endDateKey: endKey,
      dateKeys: rangeKeys,
    };
    const nextEntries = sortPeriodEntriesByStartDate([
      ...user.periodEntries,
      newEntry,
    ]);

    setUser({
      periodEndDateKey: endKey,
      periodDateKeys: flattenUniqueDateKeys(nextEntries),
      periodEntries: nextEntries,
      periodLengthDays: rangeKeys.length,
    });
    setPeriodMessage(`Period end set to day ${selectedDay}.`);
  };

  const handlePrimaryPeriodAction = () => {
    if (isAwaitingPeriodEnd) {
      handleMarkPeriodEnd();
      return;
    }

    handleMarkPeriodStart();
  };

  const handleClearOvulation = () => {
    setUser({ ovulationDateKey: null });
    setPeriodMessage("Ovulation marker cleared.");
  };

  const handleDeleteLastEntry = () => {
    if (!user.periodEntries.length) {
      setPeriodMessage("No period entries to delete.");
      return;
    }

    const sortedEntries = sortPeriodEntriesByStartDate(user.periodEntries);
    const nextEntries = sortedEntries.slice(0, -1);
    const latest = getLatestPeriodEntry(nextEntries);

    setUser({
      periodEntries: nextEntries,
      periodDateKeys: flattenUniqueDateKeys(nextEntries),
      periodStartDateKey: latest?.startDateKey ?? null,
      periodEndDateKey: latest?.endDateKey ?? null,
      periodLengthDays: latest?.dateKeys.length ?? null,
    });
    setPeriodMessage("Last period entry deleted.");
  };

  const handleMarkOvulation = () => {
    if (!user.selectedPeriodDate || selectedDay === undefined) return;
    const selectedDateKey = toDateKey(user.selectedPeriodDate);
    const isSameDay = user.ovulationDateKey === selectedDateKey;
    setUser({ ovulationDateKey: isSameDay ? null : selectedDateKey });
    setPeriodMessage(
      isSameDay
        ? "Ovulation marker removed."
        : `Ovulation marked for day ${selectedDay}.`,
    );
  };

  const toggleSymptom = (symptom: string) => {
    const updatedSymptoms = visibleSymptoms.includes(symptom)
      ? visibleSymptoms.filter((s) => s !== symptom)
      : [...visibleSymptoms, symptom];

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

    const merged = [...new Set([...visibleSymptoms, ...result.symptoms])];
    setUser({ symptoms: merged });
    setPredictionMessage(
      `${result.confidenceLabel} confidence: detected ${result.symptoms.join(", ")}.`,
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F7C5CC" }}>
      <ScrollView
        contentContainerStyle={{
          padding: 24,
          paddingTop: 56,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Back + title */}
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
            Period Log
          </Text>
        </TouchableOpacity>

        {/* Period Tracker header card */}
        <View
          style={{
            backgroundColor: "#E8637A",
            borderRadius: 18,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: "rgba(255,255,255,0.25)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 20 }}>📅</Text>
          </View>
          <View>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800" }}>
              Period Tracker
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
              Track your cycle and symptoms
            </Text>
          </View>
        </View>

        {/* Calendar */}
        <PeriodCalendar
          selectedDate={user.selectedPeriodDate}
          onSelectDate={(date) => setUser({ selectedPeriodDate: date })}
          periodDateKeys={user.periodDateKeys}
          periodStartDateKey={user.periodStartDateKey}
          periodEndDateKey={user.periodEndDateKey}
          ovulationDateKey={user.ovulationDateKey}
        />

        <View
          style={{
            marginTop: 12,
            flexDirection: "row",
            flexWrap: "nowrap",
            gap: 8,
          }}
        >
          <TouchableOpacity
            onPress={handlePrimaryPeriodAction}
            activeOpacity={0.85}
            style={{
              flex: 2,
              backgroundColor: "#fff",
              borderRadius: 50,
              paddingVertical: 9,
              paddingHorizontal: 6,
              borderWidth: 1,
              borderColor: "#F2D0D5",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#C0162C", fontSize: 11, fontWeight: "700" }}>
              {isAwaitingPeriodEnd ? "Mark End" : "Mark Start"}
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
            <Text style={{ color: "#15803D", fontSize: 11, fontWeight: "700" }}>
              Ovulation
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: 6,
            flexDirection: "row",
            gap: 8,
          }}
        >
          <TouchableOpacity
            onPress={handleDeleteLastEntry}
            activeOpacity={0.8}
            style={{
              borderRadius: 50,
              paddingVertical: 7,
              paddingHorizontal: 12,
              backgroundColor: "#E8637A",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>
              Delete Last Entry
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleClearOvulation}
            activeOpacity={0.8}
            style={{
              borderRadius: 50,
              paddingVertical: 7,
              paddingHorizontal: 12,
              backgroundColor: "#9CCFAE",
            }}
          >
            <Text style={{ color: "#0B5E2B", fontSize: 11, fontWeight: "700" }}>
              Clear Ovulation
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

        {/* History stays editable via the top Delete Last Entry control. */}

        {/* Symptoms section (health): full text prediction + chip logging. */}
        <View
          style={{
            marginTop: 20,
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
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>
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
            {SYMPTOM_OPTIONS.map((symptom) => {
              const selected = visibleSymptoms.includes(symptom);
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
      </ScrollView>
    </View>
  );
}
