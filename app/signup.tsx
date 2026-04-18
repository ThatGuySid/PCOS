import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AuthInput from "@/components/auth/AuthInput";
//import GoogleButton from "@/components/auth/GoogleButton";

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

function OrDivider() {
  return (
    <View className="flex-row items-center my-5">
      <View className="flex-1 h-px bg-[#E8A0A8]" />
      <Text className="mx-4 text-[#B08890] text-sm">or</Text>
      <View className="flex-1 h-px bg-[#E8A0A8]" />
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
    // Hook this into real signup when backend is ready.
    router.replace("/profile-setup");
  };

  const handleGoogleSuccess = (idToken: string) => {
    // Send this token to your auth backend.
    console.log("Google ID token:", idToken);
    router.replace("/profile-setup");
  };

  const handleGoogleError = (error: string) => {
    Alert.alert("Google Sign-In Error", error);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#FDF0F2]"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 28, paddingVertical: 48 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View className="items-center mb-8">
          <PixelHeart />
          <Text
            className="text-[#C0162C] text-3xl font-bold"
            style={{ fontFamily: "serif" }}
          >
            herFlow
          </Text>
          <Text className="text-[#8C5F66] text-sm mt-1">
            Your personal cycle companion
          </Text>
        </View>

        {/* Name */}
        <AuthInput
          label="Name"
          placeholder="Your full name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          returnKeyType="next"
        />

        {/* Email */}
        <AuthInput
          label="Email"
          placeholder="your@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
        />

        {/* Password */}
        <AuthInput
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          returnKeyType="next"
          leftIcon={
            <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
              <Text style={{ fontSize: 16 }}>{showPassword ? "🙈" : "🔒"}</Text>
            </TouchableOpacity>
          }
        />

        {/* Confirm password */}
        <AuthInput
          label="Confirm Password"
          placeholder="••••••••"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirm}
          autoCapitalize="none"
          returnKeyType="done"
          onSubmitEditing={handleSignup}
          leftIcon={
            <TouchableOpacity onPress={() => setShowConfirm((v) => !v)}>
              <Text style={{ fontSize: 16 }}>{showConfirm ? "🙈" : "🔒"}</Text>
            </TouchableOpacity>
          }
        />

        {/* Sign up button */}
        <TouchableOpacity
          onPress={handleSignup}
          activeOpacity={0.85}
          className="bg-[#C0162C] rounded-full py-4 items-center mt-2"
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
