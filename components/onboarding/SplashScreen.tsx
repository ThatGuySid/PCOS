import { Jua_400Regular, useFonts } from "@expo-google-fonts/jua";
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type Props = {
  onFinish: () => void;
};

// The opening red splash screen — auto-advances after 2.5s
export default function SplashScreen({ onFinish }: Props) {
  const [fontsLoaded] = useFonts({ Jua_400Regular });

  useEffect(() => {
    const timer = setTimeout(onFinish, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      {/* App wordmark */}
      <Text
        style={[
          styles.wordmark,
          fontsLoaded && { fontFamily: "Jua_400Regular" },
        ]}
      >
        herFlow
      </Text>

      <Image
        source={require("@/assets/images/logo1.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C0162C",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
  },
  wordmark: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "700",
  },
  logo: {
    width: 280,
    height: 260,
  },
});
