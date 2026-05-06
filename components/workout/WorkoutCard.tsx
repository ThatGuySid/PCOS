import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export type Workout = {
  id: string;
  name: string;
  duration: string;
  intensity: "Low" | "Medium" | "High";
  emoji: string;
  why: string; // phase/symptom reason
  steps: string[];
};

const INTENSITY_COLORS = {
  Low: { bg: "#DCFCE7", text: "#15803D" },
  Medium: { bg: "#FEF3C7", text: "#D97706" },
  High: { bg: "#FEE2E2", text: "#C0162C" },
};

type Props = {
  workout: Workout;
};

export default function WorkoutCard({ workout }: Props) {
  const [done, setDone] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const intensity = INTENSITY_COLORS[workout.intensity];

  return (
    <View
      style={{
        backgroundColor: done ? "#F0FDF4" : "#fff",
        borderRadius: 18,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1.5,
        borderColor: done ? "#86EFAC" : "#F2D0D5",
        shadowColor: "#C0162C",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {/* Top row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          marginBottom: 8,
        }}
      >
        <View
          style={{
            width: 48,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("@/assets/images/workout emoji.png")}
            resizeMode="contain"
            style={{ width: 48, height: 48 }}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: "#3A1A20",
              fontSize: 15,
              fontWeight: "700",
              marginBottom: 3,
            }}
          >
            {workout.name}
          </Text>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <Text style={{ color: "#8C5F66", fontSize: 12 }}>
              ⏱ {workout.duration}
            </Text>
            <View
              style={{
                backgroundColor: intensity.bg,
                borderRadius: 50,
                paddingHorizontal: 8,
                paddingVertical: 2,
              }}
            >
              <Text
                style={{
                  color: intensity.text,
                  fontSize: 11,
                  fontWeight: "700",
                }}
              >
                {workout.intensity}
              </Text>
            </View>
          </View>
        </View>

        {/* Done toggle */}
        <TouchableOpacity
          onPress={() => setDone((d) => !d)}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: done ? "#22C55E" : "#F2D0D5",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 16 }}>{done ? "✓" : "○"}</Text>
        </TouchableOpacity>
      </View>

      {/* Why this today */}
      <View
        style={{
          backgroundColor: "#FDF0F2",
          borderRadius: 10,
          padding: 10,
          marginBottom: 8,
        }}
      >
        <Text
          style={{
            color: "#C0162C",
            fontSize: 11,
            fontWeight: "700",
            marginBottom: 2,
          }}
        >
          Why this today?
        </Text>
        <Text style={{ color: "#8C5F66", fontSize: 12, lineHeight: 18 }}>
          {workout.why}
        </Text>
      </View>

      {/* Expand steps */}
      <TouchableOpacity onPress={() => setExpanded((e) => !e)}>
        <Text style={{ color: "#C0162C", fontSize: 12, fontWeight: "700" }}>
          {expanded ? "Hide steps ▲" : "Show steps ▼"}
        </Text>
      </TouchableOpacity>

      {expanded && (
        <View style={{ marginTop: 10, gap: 6 }}>
          {workout.steps.map((step, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 8 }}>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: "#C0162C",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 1,
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}
                >
                  {i + 1}
                </Text>
              </View>
              <Text
                style={{
                  color: "#3A1A20",
                  fontSize: 13,
                  flex: 1,
                  lineHeight: 20,
                }}
              >
                {step}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
