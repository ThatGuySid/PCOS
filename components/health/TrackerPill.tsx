import { Text, TouchableOpacity } from "react-native";

type Props = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export default function TrackerPill({ label, active = false, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        backgroundColor: active ? "#C0162C" : "#fff",
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderWidth: 1.25,
        borderColor: active ? "#C0162C" : "#F0C4CC",
      }}
    >
      <Text
        style={{
          color: active ? "#fff" : "#C0162C",
          fontSize: 12,
          fontWeight: "700",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
