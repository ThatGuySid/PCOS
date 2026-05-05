import { signUp } from "@/services/authService";
import { createUserProfile } from "@/services/userProfileService";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

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

function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  returnKeyType,
  onSubmitEditing,
  rightIcon,
}: any) {
  return (
    <View style={styles.inputFieldContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#B08890"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize ?? "none"}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          style={styles.inputField}
        />
        {rightIcon}
      </View>
    </View>
  );
}

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await signUp(email.trim(), password);
    setLoading(false);

    if (!result.success) {
      Alert.alert("Sign up failed", result.error);
      return;
    }

    // Create a blank Firestore profile for this new user.
    // Profile-setup.tsx will fill in the rest.
    try {
      await createUserProfile(result.user.uid, {
        name: "",
        avatarIndex: null,
        ageGroup: null,
        bmiHeightCm: null,
        bmiWeightKg: null,
        cycleDay: 1,
        totalCycleDays: 31,
        cyclePhase: "Menstrual",
        periodLengthDays: 5,
        cycleRegularity: null,
        flowIntensity: null,
        periodStartDateKey: null,
        periodEndDateKey: null,
        ovulationDateKey: null,
        selectedPeriodDate: null,
        periodDateKeys: [],
        periodEntries: [],
        symptoms: [],
        symptomLogs: [],
        profileComplete: false,
        hasStartedJourney: false,
      });
    } catch {
      // Non-fatal: the profile will be created lazily on next sign-in.
    }

    router.replace("/profile-setup");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoWrap}>
          <PixelHeart />
          <Text style={styles.title}>herFlow</Text>
          <Text style={styles.subtitle}>Your personal cycle companion</Text>
        </View>

        {/* Email */}
        <InputField
          label="Email"
          placeholder="your@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
        />

        {/* Password */}
        <InputField
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          returnKeyType="next"
          rightIcon={
            <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
              <Text style={{ fontSize: 16 }}>{showPassword ? "🙈" : "🔒"}</Text>
            </TouchableOpacity>
          }
        />

        {/* Confirm password */}
        <InputField
          label="Confirm Password"
          placeholder="••••••••"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirm}
          autoCapitalize="none"
          returnKeyType="done"
          onSubmitEditing={handleSignup}
          rightIcon={
            <TouchableOpacity onPress={() => setShowConfirm((v) => !v)}>
              <Text style={{ fontSize: 16 }}>{showConfirm ? "🙈" : "🔒"}</Text>
            </TouchableOpacity>
          }
        />

        {/* Sign up button */}
        <TouchableOpacity
          onPress={handleSignup}
          activeOpacity={0.85}
          disabled={loading}
          style={[styles.signupButton, loading && { opacity: 0.7 }]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signupButtonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* Log in link */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace("/login")}>
            <Text style={styles.footerLink}>Log In</Text>
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
    color: "#C0162C",
    fontSize: 32,
    fontWeight: "700",
    marginTop: 8,
  },
  subtitle: {
    color: "#8C5F66",
    fontSize: 13,
    marginTop: 6,
  },
  inputFieldContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: "#3A1A20",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2D0D5",
    borderRadius: 50,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  inputField: {
    flex: 1,
    fontSize: 14,
    color: "#3A1A20",
  },
  signupButton: {
    backgroundColor: "#C0162C",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    color: "#8C5F66",
    fontSize: 13,
  },
  footerLink: {
    color: "#C0162C",
    fontSize: 13,
    fontWeight: "700",
  },
});
