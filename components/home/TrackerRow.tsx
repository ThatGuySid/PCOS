import { Text, View } from "react-native";

type Props = {
  cycleDay: number;
  totalCycleDays: number;
};

export default function TrackerRow({ cycleDay, totalCycleDays }: Props) {
  const percentage = Math.round((cycleDay / totalCycleDays) * 100);

  return (
    <View className="flex-row items-center justify-between mb-4">
      <View className="flex-row items-center gap-3">
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            backgroundColor: "rgba(255,255,255,0.25)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 18 }}>🗓</Text>
        </View>
        <Text className="text-white text-lg font-bold">Tracker</Text>
      </View>

      {/* Right — circular % badge */}
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: "rgba(255,255,255,0.2)",
          borderWidth: 2.5,
          borderColor: "rgba(255,255,255,0.5)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 14, fontWeight: "800" }}>
          {percentage}%
        </Text>
        <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 10 }}>
          Day {cycleDay}
        </Text>
      </View>
    </View>
  );
}
