import { Text, View } from "react-native";

type Props = {
  name: string;
};

// ── Pixel heart — consistent with onboarding/login ───────────────────────────
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

// Greeting of the day based on hour
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function GreetingHeader({ name }: Props) {
  return (
    <View className="mb-10 items-center">
      {/* Logo row */}
      <View className="flex-row items-center gap-2 mb-5">
        <PixelHeart />
        <Text
          className="text-[#C0162C] text-2xl font-bold"
          style={{ fontFamily: "serif" }}
        >
          herFlow
        </Text>
      </View>

      {/* Greeting */}
      <Text className="text-[#C0162C] text-2xl font-bold mb-1 text-center">
        {getGreeting()}, {name}! 🌸
      </Text>

      {/* Subtitle */}
      <Text className="text-[#3A1A20] text-sm text-center">
        Ready to take care of your health today?
      </Text>
    </View>
  );
}
