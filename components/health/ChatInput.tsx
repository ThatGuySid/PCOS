import { View, TextInput, TouchableOpacity, Text } from "react-native";

type Props = {
  value: string;
  onChange: (text: string) => void;
  onSend: () => void;
};

export default function ChatInput({ value, onChange, onSend }: Props) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#FDF0F2",
        borderTopWidth: 1,
        borderTopColor: "#F2D0D5",
      }}
    >
      {/* Mic button */}
      <TouchableOpacity
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
          backgroundColor: "#C0162C",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 18 }}>🎙️</Text>
      </TouchableOpacity>

      {/* Text input */}
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Type a message..."
        placeholderTextColor="#B08890"
        returnKeyType="send"
        onSubmitEditing={onSend}
        style={{
          flex: 1,
          backgroundColor: "#fff",
          borderRadius: 50,
          paddingVertical: 10,
          paddingHorizontal: 16,
          fontSize: 14,
          color: "#3A1A20",
          borderWidth: 1,
          borderColor: "#F2D0D5",
        }}
      />

      {/* Send button */}
      <TouchableOpacity
        onPress={onSend}
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
          backgroundColor: "#C0162C",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 18 }}>➤</Text>
      </TouchableOpacity>
    </View>
  );
}
