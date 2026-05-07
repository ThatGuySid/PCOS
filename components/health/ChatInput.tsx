import { Text, TextInput, TouchableOpacity, View } from "react-native";

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
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Ask me anything..."
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
          borderWidth: 1.5,
          borderColor: "#EAB4BD",
        }}
      />

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
