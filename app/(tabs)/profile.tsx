import { useUser } from "@/context/UserContext";
import { useState } from "react";
import {
    Alert,
    Image,
    ImageBackground,
    ImageSourcePropType,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const AVATARS: ImageSourcePropType[] = [
  require("@/assets/images/ProfileAvatar1.png"),
  require("@/assets/images/ProfileAvatar2.png"),
  require("@/assets/images/ProfileAvatar3.png"),
  require("@/assets/images/ProfileAvatar4.png"),
  require("@/assets/images/ProfileAvatar5.png"),
  require("@/assets/images/ProfileAvatar6.png"),
];

const AGE_GROUPS = ["10-19", "20-35", "36-50", "50 & above"];
const FLOW_OPTIONS = ["Light", "Medium", "Heavy"] as const;
const REGULARITY_OPTIONS = ["Regular", "Irregular"] as const;

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderColor: "#F5E0E3",
      }}
    >
      <Text style={{ color: "#9A6070", fontSize: 13, fontWeight: "600" }}>
        {label}
      </Text>
      <Text style={{ color: "#3A0A12", fontSize: 13, fontWeight: "700" }}>
        {value}
      </Text>
    </View>
  );
}

// decorative orbs removed from profile screen

// ── Inline Edit Modal ─────────────────────────────────────────────────────────
function EditProfileModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { user, setUser } = useUser();

  const [name, setName] = useState(user.name);
  const [avatarIndex, setAvatarIndex] = useState<number | null>(
    user.avatarIndex,
  );
  const [ageGroup, setAgeGroup] = useState(user.ageGroup ?? "");
  const [height, setHeight] = useState(
    user.bmiHeightCm ? String(user.bmiHeightCm) : "",
  );
  const [weight, setWeight] = useState(
    user.bmiWeightKg ? String(user.bmiWeightKg) : "",
  );
  const [cycleDays, setCycleDays] = useState(
    user.totalCycleDays > 0 ? String(user.totalCycleDays) : "",
  );
  const [periodLen, setPeriodLen] = useState(
    user.periodLengthDays ? String(user.periodLengthDays) : "",
  );
  const [flow, setFlow] = useState(user.flowIntensity ?? null);
  const [regularity, setRegularity] = useState(user.cycleRegularity ?? null);

  const handleSave = () => {
    const parsedCycle = parseInt(cycleDays);
    const parsedPeriod = parseInt(periodLen);
    const parsedHeight = parseFloat(height);
    const parsedWeight = parseFloat(weight);

    if (!name.trim()) {
      Alert.alert("Name required", "Please enter your name.");
      return;
    }

    if (!cycleDays.trim() || Number.isNaN(parsedCycle)) {
      Alert.alert("Cycle length required", "Please enter your cycle length.");
      return;
    }

    setUser({
      name: name.trim(),
      avatarIndex,
      ageGroup: ageGroup || null,
      bmiHeightCm: isNaN(parsedHeight) ? null : parsedHeight,
      bmiWeightKg: isNaN(parsedWeight) ? null : parsedWeight,
      totalCycleDays: Math.max(14, Math.min(45, parsedCycle)),
      periodLengthDays: periodLen.trim()
        ? Math.max(1, Math.min(10, parsedPeriod))
        : null,
      flowIntensity: flow,
      cycleRegularity: regularity,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={{ flex: 1, backgroundColor: "#FEF4F5" }}>
        {/* Modal header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 24,
            paddingTop: 20,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderColor: "#F5E0E3",
            backgroundColor: "#fff",
          }}
        >
          <TouchableOpacity onPress={onClose}>
            <Text style={{ color: "#9A6070", fontSize: 15 }}>Cancel</Text>
          </TouchableOpacity>
          <Text style={{ color: "#3A0A12", fontSize: 17, fontWeight: "800" }}>
            Edit Profile
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={{ color: "#C0162C", fontSize: 15, fontWeight: "800" }}>
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar picker */}
          <Text
            style={{
              color: "#9A6070",
              fontSize: 11,
              fontWeight: "700",
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Avatar
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 24 }}
          >
            <View style={{ flexDirection: "row", gap: 10 }}>
              {AVATARS.map((src, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setAvatarIndex(i)}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    overflow: "hidden",
                    borderWidth: avatarIndex === i ? 3 : 1.5,
                    borderColor: avatarIndex === i ? "#C0162C" : "#F5E0E3",
                  }}
                >
                  <Image
                    source={src}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Name */}
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
            Name
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              borderWidth: 1.5,
              borderColor: "#F5E0E3",
              paddingHorizontal: 18,
              paddingVertical: 14,
              fontSize: 15,
              color: "#3A0A12",
              marginBottom: 20,
            }}
          />

          {/* Age Group */}
          <Text
            style={{
              color: "#9A6070",
              fontSize: 11,
              fontWeight: "700",
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Age Group
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 20,
            }}
          >
            {AGE_GROUPS.map((ag) => (
              <TouchableOpacity
                key={ag}
                onPress={() => setAgeGroup(ag)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 18,
                  borderRadius: 50,
                  borderWidth: 1.5,
                  borderColor: ageGroup === ag ? "#C0162C" : "#F5E0E3",
                  backgroundColor: ageGroup === ag ? "#FEF0F2" : "#fff",
                }}
              >
                <Text
                  style={{
                    color: ageGroup === ag ? "#C0162C" : "#9A6070",
                    fontWeight: ageGroup === ag ? "700" : "500",
                    fontSize: 13,
                  }}
                >
                  {ag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* BMI */}
          <Text
            style={{
              color: "#9A6070",
              fontSize: 11,
              fontWeight: "700",
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            BMI
          </Text>
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
            {[
              { label: "Height (cm)", value: height, onChange: setHeight },
              { label: "Weight (kg)", value: weight, onChange: setWeight },
            ].map((f) => (
              <View key={f.label} style={{ flex: 1 }}>
                <Text
                  style={{ color: "#B08890", fontSize: 12, marginBottom: 6 }}
                >
                  {f.label}
                </Text>
                <TextInput
                  value={f.value}
                  onChangeText={f.onChange}
                  keyboardType="numeric"
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 14,
                    borderWidth: 1.5,
                    borderColor: "#F5E0E3",
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 15,
                    color: "#3A0A12",
                  }}
                />
              </View>
            ))}
          </View>

          {/* Cycle settings */}
          <Text
            style={{
              color: "#9A6070",
              fontSize: 11,
              fontWeight: "700",
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Cycle Settings
          </Text>
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
            {[
              {
                label: "Cycle length (days)",
                value: cycleDays,
                onChange: setCycleDays,
              },
              {
                label: "Period length (days)",
                value: periodLen,
                onChange: setPeriodLen,
              },
            ].map((f) => (
              <View key={f.label} style={{ flex: 1 }}>
                <Text
                  style={{ color: "#B08890", fontSize: 12, marginBottom: 6 }}
                >
                  {f.label}
                </Text>
                <TextInput
                  value={f.value}
                  onChangeText={f.onChange}
                  keyboardType="numeric"
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 14,
                    borderWidth: 1.5,
                    borderColor: "#F5E0E3",
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 15,
                    color: "#3A0A12",
                  }}
                />
              </View>
            ))}
          </View>

          {/* Flow intensity */}
          <Text
            style={{
              color: "#9A6070",
              fontSize: 11,
              fontWeight: "700",
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Flow Intensity
          </Text>
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
            {FLOW_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => setFlow(opt)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  alignItems: "center",
                  borderRadius: 50,
                  borderWidth: 1.5,
                  borderColor: flow === opt ? "#C0162C" : "#F5E0E3",
                  backgroundColor: flow === opt ? "#FEF0F2" : "#fff",
                }}
              >
                <Text
                  style={{
                    color: flow === opt ? "#C0162C" : "#9A6070",
                    fontWeight: flow === opt ? "700" : "500",
                    fontSize: 13,
                  }}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Regularity */}
          <Text
            style={{
              color: "#9A6070",
              fontSize: 11,
              fontWeight: "700",
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Cycle Type
          </Text>
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
            {REGULARITY_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => setRegularity(opt)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  alignItems: "center",
                  borderRadius: 50,
                  borderWidth: 1.5,
                  borderColor: regularity === opt ? "#C0162C" : "#F5E0E3",
                  backgroundColor: regularity === opt ? "#FEF0F2" : "#fff",
                }}
              >
                <Text
                  style={{
                    color: regularity === opt ? "#C0162C" : "#9A6070",
                    fontWeight: regularity === opt ? "700" : "500",
                    fontSize: 13,
                  }}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ── Main profile screen ────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const { user, livePhase, liveCycleDay } = useUser();
  const [editOpen, setEditOpen] = useState(false);

  const bmi =
    user.bmiHeightCm && user.bmiWeightKg
      ? Math.round(user.bmiWeightKg / (user.bmiHeightCm / 100) ** 2)
      : null;

  return (
    <ImageBackground
      source={require("@/assets/images/onboarding backgroud.jpg")}
      style={{ flex: 1 }}
      imageStyle={{ resizeMode: "cover" }}
    >
      <EditProfileModal visible={editOpen} onClose={() => setEditOpen(false)} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Red header banner */}
        <View
          style={{
            backgroundColor: "#C0162C",
            paddingTop: 60,
            paddingBottom: 64,
            alignItems: "center",
            borderBottomLeftRadius: 36,
            borderBottomRightRadius: 36,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              overflow: "hidden",
              borderWidth: 3,
              borderColor: "rgba(255,255,255,0.6)",
              marginBottom: 14,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.12)",
            }}
          >
            {user.avatarIndex !== null ? (
              <Image
                source={AVATARS[user.avatarIndex]}
                resizeMode="cover"
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <Text style={{ color: "#fff", fontSize: 30, fontWeight: "800" }}>
                ?
              </Text>
            )}
          </View>
          <Text style={{ color: "#fff", fontSize: 22, fontWeight: "900" }}>
            {user.name || "Profile"}
          </Text>
          <Text
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 13,
              marginTop: 4,
            }}
          >
            {user.ageGroup ?? "—"} · HerFlow member
          </Text>
          {/* Live phase badge */}
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 50,
              paddingVertical: 5,
              paddingHorizontal: 16,
              marginTop: 10,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>
              {livePhase ? `${livePhase} Phase` : "Phase not tracked"} · Day{" "}
              {liveCycleDay ?? "—"}
            </Text>
          </View>
        </View>

        {/* Details card */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: -28,
            backgroundColor: "#fff",
            borderRadius: 24,
            padding: 22,
            shadowColor: "#C0162C",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.1,
            shadowRadius: 20,
            elevation: 8,
          }}
        >
          <Text
            style={{
              color: "#3A0A12",
              fontSize: 16,
              fontWeight: "800",
              marginBottom: 4,
            }}
          >
            Profile Details
          </Text>
          <InfoRow label="Age Group" value={user.ageGroup ?? "—"} />
          <InfoRow
            label="Cycle Length"
            value={user.totalCycleDays ? `${user.totalCycleDays} days` : "—"}
          />
          <InfoRow
            label="Period Length"
            value={
              user.periodLengthDays ? `${user.periodLengthDays} days` : "—"
            }
          />
          <InfoRow label="Flow Intensity" value={user.flowIntensity ?? "—"} />
          <InfoRow label="Cycle Type" value={user.cycleRegularity ?? "—"} />
          {bmi && <InfoRow label="BMI" value={`${bmi} kg/m²`} />}
        </View>

        {/* Stats row */}
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            marginHorizontal: 20,
            marginTop: 16,
          }}
        >
          {[
            {
              label: "Periods\nlogged",
              value: String(user.periodEntries.length),
            },
            { label: "Symptom\nlogs", value: String(user.symptomLogs.length) },
            {
              label: "Cycle\nlength",
              value: user.totalCycleDays > 0 ? `${user.totalCycleDays}d` : "—",
            },
          ].map((stat) => (
            <View
              key={stat.label}
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: 20,
                padding: 14,
                alignItems: "center",
                shadowColor: "#C0162C",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.07,
                shadowRadius: 12,
                elevation: 4,
              }}
            >
              <Text
                style={{ color: "#C0162C", fontSize: 22, fontWeight: "900" }}
              >
                {stat.value}
              </Text>
              <Text
                style={{
                  color: "#9A6070",
                  fontSize: 10,
                  textAlign: "center",
                  marginTop: 3,
                  lineHeight: 13,
                }}
              >
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Edit profile button */}
        <View style={{ marginHorizontal: 20, marginTop: 16 }}>
          <TouchableOpacity
            onPress={() => setEditOpen(true)}
            style={{
              backgroundColor: "#C0162C",
              borderRadius: 18,
              paddingVertical: 16,
              alignItems: "center",
              shadowColor: "#C0162C",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 14,
              elevation: 8,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 14,
                fontWeight: "800",
                letterSpacing: 1,
              }}
            >
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}
