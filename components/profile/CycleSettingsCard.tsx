import { Text, TouchableOpacity, View } from "react-native";
import EditableRow from "./EditableRow";

type Props = {
  totalCycleDays: number;
  periodLengthDays: number | null;
  cycleRegularity: "Regular" | "Irregular" | null;
  onChangeCycleDays: (days: number) => void;
  onChangePeriodLength: (days: number) => void;
  onChangeRegularity: (val: "Regular" | "Irregular") => void;
};

export default function CycleSettingsCard({
  totalCycleDays,
  periodLengthDays,
  cycleRegularity,
  onChangeCycleDays,
  onChangePeriodLength,
  onChangeRegularity,
}: Props) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 18,
        marginBottom: 16,
        shadowColor: "#C0162C",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <Text
        style={{
          color: "#C0162C",
          fontSize: 15,
          fontWeight: "800",
          marginBottom: 4,
        }}
      >
        Cycle Settings
      </Text>
      <Text style={{ color: "#8C5F66", fontSize: 12, marginBottom: 12 }}>
        Used to compute your phase and predict your next period.
      </Text>

      <EditableRow
        label="Cycle length (days)"
        value={String(totalCycleDays)}
        keyboardType="numeric"
        onSave={(v) => {
          const n = Number.parseInt(v, 10);
          if (Number.isNaN(n)) return;
          const clamped = Math.min(45, Math.max(14, n));
          onChangeCycleDays(clamped);
        }}
      />

      <EditableRow
        label="Period length (days)"
        value={periodLengthDays !== null ? String(periodLengthDays) : ""}
        placeholder="e.g. 5"
        keyboardType="numeric"
        onSave={(v) => {
          const n = parseInt(v);
          if (!isNaN(n) && n >= 1 && n <= 10) onChangePeriodLength(n);
        }}
      />

      {/* Regularity toggle */}
      <View style={{ paddingVertical: 14 }}>
        <Text
          style={{
            color: "#B08890",
            fontSize: 11,
            fontWeight: "600",
            marginBottom: 8,
          }}
        >
          CYCLE REGULARITY
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {(["Regular", "Irregular"] as const).map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => onChangeRegularity(opt)}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 50,
                borderWidth: 1.5,
                borderColor: cycleRegularity === opt ? "#C0162C" : "#E8A0A8",
                backgroundColor:
                  cycleRegularity === opt ? "#F7DDE0" : "transparent",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: cycleRegularity === opt ? "#C0162C" : "#8C5F66",
                  fontWeight: cycleRegularity === opt ? "700" : "400",
                  fontSize: 13,
                }}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
