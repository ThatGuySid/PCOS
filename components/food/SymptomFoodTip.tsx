import { View, Text } from "react-native";

type Props = {
  tip: string | null;
  symptomLabel: string | null;
};

export default function SymptomFoodTip({ tip, symptomLabel }: Props) {
  if (!tip || !symptomLabel) return null;

  return (
    <View
      style={{
        backgroundColor: "#FFF7ED",
        borderRadius: 14,
        padding: 14,
        marginBottom: 16,
        flexDirection: "row",
        gap: 10,
        borderWidth: 1,
        borderColor: "#FED7AA",
      }}
    >
      <Text style={{ fontSize: 20 }}>💡</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ color: "#92400E", fontSize: 13, fontWeight: "700", marginBottom: 3 }}>
          Based on your {symptomLabel} logs
        </Text>
        <Text style={{ color: "#78350F", fontSize: 12, lineHeight: 18 }}>
          {tip}
        </Text>
      </View>
    </View>
  );
}
