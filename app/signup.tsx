import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
    Alert,
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
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
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          position: "absolute",
          opacity: 0.14,
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
  rightIcon,
}: any) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          color: focused ? "#C0162C" : "#9A6070",
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
          borderColor: focused ? "#C0162C" : "#EAB4BD",
          backgroundColor: focused ? "#FFF5F6" : "#fff",
          paddingHorizontal: 18,
          paddingVertical: 14,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: focused ? "#C0162C" : "transparent",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 10,
          elevation: focused ? 4 : 0,
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
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ flex: 1, color: "#3A0A12", fontSize: 15, fontWeight: "500" }}
        />
        {rightIcon}
      </View>
    </View>
  );
}

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const btnScale = useRef(new Animated.Value(1)).current;

  const handleSignup = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Passwords do not match.");
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#FEF4F5" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Orb size={260} color="#E8556A" style={{ top: -100, right: -80 }} />
      <Orb size={180} color="#C0162C" style={{ bottom: 120, left: -60 }} />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 28,
          paddingTop: 64,
          paddingBottom: 48,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ marginBottom: 36 }}>
          <Text
            style={{
              color: "#C0162C",
              fontSize: 11,
              fontWeight: "700",
              letterSpacing: 3,
              textTransform: "uppercase",
              opacity: 0.6,
              marginBottom: 8,
            }}
          >
            Join HerFlow
          </Text>
          <Text
            style={{
              color: "#3A0A12",
              fontSize: 32,
              fontWeight: "900",
              lineHeight: 38,
              letterSpacing: -0.5,
            }}
          >
            Start your{"\n"}
            <Text style={{ color: "#C0162C" }}>wellness journey.</Text>
          </Text>
        </View>

        {/* Form card */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 28,
            padding: 24,
            shadowColor: "#C0162C",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.08,
            shadowRadius: 24,
            elevation: 6,
            marginBottom: 24,
          }}
        >
          <FloatingInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            autoCapitalize="words"
          />
          <FloatingInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            keyboardType="email-address"
          />
          <FloatingInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry={!showPass}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPass((v) => !v)}>
                <Text style={{ fontSize: 16 }}>{showPass ? "🙈" : "👁️"}</Text>
              </TouchableOpacity>
            }
          />
          <FloatingInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="••••••••"
            secureTextEntry={!showConfirm}
            rightIcon={
              <TouchableOpacity onPress={() => setShowConfirm((v) => !v)}>
                <Text style={{ fontSize: 16 }}>
                  {showConfirm ? "🙈" : "👁️"}
                </Text>
              </TouchableOpacity>
            }
          />

          <Animated.View
            style={{ transform: [{ scale: btnScale }], marginTop: 8 }}
          >
            <TouchableOpacity
              onPress={handleSignup}
              activeOpacity={0.9}
              style={{
                backgroundColor: "#C0162C",
                borderRadius: 18,
                paddingVertical: 18,
                alignItems: "center",
                shadowColor: "#C0162C",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.35,
                shadowRadius: 16,
                elevation: 10,
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
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
                Create Account
              </Text>
              <Text style={{ color: "#fff", fontSize: 16 }}>→</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text style={{ color: "#9A6070", fontSize: 14 }}>
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.replace("/login")}>
            <Text style={{ color: "#C0162C", fontSize: 14, fontWeight: "700" }}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
