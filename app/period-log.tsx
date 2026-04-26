import PeriodCalendar from "@/components/health/PeriodCalendar";
import {
    predictSymptomsFromText,
    SYMPTOM_OPTIONS,
} from "@/constants/symptomPrediction";
import { CyclePhase, useUser } from "@/context/UserContext";
import {
    buildDateRangeKeys,
    flattenUniqueDateKeys,
    fromDateKey,
    getLatestPeriodEntry,
    sortPeriodEntriesByStartDate,
    toDateKey,
} from "@/services/dateService";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const REMOVED_SYMPTOM = "Breast Tenderness";
// TODO(dev): Add push notifications again in final build.
// We'll keep this away for now and add it later.
const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const MONTH_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatDateLabel(dateKey: string) {
  const date = fromDateKey(dateKey);
  if (!date) return dateKey;
  return `${MONTH_SHORT[date.getMonth()]} ${date.getDate()}`;
}

function getCycleDayForDate(
  dateKey: string,
  periodStartDateKey: string | null,
  totalCycleDays: number,
) {
  if (!periodStartDateKey) return 1;
  const start = fromDateKey(periodStartDateKey);
  const target = fromDateKey(dateKey);
  if (!start || !target) return 1;

  const msInDay = 1000 * 60 * 60 * 24;
  const elapsed = Math.floor((target.getTime() - start.getTime()) / msInDay);
  const normalized =
    ((elapsed % totalCycleDays) + totalCycleDays) % totalCycleDays;
  return normalized + 1;
}

function getPhaseForCycleDay(
  cycleDay: number,
  totalCycleDays: number,
  periodLengthDays: number,
): CyclePhase {
  const ovulationDay = Math.round(totalCycleDays * 0.5);

  if (cycleDay <= periodLengthDays) return "Menstrual";
  if (Math.abs(cycleDay - ovulationDay) <= 1) return "Ovulation";
  if (cycleDay < ovulationDay) return "Follicular";
  return "Luteal";
}

function analyzePatterns(
  logs: Array<{ symptoms: string[]; cycleDay: number; cyclePhase: CyclePhase }>,
  totalCycleDays: number,
) {
  if (logs.length < 3) return [];

  const insights: string[] = [];
  const headacheBeforePeriod = logs.filter(
    (log) =>
      log.symptoms.includes("Headache") &&
      log.cycleDay >= Math.max(1, totalCycleDays - 2),
  ).length;

  if (headacheBeforePeriod >= 2) {
    insights.push(
      "You often report headaches about 2 days before your period.",
    );
  }

  const fatigueLuteal = logs.filter(
    (log) => log.symptoms.includes("Fatigue") && log.cyclePhase === "Luteal",
  ).length;

  if (fatigueLuteal >= 2) {
    insights.push("Fatigue appears frequently in your luteal phase.");
  }

  const symptomCounts = new Map<string, { count: number; totalDay: number }>();
  logs.forEach((log) => {
    log.symptoms.forEach((symptom) => {
      const prev = symptomCounts.get(symptom) ?? { count: 0, totalDay: 0 };
      symptomCounts.set(symptom, {
        count: prev.count + 1,
        totalDay: prev.totalDay + log.cycleDay,
      });
    });
  });

  const topSymptom = [...symptomCounts.entries()].sort(
    (a, b) => b[1].count - a[1].count,
  )[0];
  if (topSymptom && topSymptom[1].count >= 3) {
    const averageDay = Math.round(topSymptom[1].totalDay / topSymptom[1].count);
    insights.push(
      `You often report ${topSymptom[0].toLowerCase()} around day ${averageDay}.`,
    );
  }

  return insights.slice(0, 3);
}

function buildDailyInsight(symptoms: string[], cyclePhase: CyclePhase) {
  const hasSpotting = symptoms.includes("Spotting");
  const hasCramps = symptoms.includes("Cramps");
  const hasAcne = symptoms.includes("Acne");
  const hasFatigue = symptoms.includes("Fatigue");

  if (hasSpotting && hasCramps) {
    return "These symptoms can mean your period may be starting early.";
  }

  if (hasAcne && hasFatigue) {
    return "Acne + fatigue often appears in PMS days before your period.";
  }

  if (cyclePhase === "Ovulation") {
    return "You might be entering ovulation phase today.";
  }

  if (hasFatigue) {
    return "Stay hydrated and prioritize rest; fatigue is common today.";
  }

  return "These symptoms are common in this cycle phase.";
}

function buildSymptomFrequency(logs: Array<{ symptoms: string[] }>) {
  const counts = new Map<string, number>();
  logs.forEach((log) => {
    log.symptoms.forEach((symptom) => {
      counts.set(symptom, (counts.get(symptom) ?? 0) + 1);
    });
  });

  return [...counts.entries()]
    .map(([symptom, count]) => ({ symptom, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function sortLogsByDateDesc<T extends { dateKey: string }>(logs: T[]) {
  return [...logs].sort((a, b) => b.dateKey.localeCompare(a.dateKey));
}

export default function PeriodLogScreen() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [symptomText, setSymptomText] = useState("");
  const [predictionMessage, setPredictionMessage] = useState("");
  const [periodMessage, setPeriodMessage] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [dailyInsightMessage, setDailyInsightMessage] = useState("");
  const [frequencyMonthQuery, setFrequencyMonthQuery] = useState("All months");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [selectedFrequencyMonth, setSelectedFrequencyMonth] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (!user.symptoms.includes(REMOVED_SYMPTOM)) return;
    setUser({ symptoms: user.symptoms.filter((s) => s !== REMOVED_SYMPTOM) });
  }, [setUser, user.symptoms]);

  const selectedDay = user.selectedPeriodDate?.getDate();
  const selectedDateKey = user.selectedPeriodDate
    ? toDateKey(user.selectedPeriodDate)
    : null;
  const visibleSymptoms = user.symptoms.filter((s) => s !== REMOVED_SYMPTOM);
  const isAwaitingPeriodEnd =
    !!user.periodStartDateKey && !user.periodEndDateKey;
  const sortedSymptomLogs = useMemo(
    () => sortLogsByDateDesc(user.symptomLogs),
    [user.symptomLogs],
  );
  const patternInsights = useMemo(
    () => analyzePatterns(sortedSymptomLogs, user.totalCycleDays),
    [sortedSymptomLogs, user.totalCycleDays],
  );
  const filteredFrequencyLogs = useMemo(() => {
    if (selectedFrequencyMonth === null) return sortedSymptomLogs;

    return sortedSymptomLogs.filter((log) => {
      const date = fromDateKey(log.dateKey);
      return date?.getMonth() === selectedFrequencyMonth;
    });
  }, [selectedFrequencyMonth, sortedSymptomLogs]);
  const symptomFrequency = useMemo(
    () => buildSymptomFrequency(filteredFrequencyLogs),
    [filteredFrequencyLogs],
  );
  const filteredMonthOptions = useMemo(() => {
    const query = frequencyMonthQuery.trim().toLowerCase();

    const months = MONTH_LONG.map((month, index) => ({
      label: month,
      value: index,
    })).filter((item) => {
      if (!query || query === "all" || query === "all months") return true;
      return item.label.toLowerCase().includes(query);
    });

    if (!query || "all months".includes(query)) {
      return [{ label: "All months", value: null as number | null }, ...months];
    }

    return months;
  }, [frequencyMonthQuery]);

  const handleMonthInputChange = (value: string) => {
    setFrequencyMonthQuery(value);
    setShowMonthDropdown(true);
  };

  const handleMonthSelect = (month: {
    label: string;
    value: number | null;
  }) => {
    setSelectedFrequencyMonth(month.value);
    setFrequencyMonthQuery(month.label);
    setShowMonthDropdown(false);
  };

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
      setPeriodMessage(
        "Start your period first, then we can add the end date.",
      );
      return;
    }

    const endKey = toDateKey(user.selectedPeriodDate);
    if (endKey < user.periodStartDateKey) {
      setPeriodMessage(
        "That end date is before the start date. Try a later day.",
      );
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
      setPeriodMessage(
        "Nothing to delete yet. Add your first period entry anytime.",
      );
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
        "I couldn't read clear symptoms from that text yet. Try selecting from the symptom chips.",
      );
      return;
    }

    const merged = [...new Set([...visibleSymptoms, ...result.symptoms])];
    setUser({ symptoms: merged });
    setSaveMessage("");
    setPredictionMessage(
      `${result.confidenceLabel} confidence: detected ${result.symptoms.join(", ")}.`,
    );
  };

  const handleSaveSymptomLog = () => {
    if (!selectedDateKey) {
      setSaveMessage("Pick a date on the calendar first, then save your log.");
      return;
    }

    if (!visibleSymptoms.length) {
      setSaveMessage("Choose at least one symptom so we can save your log.");
      return;
    }

    const uniqueSymptoms = [...new Set(visibleSymptoms)];
    const predictedCycleDay = getCycleDayForDate(
      selectedDateKey,
      user.periodStartDateKey,
      user.totalCycleDays,
    );
    let inferredPhase = getPhaseForCycleDay(
      predictedCycleDay,
      user.totalCycleDays,
      user.periodLengthDays ?? 5,
    );
    let inferredCycleDay = predictedCycleDay;
    let cycleRegularity = user.cycleRegularity;
    let forcePeriodStart = false;

    const hasSpotting = uniqueSymptoms.includes("Spotting");
    const hasCramps = uniqueSymptoms.includes("Cramps");
    const hasAcne = uniqueSymptoms.includes("Acne");
    const hasFatigue = uniqueSymptoms.includes("Fatigue");

    if (hasSpotting && hasCramps) {
      inferredPhase = "Menstrual";
      inferredCycleDay = 1;
      forcePeriodStart = true;
      if (predictedCycleDay < user.totalCycleDays - 3) {
        cycleRegularity = "Irregular";
        setPredictionMessage(
          "Spotting + cramps may indicate an earlier period this cycle.",
        );
      }
    } else if (hasAcne && hasFatigue) {
      inferredPhase = "Luteal";
      setPredictionMessage("Acne + fatigue pattern suggests PMS/luteal phase.");
    }

    const existingLog = user.symptomLogs.find(
      (log) => log.dateKey === selectedDateKey,
    );
    const mergedSymptoms = existingLog
      ? [...new Set([...existingLog.symptoms, ...uniqueSymptoms])]
      : uniqueSymptoms;

    const nextLog = {
      id: existingLog?.id ?? `${selectedDateKey}-${Date.now()}`,
      dateKey: selectedDateKey,
      symptoms: mergedSymptoms,
      cycleDay: inferredCycleDay,
      cyclePhase: inferredPhase,
    };

    const nextLogs = existingLog
      ? user.symptomLogs.map((log) =>
          log.dateKey === selectedDateKey ? nextLog : log,
        )
      : [...user.symptomLogs, nextLog];
    const sortedNextLogs = sortLogsByDateDesc(nextLogs);

    // TODO(dev): Add push notifications in final build.
    // We'll keep this away for now and add it later.

    setUser({
      symptomLogs: sortedNextLogs,
      symptoms: [],
      cycleDay: inferredCycleDay,
      cyclePhase: inferredPhase,
      cycleRegularity,
      periodStartDateKey: forcePeriodStart
        ? selectedDateKey
        : user.periodStartDateKey,
      periodEndDateKey: forcePeriodStart ? null : user.periodEndDateKey,
      periodDateKeys: forcePeriodStart
        ? [selectedDateKey]
        : user.periodDateKeys,
    });

    setDailyInsightMessage(buildDailyInsight(mergedSymptoms, inferredPhase));
    setSaveMessage(
      `Saved ${formatDateLabel(selectedDateKey)} - ${mergedSymptoms.join(", ")}`,
    );
  };

  const handleDeleteSymptomLog = (logId: string) => {
    const targetLog = user.symptomLogs.find((log) => log.id === logId);
    if (!targetLog) return;

    const nextLogs = user.symptomLogs.filter((log) => log.id !== logId);
    setUser({ symptomLogs: nextLogs });
    setSaveMessage(`Deleted log for ${formatDateLabel(targetLog.dateKey)}.`);
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
            Symptom Logging
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

          <TouchableOpacity
            onPress={handleSaveSymptomLog}
            activeOpacity={0.85}
            style={{
              marginTop: 12,
              backgroundColor: "#C0162C",
              borderRadius: 12,
              paddingVertical: 11,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>
              Save Log
            </Text>
          </TouchableOpacity>

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

          {!!saveMessage && (
            <Text
              style={{
                color: "#8C5F66",
                fontSize: 12,
                marginTop: 6,
              }}
            >
              {saveMessage}
            </Text>
          )}

          {!!dailyInsightMessage && (
            <View
              style={{
                marginTop: 10,
                borderRadius: 12,
                backgroundColor: "#FDF0F2",
                padding: 10,
                borderWidth: 1,
                borderColor: "#F2D0D5",
              }}
            >
              <Text
                style={{
                  color: "#C0162C",
                  fontSize: 12,
                  fontWeight: "700",
                  marginBottom: 3,
                }}
              >
                Daily Insight
              </Text>
              <Text style={{ color: "#8C5F66", fontSize: 12 }}>
                {dailyInsightMessage}
              </Text>
            </View>
          )}
        </View>

        {/*
          TODO(dev): Add push notifications again in final build.
          We'll keep this away for now and add it later.
          Reminder UI and scheduling are intentionally disabled for Expo Go.
        */}

        <View
          style={{
            marginTop: 14,
            backgroundColor: "#fff",
            borderRadius: 18,
            padding: 14,
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
            Symptom History
          </Text>

          {sortedSymptomLogs.length === 0 ? (
            <Text style={{ color: "#8C5F66", fontSize: 12 }}>
              No entries yet. When you're ready, add your first symptom note
              here.
            </Text>
          ) : (
            sortedSymptomLogs.slice(0, 10).map((log) => (
              <View
                key={log.id}
                style={{
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: "#F8E6E9",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: "#3A1A20",
                        fontSize: 13,
                        fontWeight: "600",
                      }}
                    >
                      {formatDateLabel(log.dateKey)} - {log.symptoms.join(", ")}
                    </Text>
                    <Text
                      style={{ color: "#B08890", fontSize: 11, marginTop: 2 }}
                    >
                      Day {log.cycleDay} - {log.cyclePhase} phase
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleDeleteSymptomLog(log.id)}
                    activeOpacity={0.8}
                    style={{
                      paddingVertical: 6,
                      paddingHorizontal: 8,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "#F2D0D5",
                      backgroundColor: "#FFF5F6",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontSize: 12 }}>🗑</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        <View
          style={{
            marginTop: 14,
            backgroundColor: "#fff",
            borderRadius: 18,
            padding: 14,
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
            Pattern Tracking
          </Text>

          {patternInsights.length === 0 ? (
            <Text style={{ color: "#8C5F66", fontSize: 12 }}>
              Add at least 3 logs to unlock personalized pattern tracking.
            </Text>
          ) : (
            patternInsights.map((insight) => (
              <Text
                key={insight}
                style={{
                  color: "#8C5F66",
                  fontSize: 12,
                  marginBottom: 6,
                }}
              >
                - {insight}
              </Text>
            ))
          )}
        </View>

        <View
          style={{
            marginTop: 14,
            backgroundColor: "#fff",
            borderRadius: 18,
            padding: 14,
          }}
        >
          <Text
            style={{
              color: "#C0162C",
              fontSize: 15,
              fontWeight: "800",
              marginBottom: 8,
            }}
          >
            Symptom Frequency
          </Text>

          <Text
            style={{
              color: "#8C5F66",
              fontSize: 12,
              marginBottom: 6,
            }}
          >
            Select month
          </Text>

          <TextInput
            value={frequencyMonthQuery}
            onChangeText={handleMonthInputChange}
            onFocus={() => setShowMonthDropdown(true)}
            placeholder="Type month (e.g. March)"
            placeholderTextColor="#B08890"
            style={{
              borderWidth: 1,
              borderColor: "#F2D0D5",
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 9,
              color: "#3A1A20",
              fontSize: 13,
              backgroundColor: "#FDF0F2",
              marginBottom: 8,
            }}
          />

          {showMonthDropdown && (
            <View
              style={{
                borderWidth: 1,
                borderColor: "#F2D0D5",
                borderRadius: 10,
                backgroundColor: "#fff",
                marginBottom: 10,
                overflow: "hidden",
              }}
            >
              {filteredMonthOptions.length === 0 ? (
                <Text
                  style={{
                    color: "#8C5F66",
                    fontSize: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                  }}
                >
                  No months match your input.
                </Text>
              ) : (
                filteredMonthOptions.map((month) => (
                  <TouchableOpacity
                    key={month.label}
                    onPress={() => handleMonthSelect(month)}
                    activeOpacity={0.8}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: "#F8E6E9",
                    }}
                  >
                    <Text style={{ color: "#3A1A20", fontSize: 13 }}>
                      {month.label}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}

          {symptomFrequency.length === 0 ? (
            <Text style={{ color: "#8C5F66", fontSize: 12 }}>
              {selectedFrequencyMonth === null
                ? "Log symptoms on multiple days to see trend graphs."
                : `No symptom logs found for ${MONTH_LONG[selectedFrequencyMonth]}.`}
            </Text>
          ) : (
            symptomFrequency.map((item) => {
              const maxCount = symptomFrequency[0]?.count ?? 1;
              const widthPct = Math.max(
                12,
                Math.round((item.count / maxCount) * 100),
              );

              return (
                <View key={item.symptom} style={{ marginBottom: 10 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: "#3A1A20",
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    >
                      {item.symptom}
                    </Text>
                    <Text style={{ color: "#8C5F66", fontSize: 12 }}>
                      {item.count}
                    </Text>
                  </View>
                  <View
                    style={{
                      height: 8,
                      borderRadius: 8,
                      backgroundColor: "#F8E6E9",
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        width: `${widthPct}%`,
                        height: "100%",
                        backgroundColor: "#E8637A",
                      }}
                    />
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}
