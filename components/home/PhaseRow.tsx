import { Text, View } from "react-native";

type Props = {
  phase: string;
  cycleDay: number;
  totalCycleDays: number;
};

export default function PhaseRow({ phase, cycleDay, totalCycleDays }: Props) {
  return (
    <View className="flex-row items-center gap-3 mb-8">
      {/* Droplet icon */}
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: "rgba(255,255,255,0.25)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 18 }}>💧</Text>
      </View>

      {/* Phase info */}
      <View>
        <Text className="text-white text-base font-bold">{phase} Phase</Text>
        <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>
          Day {cycleDay} of {totalCycleDays}
        </Text>
      </View>
    </View>
  );
}
