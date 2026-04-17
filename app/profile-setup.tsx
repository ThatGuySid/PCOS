import { useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import AgeGroupPicker from "@/components/profile-setup/AgeGroupPicker";
import AvatarPicker from "@/components/profile-setup/AvatarPicker";
import BMIInputs from "@/components/profile-setup/BMIInputs";

type ActiveBMIField = "height" | "weight" | null;

export default function ProfileSetupPage() {
  const router = useRouter();

  // ── State ──────────────────────────────────────────────
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [bmi, setBmi] = useState({ height: "", weight: "" });
  const [activeBMIField, setActiveBMIField] = useState<ActiveBMIField>(null);

  // ── Handlers ───────────────────────────────────────────
  const handleBMIFieldPress = (field: ActiveBMIField) => {
    // Toggle off if same field tapped again
    setActiveBMIField((prev) => (prev === field ? null : field));
  };

  const handleBMIChange = (field: "height" | "weight", value: string) => {
    setBmi((prev) => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    // TODO: persist profile data before navigating
    router.replace("/(tabs)");
  };

  // ── Render ─────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#FDF0F2]"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Page title ── */}
        <Text
          className="text-[#C0162C] text-2xl font-bold tracking-widest uppercase mb-6"
          style={{ letterSpacing: 2 }}
        >
          Set Up Your Profile
        </Text>

        {/* ── Avatar picker ── */}
        <View className="mb-8">
          <AvatarPicker
            selected={selectedAvatar}
            onSelect={setSelectedAvatar}
          />
        </View>

        {/* ── Age group picker ── */}
        <View className="mb-8">
          <AgeGroupPicker selected={selectedAge} onSelect={setSelectedAge} />
        </View>

        {/* ── BMI inputs ── */}
        <View className="mb-10">
          <BMIInputs
            values={bmi}
            activeField={activeBMIField}
            onFieldPress={handleBMIFieldPress}
            onChange={handleBMIChange}
          />
        </View>

        {/* ── Continue — plain red text link per design ── */}
        <TouchableOpacity
          onPress={handleContinue}
          activeOpacity={0.7}
          className="items-center"
        >
          <Text className="text-[#C0162C] text-base font-bold">Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
