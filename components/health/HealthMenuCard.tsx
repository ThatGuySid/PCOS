import { TouchableOpacity, View, Text } from "react-native";

type Props = {
  icon: string;
  iconBg: string;
  title: string;
  subtitle: string;
  onPress: () => void;
};

// Each card on the Health menu — icon left, text middle, arrow right
export default function HealthMenuCard({
  icon,
  iconBg,
  title,
  subtitle,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        backgroundColor: "#FDE8C8",
        borderRadius: 18,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        marginBottom: 14,
      }}
    >
      {/* Icon circle */}
      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: 23,
          backgroundColor: iconBg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 22 }}>{icon}</Text>
      </View>

      {/* Text */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: "#3A1A20",
            fontSize: 15,
            fontWeight: "700",
            marginBottom: 2,
          }}
        >
          {title}
        </Text>
        <Text style={{ color: "#8C5F66", fontSize: 12, lineHeight: 16 }}>
          {subtitle}
        </Text>
      </View>

      {/* Arrow */}
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#C0162C", fontSize: 14, fontWeight: "700" }}>
          ›
        </Text>
      </View>
    </TouchableOpacity>
  );
}
