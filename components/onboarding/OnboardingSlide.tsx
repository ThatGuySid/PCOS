import { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import SkipButton from "./SkipButton";

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
  { bg: "#FAD7DA", accent: "#D62E45", decorColor: "#F3B7BF" },
  { bg: "#FAD7DA", accent: "#D62E45", decorColor: "#F3B7BF" },
  { bg: "#FAD7DA", accent: "#D62E45", decorColor: "#F3B7BF" },
];

function PatternMark({
  x,
  y,
  rotate = "0deg",
}: {
  x: number;
  y: number;
  rotate?: string;
}) {
  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 18,
        height: 18,
        opacity: 0.28,
        transform: [{ rotate }],
      }}
    >
      <View
        style={{
          position: "absolute",
          width: 7,
          height: 7,
          borderRadius: 4,
          borderWidth: 1,
          borderColor: "#E7A4AE",
          top: 0,
          left: 6,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: 7,
          height: 7,
          borderRadius: 4,
          borderWidth: 1,
          borderColor: "#E7A4AE",
          top: 6,
          left: 0,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: 7,
          height: 7,
          borderRadius: 4,
          borderWidth: 1,
          borderColor: "#E7A4AE",
          top: 6,
          left: 12,
        }}
      />
    </View>
  );
}

const HEART_SVG = `<svg width="82" height="67" viewBox="0 0 82 67" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><rect width="82" height="67" fill="url(#pattern0_121_57)"/><defs><pattern id="pattern0_121_57" patternContentUnits="objectBoundingBox" width="1" height="1"><use xlink:href="#image0_121_57" transform="matrix(0.00817073 0 0 0.01 0.0914634 0)"/></pattern><image id="image0_121_57" width="100" height="100" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAACJUlEQVR4nO2bMWocMRSGdYAUaQyGrN66NkTvAi5yDJc+Sg7gQ6R0kUPkJhuYF8YGFz6AwUFOt5kJSVCif7TfB1+1ePZJH4ZZRpMSAAAAAAAAAAAAAABsgYezyzeR/aaF33K5ajVXvVarueoa01aY934R5i8tnKx8ajVXvVarueoa01YgiBgEEYMgYhCkE/VOow527OvdTKOFR/bPS98xvXu/W5urfrb0N/Vareaqa1z6jq53X6+3gK02/k//c3L5ujZX/azXXHVPUi8I4gQJgqxDECdIEGQdgnifIFP227rIn7Ty2C2IlefFmX7M9dxxrsflufw2Kf6gOlWnhj9wCWIEeRlNgpiWBDEtCWJaEsS0JIhpSRDTkiCmJUFMS4KYlgQxLQliWhLEtCSIaUkQ05IgpiVBTEuCmJYEsYGDKB4DClVP9VxWqEoQ15IgriVBXEuCuJY9gxz2l+fT3j8cG7ty3X1j7B+7K9dLa697kkZ+6TNElXzpcw2CiEEQMQgiBkHEOOz97ZT945KRy1PvzYzfNZentXXUNaYR6Pr+n7V7j3EYCCIGQcQgiBgEEWMyvwsrX46dst/32/j63Qszmd+lU6Xnc/vpfzzv3hoEEYMgYhBEDIKIQZCNEC2f2/d83j0KQRAtgiBaBEG0CIJoEQTR4vA3h/G2dIhtFOZfHKTY1AGEUZgJosVMEC1mgmgxE2Q7h/EOoxxiAwAAAAAAAAAASLp8Bzs/UbBkrevkAAAAAElFTkSuQmCC"/></defs></svg>`;

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
    <ImageBackground
      source={require("@/assets/images/onboarding backgroud.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
      imageStyle={{ opacity: 1 }}
    >
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "rgba(250, 215, 218, 0.22)",
        }}
      />

      {/* Content */}
      <Animated.View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 32,
          paddingTop: 46,
          opacity: fadeIn,
          transform: [{ translateY: slideUp }],
        }}
      >
        {/* Heart icon */}
        <View
          style={{
            width: 82,
            height: 67,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 28,
          }}
        >
          <SvgXml xml={HEART_SVG} width={82} height={67} />
        </View>

        <Text
          style={{
            color: "#C8233C",
            fontSize: 23,
            fontWeight: "800",
            textAlign: "center",
            letterSpacing: -0.3,
            lineHeight: 28,
            marginBottom: 10,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            color: "#7B646A",
            fontSize: 13,
            textAlign: "center",
            lineHeight: 18,
            maxWidth: 240,
            marginBottom: 34,
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
              backgroundColor: "#D76D7F",
              borderRadius: 18,
              paddingVertical: 16,
              paddingHorizontal: 22,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 10,
              shadowColor: "#C0162C",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.22,
              shadowRadius: 16,
              elevation: 6,
              minWidth: 180,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 15,
                fontWeight: "700",
              }}
            >
              {buttonLabel}
            </Text>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>
              →
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {!isLast && onSkip && <SkipButton onPress={onSkip} />}
      </Animated.View>
    </ImageBackground>
  );
}
