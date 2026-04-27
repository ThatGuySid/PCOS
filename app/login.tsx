import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function Orb({
  size,
  color,
  style,
}: {
  size: number;
  color: string;
  style?: object;
}) {
  return (
    <View
      pointerEvents="none"
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          position: "absolute",
          opacity: 0.15,
        },
        style,
      ]}
    />
  );
}

function FloatingInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
}: any) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text
        style={{
          color: "#9A6070",
          fontSize: 11,
          fontWeight: "700",
          letterSpacing: 1.5,
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          borderRadius: 16,
          borderWidth: 1.5,
          borderColor: "#EAB4BD",
          backgroundColor: "#fff",
          paddingHorizontal: 18,
          paddingVertical: 14,
          shadowColor: "transparent",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 10,
          elevation: 0,
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#D9A0AC"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize ?? "none"}
          autoCorrect={false}
          underlineColorAndroid="transparent"
          style={{ color: "#3A0A12", fontSize: 15, fontWeight: "500" }}
        />
      </View>
    </View>
  );
}

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
    <View style={{ alignItems: "center", marginBottom: 8 }}>
      {grid.map((row, ri) => (
        <View key={ri} style={{ flexDirection: "row" }}>
          {row.map((cell, ci) => (
            <View
              key={ci}
              style={{
                width: 9,
                height: 9,
                backgroundColor: cell ? "#C0162C" : "transparent",
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const btnScale = useState(new Animated.Value(1))[0];

  const handleLogin = () => {
    if (!email || !pass) {
      Alert.alert("Missing fields", "Please enter your email and password.");
      return;
    }

    Animated.sequence([
      Animated.timing(btnScale, {
        toValue: 0.96,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(btnScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => router.replace("/profile-setup"));
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Orb size={300} color="#E8556A" style={{ top: -120, right: -100 }} />
      <Orb size={200} color="#F4A0B0" style={{ bottom: 100, left: -80 }} />
      <Orb size={120} color="#C0162C" style={{ bottom: 300, right: -30 }} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoWrap}>
          <PixelHeart />
          <Text style={styles.title}>herFlow</Text>
          <Text style={styles.subtitle}>Your personal cycle companion</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome back</Text>
          <FloatingInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            keyboardType="email-address"
          />
          <FloatingInput
            label="Password"
            value={pass}
            onChangeText={setPass}
            placeholder="••••••••"
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() =>
              Alert.alert("Coming soon", "Password reset is not set up yet.")
            }
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              onPress={handleLogin}
              activeOpacity={0.9}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>Sign In →</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>New here? </Text>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={styles.footerLink}>Create account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const COLORS = {
  crimson: "#C0162C",
  blush: "#F7DDE0",
  offWhite: "#FBF5F5",
  text: "#3A1A20",
  mutedText: "#8C5F66",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEF4F5",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 60,
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    color: COLORS.crimson,
    fontSize: 32,
    fontWeight: "700",
    fontFamily: "serif",
  },
  subtitle: {
    color: COLORS.mutedText,
    fontSize: 14,
    marginTop: 6,
    letterSpacing: 0.3,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 24,
    shadowColor: COLORS.crimson,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
    marginBottom: 24,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 22,
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -4,
    marginBottom: 20,
  },
  forgotText: {
    color: COLORS.crimson,
    fontSize: 12,
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: COLORS.crimson,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: COLORS.crimson,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  footerText: {
    color: COLORS.mutedText,
    fontSize: 14,
  },
  footerLink: {
    color: COLORS.crimson,
    fontSize: 14,
    fontWeight: "700",
  },
});
