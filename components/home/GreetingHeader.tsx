import { useEffect, useRef, useState } from "react";
import { Animated, AppState, Text, View } from "react-native";

type Props = {
  name?: string;
};

// ── Rotating subtitles ────────────────────────────────────────────────────────
const SUBTITLES = [
  "Ready to take care of your health today?",
  "Your body deserves love and attention. 💕",
  "Small steps every day make a big difference.",
  "You're doing amazing — keep tracking! 🌸",
  "Understanding your cycle is understanding yourself.",
  "Every phase is beautiful. You've got this. ✨",
  "Take a breath. You're right where you need to be.",
];

function PixelHeart() {
  const grid = [
    [0, 1, 1, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
  ];
  return (
    <View>
      {grid.map((row, ri) => (
        <View key={ri} style={{ flexDirection: "row" }}>
          {row.map((cell, ci) => (
            <View
              key={ci}
              style={{
                width: 10,
                height: 10,
                backgroundColor: cell ? "#C0162C" : "transparent",
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

function getGreeting(now: Date) {
  const hour = now.getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function GreetingHeader({ name }: Props) {
  const [now, setNow] = useState(() => new Date());
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Update greeting time every minute and on app resume
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60 * 1000);
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") setNow(new Date());
    });
    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, []);

  // Cycle through subtitles every 5 seconds with a fade transition
  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setSubtitleIndex((i) => (i + 1) % SUBTITLES.length);
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [fadeAnim]);

  return (
    <View style={{ alignItems: "center" }}>
      {/* Logo row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <PixelHeart />
        <Text style={{ color: "#C0162C", fontSize: 24, fontWeight: "700" }}>
          herFlow
        </Text>
      </View>

      {/* Greeting */}
      <Text
        style={{
          color: "#C0162C",
          fontSize: 24,
          fontWeight: "900",
          marginBottom: 6,
          textAlign: "center",
        }}
      >
        {name?.trim()
          ? `${getGreeting(now)}, ${name.trim()}!`
          : `${getGreeting(now)}!`}{" "}
        🌸
      </Text>

      {/* Cycling subtitle */}
      <Animated.Text
        style={{
          opacity: fadeAnim,
          color: "#9A6070",
          fontSize: 14,
          textAlign: "center",
          lineHeight: 20,
        }}
      >
        {SUBTITLES[subtitleIndex]}
      </Animated.Text>
    </View>
  );
}
