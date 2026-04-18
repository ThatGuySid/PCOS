import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function ActionButtons() {
  const router = useRouter();

  return (
    <View className="flex-row gap-3">
      {/* Log Period */}
      <TouchableOpacity
        onPress={() => router.push("/period-log")}
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
        onPress={() => router.push("/symptoms")}
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
  );
}
