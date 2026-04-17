import { View, Text, TouchableOpacity } from "react-native";

type Props = {
  selected: string | null;
  onSelect: (value: string) => void;
};

const AGE_GROUPS = ["10-19", "20-35", "36-50", "50 & above"];

export default function AgeGroupPicker({ selected, onSelect }: Props) {
  return (
    <View>
      {/* Section label */}
      <Text className="text-[#C0162C] text-base font-semibold mb-3">
        Your Age Group
      </Text>

      {/* 2x2 grid */}
      <View className="flex-row flex-wrap gap-3">
        {AGE_GROUPS.map((group) => (
          <TouchableOpacity
            key={group}
            onPress={() => onSelect(group)}
            activeOpacity={0.8}
            style={{
              width: "47%",
              paddingVertical: 14,
              borderRadius: 50,
              borderWidth: 1.5,
              borderColor: selected === group ? "#C0162C" : "#E8A0A8",
              backgroundColor: selected === group ? "#F7DDE0" : "transparent",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: selected === group ? "#C0162C" : "#8C5F66",
                fontWeight: selected === group ? "700" : "400",
                fontSize: 14,
              }}
            >
              {group}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
