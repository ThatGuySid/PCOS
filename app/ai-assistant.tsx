import ChatBubble from "@/components/health/ChatBubble";
import ChatInput from "@/components/health/ChatInput";
import QuickQuestions from "@/components/health/QuickQuestions";
import { useUser } from "@/context/UserContext";
import {
    buildAIContext,
    generateAssistantResponse,
} from "@/services/aiservice";
import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
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
  const { livePhase, liveCycleDay, user, recentSymptoms, cycleSnapshot } =
    useUser();

  const aiContext = useMemo(
    () =>
      buildAIContext({
        phase: livePhase,
        cycleDay: liveCycleDay,
        totalCycleDays: user.totalCycleDays,
        periodLengthDays: user.periodLengthDays,
        cycleRegularity: user.cycleRegularity,
        flowIntensity: user.flowIntensity,
        nextPeriodWindow: cycleSnapshot.nextPeriodWindow,
        recentSymptoms,
        symptomLogs: user.symptomLogs,
        periodEntries: user.periodEntries,
      }),
    [
      livePhase,
      liveCycleDay,
      user.totalCycleDays,
      user.periodLengthDays,
      user.cycleRegularity,
      user.flowIntensity,
      cycleSnapshot.nextPeriodWindow,
      recentSymptoms,
      user.symptomLogs,
      user.periodEntries,
    ],
  );

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      text: aiContext.phase
        ? `I’m here with your ${aiContext.phase.toLowerCase()} phase context. Ask me about food, workouts, symptoms, or cycle timing.`
        : "I don’t have enough cycle data yet to personalise answers. Log a period start and a few symptoms, and I’ll be able to guide you better.",
      isUser: false,
      timestamp: "",
    },
  ]);

  const sendMessage = async (text: string) => {
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
      text: (await generateAssistantResponse(aiContext, trimmed)).response,
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
          onSelect={(q) => {
            void sendMessage(q);
          }}
        />
      </ScrollView>

      {/* Input row */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={() => {
          void sendMessage(input);
        }}
      />
    </KeyboardAvoidingView>
  );
}
