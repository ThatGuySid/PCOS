import { ReactNode } from "react";
import { Text, View } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
  icon?: string;
  children: ReactNode;
};

export default function TrackerSection({
  title,
  subtitle,
  icon = "•",
  children,
}: Props) {
  return (
    <View
      style={{
        backgroundColor: "#FAF4EB",
        borderRadius: 24,
        padding: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#F3D7DD",
        shadowColor: "#C0162C",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 18,
        elevation: 4,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: "#FBE2E6",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#C0162C", fontSize: 16, fontWeight: "800" }}>
            {icon}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#3A0A12", fontSize: 16, fontWeight: "800" }}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={{ color: "#9A6070", fontSize: 12, marginTop: 2 }}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
      {children}
    </View>
  );
}
