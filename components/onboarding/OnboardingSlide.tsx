import { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

type Props = {
  title: string;
  description: string;
  buttonLabel: string;
  onContinue: () => void;
  onSkip?: () => void;
  isLast?: boolean;
  slideIndex?: number;
};

const SLIDE_DATA = [
  { emoji: "🗓️", accent: "#C0162C", bg: "#FEF4F5", decorColor: "#F4A0B0" },
  { emoji: "✨", accent: "#9B1B8E", bg: "#FDF0FC", decorColor: "#DDA0D8" },
  { emoji: "🤖", accent: "#1B5EA0", bg: "#F0F4FE", decorColor: "#A0B8F4" },
];

function FloatingPetal({
  delay,
  x,
  y,
  size,
  color,
}: {
  delay: number;
  x: number;
  y: number;
  size: number;
  color: string;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 3000 + delay * 500,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 3000 + delay * 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -16],
  });
  const opacity = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.12, 0.22, 0.12],
  });
  return (
    <Animated.View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity,
        transform: [{ translateY }],
      }}
    />
  );
}

export default function OnboardingSlide({
  title,
  description,
  buttonLabel,
  onContinue,
  onSkip,
  isLast = false,
  slideIndex = 0,
}: Props) {
  const slide = SLIDE_DATA[slideIndex] ?? SLIDE_DATA[0];

  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideIndex]);

  const btnScale = useRef(new Animated.Value(1)).current;
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(btnScale, {
        toValue: 0.94,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(btnScale, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start(onContinue);
  };

  return (
    <View style={{ flex: 1, backgroundColor: slide.bg }}>
      {/* Floating petals */}
      <FloatingPetal
        delay={0}
        x={30}
        y={80}
        size={120}
        color={slide.decorColor}
      />
      <FloatingPetal
        delay={1}
        x={width - 100}
        y={60}
        size={180}
        color={slide.decorColor}
      />
      <FloatingPetal
        delay={2}
        x={width / 2 - 60}
        y={height * 0.15}
        size={100}
        color={slide.decorColor}
      />
      <FloatingPetal
        delay={0.5}
        x={20}
        y={height * 0.6}
        size={80}
        color={slide.decorColor}
      />
      <FloatingPetal
        delay={1.5}
        x={width - 60}
        y={height * 0.55}
        size={90}
        color={slide.decorColor}
      />

      {/* Skip */}
      {!isLast && onSkip && (
        <TouchableOpacity
          onPress={onSkip}
          style={{ position: "absolute", top: 56, right: 28, zIndex: 10 }}
        >
          <Text
            style={{
              color: slide.accent,
              fontSize: 13,
              fontWeight: "600",
              opacity: 0.7,
            }}
          >
            Skip
          </Text>
        </TouchableOpacity>
      )}

      {/* Content */}
      <Animated.View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 36,
          opacity: fadeIn,
          transform: [{ translateY: slideUp }],
        }}
      >
        {/* Big emoji icon */}
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 40,
            backgroundColor: slide.accent,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
            shadowColor: slide.accent,
            shadowOffset: { width: 0, height: 16 },
            shadowOpacity: 0.35,
            shadowRadius: 28,
            elevation: 14,
          }}
        >
          <Text style={{ fontSize: 52 }}>{slide.emoji}</Text>
        </View>

        <Text
          style={{
            color: slide.accent,
            fontSize: 28,
            fontWeight: "900",
            textAlign: "center",
            letterSpacing: -0.5,
            lineHeight: 34,
            marginBottom: 16,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            color: "#7A5060",
            fontSize: 16,
            textAlign: "center",
            lineHeight: 26,
            marginBottom: 60,
          }}
        >
          {description}
        </Text>

        {/* Button */}
        <Animated.View
          style={{ transform: [{ scale: btnScale }], width: "100%" }}
        >
          <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.9}
            style={{
              backgroundColor: slide.accent,
              borderRadius: 20,
              paddingVertical: 20,
              alignItems: "center",
              shadowColor: slide.accent,
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.4,
              shadowRadius: 20,
              elevation: 12,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 15,
                fontWeight: "800",
                letterSpacing: 1.2,
                textTransform: "uppercase",
              }}
            >
              {buttonLabel}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Step dots */}
        <View style={{ flexDirection: "row", gap: 8, marginTop: 28 }}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={{
                width: i === slideIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor:
                  i === slideIndex ? slide.accent : slide.decorColor,
                opacity: i === slideIndex ? 1 : 0.5,
              }}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}
