import AvatarDisplay from "@/components/home/AvatarDisplay";
import AvatarSelector from "@/components/profile/AvatarSelector";
import CycleSettingsCard from "@/components/profile/CycleSettingsCard";
import EditableRow from "@/components/profile/EditableRow";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const { user, setUser, livePhase, liveCycleDay } = useUser();
  const [editingAvatar, setEditingAvatar] = useState(false);

  // Compute BMI if both values present
  const bmi =
    user.bmiHeightCm && user.bmiWeightKg
      ? (user.bmiWeightKg / Math.pow(user.bmiHeightCm / 100, 2)).toFixed(1)
      : null;

  const bmiLabel = bmi
    ? parseFloat(bmi) < 18.5
      ? "Underweight"
      : parseFloat(bmi) < 25
        ? "Normal"
        : parseFloat(bmi) < 30
          ? "Overweight"
          : "Obese"
    : null;

  return (
    <View style={{ flex: 1, backgroundColor: "#F7C5CC" }}>
      <ScrollView
        contentContainerStyle={{
          padding: 24,
          paddingTop: 56,
          paddingBottom: 48,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <Text
          style={{
            color: "#C0162C",
            fontSize: 24,
            fontWeight: "800",
            marginBottom: 20,
          }}
        >
          My Profile
        </Text>

        {/* ── Avatar + name ── */}
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <TouchableOpacity
            onPress={() => setEditingAvatar((e) => !e)}
            activeOpacity={0.8}
          >
            <AvatarDisplay avatarIndex={user.avatarIndex} />
            <Text
              style={{
                color: "#C0162C",
                fontSize: 12,
                fontWeight: "700",
                textAlign: "center",
                marginTop: -8,
              }}
            >
              {editingAvatar ? "Done" : "Change avatar"}
            </Text>
          </TouchableOpacity>

          {editingAvatar && (
            <View style={{ marginTop: 12, width: "100%" }}>
              <AvatarSelector
                selected={user.avatarIndex}
                onSelect={(i) => {
                  setUser({ avatarIndex: i });
                  setEditingAvatar(false);
                }}
              />
            </View>
          )}

          <Text
            style={{
              color: "#3A1A20",
              fontSize: 20,
              fontWeight: "800",
              marginTop: 12,
            }}
          >
            {user.name}
          </Text>

          {/* Phase badge */}
          <View
            style={{
              backgroundColor: "#C0162C",
              borderRadius: 50,
              paddingVertical: 4,
              paddingHorizontal: 14,
              marginTop: 6,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>
              {livePhase} Phase · Day {liveCycleDay}
            </Text>
          </View>
        </View>

        {/* ── Personal info card ── */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 18,
            padding: 18,
            marginBottom: 16,
            shadowColor: "#C0162C",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Text
            style={{
              color: "#C0162C",
              fontSize: 15,
              fontWeight: "800",
              marginBottom: 4,
            }}
          >
            Personal Info
          </Text>

          <EditableRow
            label="Name"
            value={user.name}
            onSave={(v) => setUser({ name: v || "User" })}
          />

          <EditableRow
            label="Age Group"
            value={user.ageGroup ?? ""}
            placeholder="e.g. 20-35"
            onSave={(v) => setUser({ ageGroup: v || null })}
          />

          <EditableRow
            label="Height (cm)"
            value={user.bmiHeightCm !== null ? String(user.bmiHeightCm) : ""}
            placeholder="e.g. 165"
            keyboardType="numeric"
            onSave={(v) => {
              const n = parseFloat(v);
              setUser({ bmiHeightCm: isNaN(n) ? null : n });
            }}
          />

          <EditableRow
            label="Weight (kg)"
            value={user.bmiWeightKg !== null ? String(user.bmiWeightKg) : ""}
            placeholder="e.g. 60"
            keyboardType="numeric"
            onSave={(v) => {
              const n = parseFloat(v);
              setUser({ bmiWeightKg: isNaN(n) ? null : n });
            }}
          />

          {/* BMI display — read only, computed */}
          {bmi && (
            <View
              style={{
                marginTop: 14,
                backgroundColor: "#FDF0F2",
                borderRadius: 12,
                padding: 12,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#8C5F66", fontSize: 13 }}>Your BMI</Text>
              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={{ color: "#C0162C", fontSize: 18, fontWeight: "800" }}
                >
                  {bmi}
                </Text>
                <Text style={{ color: "#8C5F66", fontSize: 11 }}>
                  {bmiLabel}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* ── Cycle settings ── */}
        <CycleSettingsCard
          totalCycleDays={user.totalCycleDays}
          periodLengthDays={user.periodLengthDays}
          cycleRegularity={user.cycleRegularity}
          onChangeCycleDays={(d) => setUser({ totalCycleDays: d })}
          onChangePeriodLength={(d) => setUser({ periodLengthDays: d })}
          onChangeRegularity={(v) => setUser({ cycleRegularity: v })}
        />

        {/* ── Stats ── */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 18,
            padding: 18,
            shadowColor: "#C0162C",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Text
            style={{
              color: "#C0162C",
              fontSize: 15,
              fontWeight: "800",
              marginBottom: 12,
            }}
          >
            Your Stats
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {[
              {
                label: "Periods logged",
                value: String(user.periodEntries.length),
              },
              { label: "Symptom logs", value: String(user.symptomLogs.length) },
              { label: "Cycle length", value: `${user.totalCycleDays}d` },
            ].map((stat) => (
              <View
                key={stat.label}
                style={{
                  flex: 1,
                  backgroundColor: "#FDF0F2",
                  borderRadius: 14,
                  padding: 12,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "#C0162C", fontSize: 20, fontWeight: "800" }}
                >
                  {stat.value}
                </Text>
                <Text
                  style={{
                    color: "#8C5F66",
                    fontSize: 10,
                    textAlign: "center",
                    marginTop: 2,
                  }}
                >
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
