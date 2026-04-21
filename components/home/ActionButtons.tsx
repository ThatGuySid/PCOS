import PeriodCalendar from "@/components/health/PeriodCalendar";
import {
    buildDateRangeKeys,
    flattenUniqueDateKeys,
    getLatestPeriodEntry,
    sortPeriodEntriesByStartDate,
    toDateKey,
} from "@/constants/cycleUtils";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const REMOVED_SYMPTOM = "Breast Tenderness";

export default function ActionButtons() {
  const { user, setUser } = useUser();
  const [openPanel, setOpenPanel] = useState<"period" | "symptoms" | null>(
    null,
  );
  const [periodMessage, setPeriodMessage] = useState("");
  const [symptomMessage, setSymptomMessage] = useState("");
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
  const isAwaitingPeriodEnd =
    !!user.periodStartDateKey && !user.periodEndDateKey;

  // ===== Period section (home): only add a new entry and delete latest =====

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

  const handlePrimaryPeriodAction = () => {
    if (isAwaitingPeriodEnd) {
      handleMarkPeriodEnd();
      return;
    }

    handleMarkPeriodStart();
  };

  const handleDeleteLastEntry = () => {
    if (!user.periodEntries.length) {
      setPeriodMessage("No period entries to delete.");
      return;
    }

    const sortedEntries = sortPeriodEntriesByStartDate(user.periodEntries);
    const nextEntries = sortedEntries.slice(0, -1);
    const latestRemaining = getLatestPeriodEntry(nextEntries);

    setUser({
      periodEntries: nextEntries,
      periodDateKeys: flattenUniqueDateKeys(nextEntries),
      periodStartDateKey: latestRemaining?.startDateKey ?? null,
      periodEndDateKey: latestRemaining?.endDateKey ?? null,
      periodLengthDays: latestRemaining?.dateKeys.length ?? null,
    });
    setPeriodMessage("Last period entry deleted.");
  };

  const handleClearOvulation = () => {
    setUser({ ovulationDateKey: null });
    setPeriodMessage("Ovulation marker cleared.");
  };

  // ===== Symptoms section (home): quick chip toggles only =====
  const toggleSymptom = (symptom: string) => {
    const existingSymptoms = user.symptoms.filter((s) => s !== REMOVED_SYMPTOM);
    const updatedSymptoms = existingSymptoms.includes(symptom)
      ? existingSymptoms.filter((s) => s !== symptom)
      : [...existingSymptoms, symptom];

    setUser({ symptoms: updatedSymptoms });
    if (symptomMessage) setSymptomMessage("");
  };

  const handleSaveSymptomLog = () => {
    if (!visibleSymptoms.length) {
      setSymptomMessage("Select at least one symptom to save a log.");
      return;
    }

    const targetDate = user.selectedPeriodDate ?? new Date();
    const dateKey = toDateKey(targetDate);
    const uniqueSymptoms = [...new Set(visibleSymptoms)];

    const existingLog = user.symptomLogs.find((log) => log.dateKey === dateKey);
    const mergedSymptoms = existingLog
      ? [...new Set([...existingLog.symptoms, ...uniqueSymptoms])]
      : uniqueSymptoms;

    const nextLog = {
      id: existingLog?.id ?? `${dateKey}-${Date.now()}`,
      dateKey,
      symptoms: mergedSymptoms,
      cycleDay: user.cycleDay,
      cyclePhase: user.cyclePhase,
    };

    const nextLogs = existingLog
      ? user.symptomLogs.map((log) => (log.dateKey === dateKey ? nextLog : log))
      : [...user.symptomLogs, nextLog];

    const sortedLogs = [...nextLogs].sort((a, b) =>
      b.dateKey.localeCompare(a.dateKey),
    );

    setUser({
      symptomLogs: sortedLogs,
      symptoms: [],
    });

    setSymptomMessage(`Saved log for ${dateKey}.`);
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

      {/* ===== Render: Period Panel ===== */}
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
            periodDateKeys={user.periodDateKeys}
            periodStartDateKey={user.periodStartDateKey}
            periodEndDateKey={user.periodEndDateKey}
            ovulationDateKey={user.ovulationDateKey}
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
              <Text
                style={{ color: "#C0162C", fontSize: 11, fontWeight: "700" }}
              >
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
              <Text
                style={{ color: "#15803D", fontSize: 11, fontWeight: "700" }}
              >
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
                paddingVertical: 6,
                paddingHorizontal: 10,
                backgroundColor: "rgba(255,255,255,0.35)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.45)",
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
                paddingVertical: 6,
                paddingHorizontal: 10,
                backgroundColor: "rgba(255,255,255,0.35)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.45)",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>
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
        </View>
      )}

      {/* ===== Render: Symptoms Panel ===== */}
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
              Use Period Log in Health tab for detailed text-based symptom
              prediction.
            </Text>

            <Text
              style={{
                color: "#8C5F66",
                fontSize: 12,
                marginTop: 4,
              }}
            >
              {visibleSymptoms.length > 0
                ? `${visibleSymptoms.length} symptom${
                    visibleSymptoms.length > 1 ? "s" : ""
                  } selected`
                : "Select symptoms to log"}
            </Text>

            <TouchableOpacity
              onPress={handleSaveSymptomLog}
              activeOpacity={0.85}
              style={{
                marginTop: 10,
                backgroundColor: "#C0162C",
                borderRadius: 12,
                paddingVertical: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>
                Save Log
              </Text>
            </TouchableOpacity>

            {!!symptomMessage && (
              <Text
                style={{
                  color: "#8C5F66",
                  fontSize: 12,
                  marginTop: 8,
                }}
              >
                {symptomMessage}
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
}
