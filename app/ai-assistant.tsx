import ChatBubble from "@/components/health/ChatBubble";
import ChatInput from "@/components/health/ChatInput";
import QuickQuestions from "@/components/health/QuickQuestions";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// ── Types ─────────────────────────────────────────────────────────────────────
type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
};

// ── Mocked AI responses ────────────────────────────────────────────────────────
// Replace this function body with a real API call when ready
const getMockedResponse = (userMessage: string): string => {
  const msg = userMessage.toLowerCase();

  if (msg.includes("symptom") || msg.includes("pcos symptom")) {
    return "PCOS (Polycystic Ovary Syndrome) and PCOD (Polycystic Ovary Disease) commonly present with irregular or missed periods, excessive facial/body hair growth (hirsutism), acne, weight gain, and difficulty conceiving.";
  }
  if (
    msg.includes("weight") ||
    msg.includes("loose weight") ||
    msg.includes("lose weight")
  ) {
    return "For PCOS-related weight management, focus on a low-glycemic diet, regular low-impact exercise like yoga or walking, stress reduction, and adequate sleep. Always consult your doctor before starting any new regimen.";
  }
  if (msg.includes("irregular period") || msg.includes("irregular")) {
    return "Irregular periods with PCOS are common due to hormonal imbalances. Tracking your cycle, maintaining a healthy lifestyle, and speaking with your gynecologist about hormonal support can help regulate your cycle.";
  }
  if (msg.includes("diet") || msg.includes("food") || msg.includes("eat")) {
    return "A PCOS-friendly diet includes whole grains, lean proteins, leafy greens, and healthy fats. Reduce processed sugars and refined carbs which can worsen insulin resistance common in PCOS.";
  }
  if (msg.includes("exercise") || msg.includes("workout")) {
    return "Low to moderate intensity exercise works best for PCOS — yoga, walking, swimming, and strength training help regulate hormones and improve insulin sensitivity without overstraining your body.";
  }

  return "That's a great question! For personalized advice on PCOS/PCOD management, I recommend discussing this with your healthcare provider. Is there something specific about symptoms, diet, or lifestyle I can help clarify?";
};

const QUICK_QUESTIONS = [
  "How to lose weight with PCOS?",
  "Irregular periods",
  "PCOS diet tips",
  "Best exercises for PCOS",
];

const getTimestamp = () => {
  const now = new Date();
  return `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")} ${now.getHours() >= 12 ? "pm" : "am"}`;
};

// ── Screen ─────────────────────────────────────────────────────────────────────
export default function AIAssistantScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      text: 'Hi, I\'m Your Health Assistant!\nYou can call me "buddy".\nHow may I help you?',
      isUser: false,
      timestamp: "",
    },
  ]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: trimmed,
      isUser: true,
      timestamp: getTimestamp(),
    };

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: getMockedResponse(trimmed),
      isUser: false,
      timestamp: "",
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput("");

    // Scroll to bottom after messages update
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F7C5CC" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Back + title */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          padding: 24,
          paddingTop: 56,
          paddingBottom: 12,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: "#C0162C", fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={{ color: "#C0162C", fontSize: 17, fontWeight: "700" }}>
          AI Assistant
        </Text>
      </View>

      {/* AI identity card */}
      <View
        style={{
          marginHorizontal: 20,
          marginBottom: 12,
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 14,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          shadowColor: "#C0162C",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.07,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <Image
          source={require("@/assets/images/chatAI.png")}
          resizeMode="contain"
          style={{ width: 48, height: 48 }}
        />

        <View>
          <Text style={{ color: "#3A1A20", fontSize: 15, fontWeight: "800" }}>
            AI Health Assistant
          </Text>
          <Text style={{ color: "#C0162C", fontSize: 12 }}>
            Free AI•PCOS/PCOD Expert
          </Text>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg.text}
            isUser={msg.isUser}
            timestamp={msg.timestamp}
          />
        ))}

        {/* Quick questions — shown below last AI message */}
        <QuickQuestions
          questions={QUICK_QUESTIONS}
          onSelect={(q) => sendMessage(q)}
        />
      </ScrollView>

      {/* Input row */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={() => sendMessage(input)}
      />
    </KeyboardAvoidingView>
  );
}
