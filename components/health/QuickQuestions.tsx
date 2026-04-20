import { View, Text, TouchableOpacity, ScrollView } from "react-native";

type Props = {
  questions: string[];
  onSelect: (q: string) => void;
};

export default function QuickQuestions({ questions, onSelect }: Props) {
  return (
    <View style={{ marginBottom: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <Text style={{ fontSize: 14 }}>💡</Text>
        <Text style={{ color: "#8C5F66", fontSize: 13, fontWeight: "600" }}>
          Quick Questions:
        </Text>
      </View>

      {/* Horizontally scrollable pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {questions.map((q) => (
            <TouchableOpacity
              key={q}
              onPress={() => onSelect(q)}
              activeOpacity={0.8}
              style={{
                backgroundColor: "#fff",
                borderRadius: 50,
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderWidth: 1.5,
                borderColor: "#E8A0A8",
              }}
            >
              <Text style={{ color: "#C0162C", fontSize: 13, fontWeight: "500" }}>
                {q}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
