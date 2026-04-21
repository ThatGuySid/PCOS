import { View, Text } from "react-native";

export type FoodItem = {
  emoji: string;
  name: string;
  reason: string;
};

type Props = {
  item: FoodItem;
  type: "favour" | "avoid";
};

export default function FoodCard({ item, type }: Props) {
  const isFavour = type === "favour";

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 14,
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
        marginBottom: 10,
        borderLeftWidth: 3,
        borderLeftColor: isFavour ? "#22C55E" : "#EF4444",
      }}
    >
      <Text style={{ fontSize: 28, marginTop: 2 }}>{item.emoji}</Text>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <Text style={{ color: "#3A1A20", fontSize: 14, fontWeight: "700" }}>
            {item.name}
          </Text>
          <View
            style={{
              backgroundColor: isFavour ? "#DCFCE7" : "#FEE2E2",
              borderRadius: 50,
              paddingHorizontal: 8,
              paddingVertical: 2,
            }}
          >
            <Text
              style={{
                color: isFavour ? "#15803D" : "#C0162C",
                fontSize: 10,
                fontWeight: "700",
              }}
            >
              {isFavour ? "✓ Favour" : "✕ Avoid"}
            </Text>
          </View>
        </View>
        <Text style={{ color: "#8C5F66", fontSize: 12, lineHeight: 18 }}>
          {item.reason}
        </Text>
      </View>
    </View>
  );
}
