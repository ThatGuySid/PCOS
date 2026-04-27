import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
    <View className="mb-4">
      <Text className="text-[#3A1A20] text-sm font-semibold mb-1.5 ml-1">
        {label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#F2D0D5",
          borderRadius: 50,
          paddingHorizontal: 18,
          paddingVertical: 14,
        }}
      >
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
          style={{
            flex: 1,
            fontSize: 14,
            color: "#3A1A20",
          }}
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignup = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }

    router.replace("/profile-setup");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#FDF0F2]"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 28,
          paddingVertical: 60,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View className="items-center mb-12">
          <PixelHeart />
          <Text
            style={{
              color: "#C0162C",
              fontSize: 32,
              fontWeight: "700",
              fontFamily: "serif",
              letterSpacing: -1,
            }}
          >
            herFlow
          </Text>
          <Text className="text-[#8C5F66] text-sm mt-1.5">
            Your personal cycle companion
          </Text>
        </View>

        {/* Name */}
        <InputField
          label="Name"
          placeholder="Your full name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          returnKeyType="next"
        />

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
          className="bg-[#C0162C] rounded-full py-4 items-center mt-4"
        >
          <Text className="text-white font-bold text-base tracking-wide">
            Sign Up
          </Text>
        </TouchableOpacity>

        {/* Log in link */}
        <View className="flex-row justify-center mt-5">
          <Text className="text-[#8C5F66] text-sm">
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.replace("/login")}>
            <Text className="text-[#C0162C] text-sm font-bold">Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
