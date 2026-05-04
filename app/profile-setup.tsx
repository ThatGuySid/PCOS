import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    ImageSourcePropType,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

type ActiveBMIField = "height" | "weight" | null;

const AVATARS: ImageSourcePropType[] = [
  require("@/assets/images/ProfileAvatar1.png"),
  require("@/assets/images/ProfileAvatar2.png"),
  require("@/assets/images/ProfileAvatar3.png"),
  require("@/assets/images/ProfileAvatar4.png"),
  require("@/assets/images/ProfileAvatar5.png"),
  require("@/assets/images/ProfileAvatar6.png"),
];

const AGE_GROUPS = ["10–19", "20–35", "36–50", "50 & above"];
const FLOW_OPTIONS = ["Light", "Medium", "Heavy"] as const;

// (Decorative orbs removed)

// ─── Section heading ──────────────────────────────────────────────────────
function SectionLabel({ children }: { children: string }) {
  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}
    >
      <View
        style={{
          width: 4,
          height: 18,
          borderRadius: 2,
          backgroundColor: "#C0162C",
          marginRight: 10,
        }}
      />
      <Text
        style={{
          color: "#7B1327",
          fontSize: 13,
          fontWeight: "700",
          letterSpacing: 1.8,
          textTransform: "uppercase",
        }}
      >
        {children}
      </Text>
    </View>
  );
}

// ─── Avatar card ──────────────────────────────────────────────────────────
function AvatarCard({
  source,
  selected,
  onPress,
}: {
  source: ImageSourcePropType;
  selected: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.92,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1.04,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View
      style={{ transform: [{ scale }], width: "30%", aspectRatio: 1 }}
    >
      <TouchableOpacity activeOpacity={0.85} onPress={handlePress}>
        {/* Glow ring when selected */}
        {selected && (
          <View
            style={{
              position: "absolute",
              inset: -4,
              borderRadius: 22,
              borderWidth: 2.5,
              borderColor: "#C0162C",
              shadowColor: "#C0162C",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 10,
              elevation: 8,
              zIndex: 2,
            }}
          />
        )}
        <View
          style={{
            borderRadius: 18,
            overflow: "hidden",
            borderWidth: selected ? 0 : 1.5,
            borderColor: "#F0C4CC",
            shadowColor: selected ? "#C0162C" : "#A06070",
            shadowOffset: { width: 0, height: selected ? 8 : 3 },
            shadowOpacity: selected ? 0.3 : 0.1,
            shadowRadius: selected ? 14 : 6,
            elevation: selected ? 10 : 3,
          }}
        >
          <Image
            source={source}
            resizeMode="cover"
            style={{ width: "100%", height: "100%" }}
          />
          {selected && (
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 32,
                backgroundColor: "rgba(192,22,44,0.75)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: "700",
                  letterSpacing: 1,
                }}
              >
                ✓ CHOSEN
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Pill chip button ─────────────────────────────────────────────────────
function Chip({
  label,
  selected,
  onPress,
  flex,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  flex?: number;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        flex: flex ?? 1,
        paddingVertical: 14,
        paddingHorizontal: 10,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: selected ? "#C0162C" : "#EAB4BD",
        backgroundColor: selected ? "#F9E8EB" : "#fff",
        alignItems: "center",
        shadowColor: selected ? "#C0162C" : "transparent",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: selected ? 0.18 : 0,
        shadowRadius: 8,
        elevation: selected ? 4 : 0,
      }}
    >
      {selected && (
        <View
          style={{
            position: "absolute",
            top: -1,
            left: -1,
            right: -1,
            height: 3,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            backgroundColor: "#C0162C",
          }}
        />
      )}
      <Text
        style={{
          color: selected ? "#C0162C" : "#9A6070",
          fontWeight: selected ? "700" : "500",
          fontSize: 13.5,
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ─── BMI input field ──────────────────────────────────────────────────────
function BMIField({
  label,
  unit,
  value,
  isActive,
  onPress,
  onChange,
}: {
  label: string;
  unit: string;
  value: string;
  isActive: boolean;
  onPress: () => void;
  onChange: (v: string) => void;
}) {
  const hasValue = value.length > 0;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        flex: 1,
        borderRadius: 18,
        borderWidth: 1.5,
        borderColor: isActive ? "#C0162C" : hasValue ? "#D97080" : "#EAB4BD",
        backgroundColor: isActive ? "#FFF0F2" : "#fff",
        paddingVertical: 16,
        paddingHorizontal: 18,
        shadowColor: isActive ? "#C0162C" : "transparent",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: isActive ? 5 : 0,
      }}
    >
      <Text
        style={{
          color: "#B06070",
          fontSize: 10,
          fontWeight: "700",
          letterSpacing: 1.5,
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        {label}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4 }}>
        {isActive ? (
          <TextInput
            autoFocus
            keyboardType="numeric"
            value={value}
            onChangeText={onChange}
            placeholder="0"
            placeholderTextColor="#D9A0AC"
            style={{
              color: "#C0162C",
              fontSize: 26,
              fontWeight: "800",
              minWidth: 50,
              padding: 0,
            }}
          />
        ) : (
          <Text
            style={{
              color: hasValue ? "#C0162C" : "#D9A0AC",
              fontSize: hasValue ? 26 : 20,
              fontWeight: hasValue ? "800" : "400",
            }}
          >
            {hasValue ? value : "—"}
          </Text>
        )}
        <Text
          style={{
            color: "#C0162C",
            fontSize: 13,
            fontWeight: "600",
            opacity: 0.7,
          }}
        >
          {unit}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────
export default function ProfileSetupPage() {
  const router = useRouter();
  const { setUser } = useUser();

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

  const handleBMIFieldPress = (field: ActiveBMIField) => {
    setActiveBMIField((prev) => (prev === field ? null : field));
  };

  const handleContinue = () => {
    setUser({
      avatarIndex: selectedAvatar,
      ageGroup: selectedAge,
      bmiHeightCm: bmi.height ? parseInt(bmi.height) : null,
      bmiWeightKg: bmi.weight ? parseInt(bmi.weight) : null,
      periodLengthDays: periodLength ? parseInt(periodLength) : null,
      cycleRegularity: regularity,
      flowIntensity,
    });
    router.replace("/(tabs)");
  };

  const btnScale = useRef(new Animated.Value(1)).current;
  const handleBtnPress = () => {
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
    ]).start(handleContinue);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#FAF4EB" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* background orbs removed */}

      <ScrollView
        contentContainerStyle={{
          paddingTop: 56,
          paddingHorizontal: 24,
          paddingBottom: 60,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero header ── */}
        <View style={{ marginBottom: 36 }}>
          <Text
            style={{
              color: "#C0162C",
              fontSize: 11,
              fontWeight: "700",
              letterSpacing: 3.5,
              textTransform: "uppercase",
              opacity: 0.6,
              marginBottom: 6,
            }}
          >
            Welcome to HerFlow
          </Text>
          <Text
            style={{
              color: "#3A0A12",
              fontSize: 30,
              fontWeight: "900",
              lineHeight: 36,
              letterSpacing: -0.5,
            }}
          >
            Make it{"\n"}
            <Text style={{ color: "#C0162C" }}>yours.</Text>
          </Text>
          <Text
            style={{
              color: "#9A6070",
              fontSize: 14,
              marginTop: 10,
              lineHeight: 20,
              maxWidth: 260,
            }}
          >
            A few details help us personalise your wellness journey.
          </Text>
        </View>

        {/* ─────────── AVATAR ─────────── */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 24,
            padding: 20,
            marginBottom: 20,
            shadowColor: "#C0162C",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.07,
            shadowRadius: 20,
            elevation: 4,
          }}
        >
          <SectionLabel>Choose Your Avatar</SectionLabel>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {AVATARS.map((src, i) => (
              <AvatarCard
                key={i}
                source={src}
                selected={selectedAvatar === i}
                onPress={() => setSelectedAvatar(i)}
              />
            ))}
          </View>
        </View>

        {/* ─────────── AGE GROUP ─────────── */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 24,
            padding: 20,
            marginBottom: 20,
            shadowColor: "#C0162C",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.07,
            shadowRadius: 20,
            elevation: 4,
          }}
        >
          <SectionLabel>Your Age Group</SectionLabel>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {AGE_GROUPS.map((g) => (
              <View key={g} style={{ width: "47%" }}>
                <Chip
                  label={g}
                  selected={selectedAge === g}
                  onPress={() => setSelectedAge(g)}
                />
              </View>
            ))}
          </View>
        </View>

        {/* ─────────── BMI ─────────── */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 24,
            padding: 20,
            marginBottom: 20,
            shadowColor: "#C0162C",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.07,
            shadowRadius: 20,
            elevation: 4,
          }}
        >
          <SectionLabel>BMI Details</SectionLabel>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <BMIField
              label="Height"
              unit="cm"
              value={bmi.height}
              isActive={activeBMIField === "height"}
              onPress={() => handleBMIFieldPress("height")}
              onChange={(v) => setBmi((p) => ({ ...p, height: v }))}
            />
            <BMIField
              label="Weight"
              unit="kg"
              value={bmi.weight}
              isActive={activeBMIField === "weight"}
              onPress={() => handleBMIFieldPress("weight")}
              onChange={(v) => setBmi((p) => ({ ...p, weight: v }))}
            />
          </View>
        </View>

        {/* ─────────── PERIOD LENGTH ─────────── */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 24,
            padding: 20,
            marginBottom: 20,
            shadowColor: "#C0162C",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.07,
            shadowRadius: 20,
            elevation: 4,
          }}
        >
          <SectionLabel>Period Duration</SectionLabel>
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              borderBottomWidth: 2,
              borderColor: "#EDAAB5",
              paddingBottom: 8,
              gap: 8,
            }}
          >
            <TextInput
              value={periodLength}
              onChangeText={setPeriodLength}
              keyboardType="numeric"
              style={{
                color: "#C0162C",
                fontSize: 36,
                fontWeight: "800",
                minWidth: 50,
              }}
            />
            <Text style={{ color: "#B06070", fontSize: 15, fontWeight: "600" }}>
              days on average
            </Text>
          </View>
        </View>

        {/* ─────────── REGULARITY ─────────── */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 24,
            padding: 20,
            marginBottom: 20,
            shadowColor: "#C0162C",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.07,
            shadowRadius: 20,
            elevation: 4,
          }}
        >
          <SectionLabel>Cycle Regularity</SectionLabel>
          <View style={{ flexDirection: "row", gap: 12 }}>
            {(["Regular", "Irregular"] as const).map((opt) => (
              <Chip
                key={opt}
                label={opt}
                selected={regularity === opt}
                onPress={() => setRegularity(opt)}
              />
            ))}
          </View>
        </View>

        {/* ─────────── FLOW INTENSITY ─────────── */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 24,
            padding: 20,
            marginBottom: 36,
            shadowColor: "#C0162C",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.07,
            shadowRadius: 20,
            elevation: 4,
          }}
        >
          <SectionLabel>Flow Intensity</SectionLabel>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {FLOW_OPTIONS.map((opt) => {
              const icons = { Light: "🌸", Medium: "🌺", Heavy: "💧" };
              const selected = flowIntensity === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  onPress={() => setFlowIntensity(opt)}
                  activeOpacity={0.75}
                  style={{
                    flex: 1,
                    paddingVertical: 16,
                    borderRadius: 16,
                    borderWidth: 1.5,
                    borderColor: selected ? "#C0162C" : "#EAB4BD",
                    backgroundColor: selected ? "#F9E8EB" : "#fff",
                    alignItems: "center",
                    gap: 6,
                    shadowColor: selected ? "#C0162C" : "transparent",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.18,
                    shadowRadius: 8,
                    elevation: selected ? 4 : 0,
                  }}
                >
                  <Text style={{ fontSize: 22 }}>{icons[opt]}</Text>
                  <Text
                    style={{
                      color: selected ? "#C0162C" : "#9A6070",
                      fontWeight: selected ? "700" : "500",
                      fontSize: 12,
                      letterSpacing: 0.3,
                    }}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ─────────── CTA BUTTON ─────────── */}
        <Animated.View style={{ transform: [{ scale: btnScale }] }}>
          <TouchableOpacity
            onPress={handleBtnPress}
            activeOpacity={0.9}
            style={{
              backgroundColor: "#C0162C",
              borderRadius: 20,
              paddingVertical: 20,
              alignItems: "center",
              shadowColor: "#C0162C",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.4,
              shadowRadius: 20,
              elevation: 12,
              flexDirection: "row",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "800",
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}
            >
              Begin My Journey
            </Text>
            <Text style={{ color: "#fff", fontSize: 18 }}>→</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
