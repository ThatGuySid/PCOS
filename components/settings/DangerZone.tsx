import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onResetAllData: () => void;
};

export default function DangerZone({ onResetAllData }: Props) {
  const handleReset = () => {
    if (Platform.OS === "web") {
      // Use browser confirm on web
      const confirmed = confirm(
        "Delete Account?\n\nThis will permanently delete your saved data and your account login. You can sign up again with the same email afterward.",
      );
      if (confirmed) {
        onResetAllData();
      }
    } else {
      // Use native Alert on mobile
      Alert.alert(
        "Delete Account",
        "This will permanently delete your saved data and your account login. You can sign up again with the same email afterward.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
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
        Deleting will permanently erase your saved data and remove the account
        login. You can create a new account with the same email later.
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
          🗑 Delete Account & Data
        </Text>
      </TouchableOpacity>
    </View>
  );
}
