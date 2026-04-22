import { View, Text, TouchableOpacity, ScrollView } from "react-native";

type Props = {
  selected: number | null;
  onSelect: (index: number) => void;
};

const AVATARS = [
  { bg: "#5B8CDB", accent: "#F472B6" },
  { bg: "#FBBF24", accent: "#EC4899" },
  { bg: "#3B82F6", accent: "#F59E0B" },
  { bg: "#FBBF24", accent: "#60A5FA" },
  { bg: "#A78BFA", accent: "#F97316" },
  { bg: "#FACC15", accent: "#EF4444" },
];

export default function AvatarSelector({ selected, onSelect }: Props) {
  return (
    <View>
      <Text style={{ color: "#8C5F66", fontSize: 13, fontWeight: "600", marginBottom: 10 }}>
        Choose Avatar
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {AVATARS.map((avatar, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onSelect(index)}
              activeOpacity={0.8}
              style={{
                width: 64,
                height: 64,
                borderRadius: 12,
                backgroundColor: avatar.bg,
                borderWidth: selected === index ? 3 : 0,
                borderColor: "#C0162C",
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <View
                style={{
                  width: "65%",
                  height: "55%",
                  backgroundColor: avatar.accent,
                  borderTopLeftRadius: 40,
                  borderTopRightRadius: 40,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: "#FDDCB5",
                    marginTop: -12,
                  }}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
