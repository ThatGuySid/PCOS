import { useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import AgeGroupPicker from "@/components/profile-setup/AgeGroupPicker";
import AvatarPicker from "@/components/profile-setup/AvatarPicker";
import BMIInputs from "@/components/profile-setup/BMIInputs";
import { useUser } from "@/context/UserContext";

type ActiveBMIField = "height" | "weight" | null;

export default function ProfileSetupPage() {
  const router = useRouter();
  const { setUser } = useUser();

  // ── State ──────────────────────────────────────────────
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [bmi, setBmi] = useState({ height: "", weight: "" });
  const [activeBMIField, setActiveBMIField] = useState<ActiveBMIField>(null);
  const [periodLength, setPeriodLength] = useState("5");
  const [regularity, setRegularity] = useState<"Regular" | "Irregular" | null>(
    null,
  );
  const [flowIntensity, setFlowIntensity] = useState<
    "Light" | "Medium" | "Heavy" | null
  >(null);

  // ── Handlers ───────────────────────────────────────────
  const handleBMIFieldPress = (field: ActiveBMIField) => {
    // Toggle off if same field tapped again
    setActiveBMIField((prev) => (prev === field ? null : field));
  };

  const handleBMIChange = (field: "height" | "weight", value: string) => {
    setBmi((prev) => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    const parsedHeight = Number.parseInt(bmi.height, 10);
    const parsedWeight = Number.parseInt(bmi.weight, 10);
    const parsedPeriodLength = Number.parseInt(periodLength, 10);

    setUser({
      avatarIndex: selectedAvatar,
      ageGroup: selectedAge,
      bmiHeightCm: Number.isNaN(parsedHeight) ? null : parsedHeight,
      bmiWeightKg: Number.isNaN(parsedWeight) ? null : parsedWeight,
      periodLengthDays: Number.isNaN(parsedPeriodLength)
        ? null
        : parsedPeriodLength,
      cycleRegularity: regularity,
      flowIntensity,
    });

    router.replace("/(tabs)");
  };

  // ── Render ─────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#FDF0F2]"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: 40,
          paddingRight: 22,
          paddingBottom: 40,
          paddingLeft: 24,
        }}
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
        <View className="mb-7">
          <AvatarPicker
            selected={selectedAvatar}
            onSelect={setSelectedAvatar}
          />
        </View>

        {/* ── Age group picker ── */}
        <View className="mb-7">
          <AgeGroupPicker selected={selectedAge} onSelect={setSelectedAge} />
        </View>

        {/* ── BMI inputs ── */}
        <View className="mb-7">
          <BMIInputs
            values={bmi}
            activeField={activeBMIField}
            onFieldPress={handleBMIFieldPress}
            onChange={handleBMIChange}
          />
        </View>

        {/* ── Period duration ── */}
        <View className="mb-7">
          <Text className="text-[#C0162C] text-base font-semibold mb-3">
            How long do your periods last?
          </Text>
          <View
            style={{
              borderWidth: 1.5,
              borderColor: "#E8A0A8",
              borderRadius: 14,
              backgroundColor: "#fff",
              paddingHorizontal: 14,
              paddingVertical: 10,
            }}
          >
            <TextInput
              value={periodLength}
              onChangeText={setPeriodLength}
              keyboardType="numeric"
              placeholder="e.g. 5"
              placeholderTextColor="#B08890"
              style={{ color: "#3A1A20", fontSize: 14 }}
            />
          </View>
        </View>

        {/* ── Cycle regularity ── */}
        <View className="mb-7">
          <Text className="text-[#C0162C] text-base font-semibold mb-3">
            Are your cycles regular?
          </Text>
          <View className="flex-row gap-3">
            {(["Regular", "Irregular"] as const).map((option) => {
              const selected = regularity === option;
              return (
                <TouchableOpacity
                  key={option}
                  onPress={() => setRegularity(option)}
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    borderWidth: 1.5,
                    borderColor: selected ? "#C0162C" : "#E8A0A8",
                    backgroundColor: selected ? "#F7DDE0" : "transparent",
                    borderRadius: 50,
                    paddingVertical: 12,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: selected ? "#C0162C" : "#8C5F66",
                      fontWeight: selected ? "700" : "500",
                      fontSize: 14,
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Flow intensity ── */}
        <View className="mb-8">
          <Text className="text-[#C0162C] text-base font-semibold mb-3">
            Flow Intensity
          </Text>
          <View className="flex-row gap-2">
            {(["Light", "Medium", "Heavy"] as const).map((option) => {
              const selected = flowIntensity === option;
              return (
                <TouchableOpacity
                  key={option}
                  onPress={() => setFlowIntensity(option)}
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    borderWidth: 1.5,
                    borderColor: selected ? "#C0162C" : "#E8A0A8",
                    backgroundColor: selected ? "#F7DDE0" : "transparent",
                    borderRadius: 50,
                    paddingVertical: 11,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: selected ? "#C0162C" : "#8C5F66",
                      fontWeight: selected ? "700" : "500",
                      fontSize: 13,
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Continue — plain red text  ── */}
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
