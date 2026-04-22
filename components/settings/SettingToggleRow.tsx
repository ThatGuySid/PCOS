import { View, Text, TouchableOpacity, Switch } from "react-native";

type Props =
  | {
      type: "toggle";
      label: string;
      description?: string;
      emoji: string;
      value: boolean;
      onToggle: (value: boolean) => void;
    }
  | {
      type: "button";
      label: string;
      description?: string;
      emoji: string;
      onPress: () => void;
      destructive?: boolean;
    };

export default function SettingToggleRow(props: Props) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#F2D0D5",
        gap: 12,
      }}
    >
      {/* Emoji icon */}
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          backgroundColor: "#FDF0F2",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 18 }}>{props.emoji}</Text>
      </View>

      {/* Label + description */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: props.type === "button" && props.destructive ? "#C0162C" : "#3A1A20",
            fontSize: 14,
            fontWeight: "600",
          }}
        >
          {props.label}
        </Text>
        {props.description && (
          <Text style={{ color: "#8C5F66", fontSize: 12, marginTop: 2 }}>
            {props.description}
          </Text>
        )}
      </View>

      {/* Control */}
      {props.type === "toggle" ? (
        <Switch
          value={props.value}
          onValueChange={props.onToggle}
          trackColor={{ false: "#F2D0D5", true: "#C0162C" }}
          thumbColor="#fff"
        />
      ) : (
        <TouchableOpacity onPress={props.onPress}>
          <Text
            style={{
              color: props.destructive ? "#C0162C" : "#8C5F66",
              fontSize: 13,
              fontWeight: "600",
            }}
          >
            {props.destructive ? "Reset" : "›"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
