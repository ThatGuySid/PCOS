import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function WorkoutScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "#F7C5CC" }}>
      {/* Back + title */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          padding: 24,
          paddingTop: 56,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: "#C0162C", fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={{ color: "#C0162C", fontSize: 17, fontWeight: "700" }}>
          Workout
        </Text>
      </View>

      {/* Content placeholder — design this screen next */}
      <View
        style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 8 }}
      >
        <Text style={{ fontSize: 40 }}>⚡</Text>
        <Text style={{ color: "#C0162C", fontSize: 16, fontWeight: "700" }}>
          Workout routines coming soon
        </Text>
        <Text style={{ color: "#8C5F66", fontSize: 13 }}>
          PCOS/PCOD-friendly exercises
        </Text>
      </View>
    </View>
  );
}
