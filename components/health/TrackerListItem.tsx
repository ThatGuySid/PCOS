import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  subtitle: string;
  meta: string;
  icon: string;
  iconBg: string;
  accent?: string;
  actionLabel?: string;
  onPress?: () => void;
};

export default function TrackerListItem({
  title,
  subtitle,
  meta,
  icon,
  iconBg,
  accent = "#C0162C",
  actionLabel = "View",
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: "#fff",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#F4D9DF",
        padding: 14,
        marginBottom: 12,
        shadowColor: "#C0162C",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            backgroundColor: iconBg,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 18 }}>{icon}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ color: "#3A0A12", fontSize: 15, fontWeight: "800" }}>
            {title}
          </Text>
          <Text style={{ color: "#9A6070", fontSize: 12, marginTop: 2 }}>
            {subtitle}
          </Text>
          <Text style={{ color: "#C88A96", fontSize: 11, marginTop: 4 }}>
            {meta}
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              backgroundColor: "#FDE8EC",
              borderRadius: 999,
              paddingHorizontal: 12,
              paddingVertical: 7,
            }}
          >
            <Text style={{ color: accent, fontSize: 12, fontWeight: "800" }}>
              {actionLabel}
            </Text>
          </View>
          <Text style={{ color: accent, fontSize: 18, fontWeight: "900" }}>
            ›
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
