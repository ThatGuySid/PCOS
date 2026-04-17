import { View, Text, TouchableOpacity } from "react-native";

type Props = {
  selected: number | null;
  onSelect: (index: number) => void;
};

// Placeholder avatar colors — replace View boxes with Image when assets are ready
const AVATARS = [
  { bg: "#5B8CDB", accent: "#F472B6" }, // blue bg, pink top
  { bg: "#FBBF24", accent: "#EC4899" }, // yellow bg, pink top
  { bg: "#3B82F6", accent: "#F59E0B" }, // blue bg, yellow top
  { bg: "#FBBF24", accent: "#60A5FA" }, // yellow bg, blue top
  { bg: "#A78BFA", accent: "#F97316" }, // purple bg, orange top
  { bg: "#FACC15", accent: "#EF4444" }, // yellow bg, red top
];

export default function AvatarPicker({ selected, onSelect }: Props) {
  return (
    <View>
      {/* Section label */}
      <Text className="text-[#C0162C] text-base font-semibold mb-3">
        Choose Your Avatar
      </Text>

      {/* 2x3 grid */}
      <View className="flex-row flex-wrap gap-3">
        {AVATARS.map((avatar, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onSelect(index)}
            activeOpacity={0.8}
            style={{
              width: "30%",
              aspectRatio: 1,
              borderRadius: 12,
              backgroundColor: avatar.bg,
              borderWidth: selected === index ? 3 : 0,
              borderColor: "#C0162C",
              overflow: "hidden",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            {/* Placeholder figure — torso + head */}
            <View
              style={{
                width: "60%",
                height: "55%",
                backgroundColor: avatar.accent,
                borderTopLeftRadius: 40,
                borderTopRightRadius: 40,
                alignItems: "center",
                justifyContent: "flex-start",
                paddingTop: 4,
              }}
            >
              {/* Head */}
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: "#FDDCB5",
                  marginTop: -14,
                }}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
