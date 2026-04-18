import { View } from "react-native";
import ActionButtons from "./ActionButtons";
import PhaseRow from "./PhaseRow";
import TrackerRow from "./TrackerRow";

type Props = {
  cycleDay: number;
  totalCycleDays: number;
  phase: string;
};

export default function CycleCard({ cycleDay, totalCycleDays, phase }: Props) {
  return (
    <View
      style={{
        backgroundColor: "#E8637A",
        borderRadius: 24,
        padding: 20,
        shadowColor: "#C0162C",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 6,
      }}
    >
      {/* Tracker row — label left, % circle right */}
      <TrackerRow cycleDay={cycleDay} totalCycleDays={totalCycleDays} />

      {/* Divider */}
      <View
        style={{
          height: 1,
          backgroundColor: "rgba(255,255,255,0.2)",
          marginBottom: 16,
        }}
      />

      {/* Phase row */}
      <PhaseRow
        phase={phase}
        cycleDay={cycleDay}
        totalCycleDays={totalCycleDays}
      />

      {/* Log Period + Symptoms buttons */}
      <ActionButtons />
    </View>
  );
}
