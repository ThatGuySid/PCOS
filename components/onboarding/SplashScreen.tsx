import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  onFinish: () => void;
};

// The opening red splash screen — auto-advances after 2.5s
export default function SplashScreen({ onFinish }: Props) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      {/* App wordmark */}
      <Text style={[styles.wordmark, { fontFamily: "serif" }]}>herFlow</Text>

      {/* Illustration placeholder — sanitary pad + drop character */}
      {/* Replace with your actual asset from assets/images/ */}
      <View style={styles.illustrationWrap}>
        {/* Pad shape */}
        <View style={styles.padShape}>
          {/* Drop figure */}
          <View style={styles.dropFigure}>
            <View style={styles.dropInner} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C0162C",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  wordmark: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "700",
  },
  illustrationWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: 160,
    height: 128,
  },
  padShape: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 24,
    width: 128,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  dropFigure: {
    backgroundColor: "rgba(255,255,255,0.7)",
    width: 40,
    height: 48,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  dropInner: {
    backgroundColor: "rgba(192,22,44,0.6)",
    width: 16,
    height: 20,
    borderRadius: 999,
    marginTop: 8,
  },
});
