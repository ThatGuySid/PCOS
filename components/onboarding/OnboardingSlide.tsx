import { StyleSheet, Text, View } from "react-native";
import ContinueButton from "./ContinueButton";

type Props = {
  title: string;
  description: string;
  buttonLabel: string;
  onContinue: () => void;
  onSkip?: () => void; // optional — hidden on last slide
  isLast?: boolean;
};

export default function OnboardingSlide({
  title,
  description,
  buttonLabel,
  onContinue,
  onSkip,
  isLast = false,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Background dot pattern overlay */}
      <View style={styles.dotOverlay}>
        {/* Repeating decorative pattern — using a simple dot grid via absolute positioned views */}
        {Array.from({ length: 12 }).map((_, row) =>
          Array.from({ length: 8 }).map((__, col) => (
            <View
              key={`${row}-${col}`}
              style={[styles.dot, { top: row * 60 + 20, left: col * 48 + 16 }]}
            />
          )),
        )}
      </View>

      {/* Top spacer */}
      <View style={styles.flexSpacer} />

      {/* Pixel Heart */}
      <View style={styles.heartWrap}>
        {/* Pixel heart rendered as a grid of colored squares */}
        <View>
          {[
            [0, 1, 1, 0, 1, 1, 0],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1, 0],
            [0, 0, 1, 1, 1, 0, 0],
            [0, 0, 0, 1, 0, 0, 0],
          ].map((row, ri) => (
            <View key={ri} style={styles.pixelRow}>
              {row.map((cell, ci) => (
                <View
                  key={ci}
                  style={{
                    width: 8,
                    height: 8,
                    backgroundColor: cell ? "#C0162C" : "transparent",
                  }}
                />
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Description */}
      <Text style={styles.description}>{description}</Text>

      {/* Button */}
      <ContinueButton label={buttonLabel} onPress={onContinue} />

      {/* Skip — hidden on last slide */}
      {!isLast && onSkip && (
        <Text onPress={onSkip} style={styles.skip}>
          Skip
        </Text>
      )}

      {/* Bottom spacer */}
      <View style={styles.flexSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7DDE0",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  dotOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2,
  },
  dot: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: "#E8A0A8",
  },
  flexSpacer: {
    flex: 1,
  },
  heartWrap: {
    alignItems: "center",
    marginBottom: 24,
  },
  pixelRow: {
    flexDirection: "row",
  },
  title: {
    color: "#C0162C",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    color: "#8C5F66",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  skip: {
    color: "#B08890",
    fontSize: 14,
    marginTop: 16,
  },
});
