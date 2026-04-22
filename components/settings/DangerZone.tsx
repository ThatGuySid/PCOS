import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onResetAllData: () => void;
};

export default function DangerZone({ onResetAllData }: Props) {
  const handleReset = () => {
    if (Platform.OS === "web") {
      // Use browser confirm on web
      const confirmed = confirm(
        "Reset All Data?\n\nThis will permanently delete all your period logs, symptom history, and profile settings. This cannot be undone.",
      );
      if (confirmed) {
        onResetAllData();
      }
    } else {
      // Use native Alert on mobile
      Alert.alert(
        "Reset All Data",
        "This will permanently delete all your period logs, symptom history, and profile settings. This cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Reset",
            style: "destructive",
            onPress: onResetAllData,
          },
        ],
      );
    }
  };

  return (
    <View
      style={{
        backgroundColor: "#FFF1F2",
        borderRadius: 18,
        padding: 18,
        borderWidth: 1.5,
        borderColor: "#FCA5A5",
      }}
    >
      <Text
        style={{
          color: "#C0162C",
          fontSize: 15,
          fontWeight: "800",
          marginBottom: 6,
        }}
      >
        Danger Zone
      </Text>
      <Text
        style={{
          color: "#8C5F66",
          fontSize: 12,
          marginBottom: 14,
          lineHeight: 18,
        }}
      >
        Resetting will permanently erase all your data — period logs, symptom
        history, and profile info. You'll start fresh.
      </Text>
      <TouchableOpacity
        onPress={handleReset}
        activeOpacity={0.85}
        style={{
          backgroundColor: "#C0162C",
          borderRadius: 12,
          paddingVertical: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}>
          🗑 Reset All Data
        </Text>
      </TouchableOpacity>
    </View>
  );
}
