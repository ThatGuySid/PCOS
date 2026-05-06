import { logIn, resetPassword } from "@/services/authService";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
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
  const [loading, setLoading] = useState(false);
  const btnScale = useState(new Animated.Value(1))[0];

  const handleSignup = () => router.push("/signup");

  const handleLoginPress = async () => {
    if (!email.trim() || !pass) {
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
    ]).start();

    setLoading(true);
    const result = await logIn(email.trim(), pass);
    setLoading(false);

    if (result.success) {
      router.replace("/(tabs)");
    } else {
      Alert.alert("Login failed", result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
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
            onPress={async () => {
              if (!email.trim()) {
                Alert.alert(
                  "Enter your email",
                  "Please enter your email address above first, then tap 'Forgot password?'",
                );
                return;
              }
              setLoading(true);
              const result = await resetPassword(email.trim());
              setLoading(false);
              if (result.success) {
                Alert.alert(
                  "Email sent",
                  "Check your inbox for a password reset link.",
                );
              } else {
                Alert.alert("Error", result.error);
              }
            }}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              onPress={handleLoginPress}
              activeOpacity={0.9}
              disabled={loading}
              style={[styles.loginButton, loading && { opacity: 0.7 }]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In →</Text>
              )}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF0F2",
    position: "relative",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 50,
    alignItems: "center",
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#C0162C",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 13,
    color: "#9A6070",
    marginTop: 4,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3A0A12",
    marginBottom: 20,
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginTop: 8,
    marginBottom: 20,
  },
  forgotText: {
    fontSize: 12,
    color: "#C0162C",
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: "#C0162C",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
    color: "#9A6070",
  },
  footerLink: {
    fontSize: 13,
    color: "#C0162C",
    fontWeight: "700",
  },
});
