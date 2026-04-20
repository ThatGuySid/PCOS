import { View, Text } from "react-native";

type Props = {
  message: string;
  isUser: boolean;
  timestamp?: string;
};

// User bubbles — right aligned, crimson background
// AI bubbles — left aligned, white background
export default function ChatBubble({ message, isUser, timestamp }: Props) {
  return (
    <View
      style={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        maxWidth: "78%",
        marginBottom: 12,
      }}
    >
      <View
        style={{
          backgroundColor: isUser ? "#C0162C" : "#fff",
          borderRadius: 16,
          borderBottomRightRadius: isUser ? 4 : 16,
          borderBottomLeftRadius: isUser ? 16 : 4,
          padding: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
          elevation: 1,
        }}
      >
        <Text
          style={{
            color: isUser ? "#fff" : "#3A1A20",
            fontSize: 14,
            lineHeight: 20,
          }}
        >
          {message}
        </Text>
      </View>

      {/* Timestamp */}
      {timestamp && (
        <Text
          style={{
            color: "#B08890",
            fontSize: 10,
            marginTop: 3,
            alignSelf: isUser ? "flex-end" : "flex-start",
            marginHorizontal: 4,
          }}
        >
          {timestamp}
        </Text>
      )}
    </View>
  );
}
