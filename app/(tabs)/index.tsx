import ActionButtons from "@/components/home/ActionButtons";
import GreetingHeader from "@/components/home/GreetingHeader";
import NextPeriodCard from "@/components/home/NextPeriodCard";
import { useUser } from "@/context/UserContext";
import { fromDateKey } from "@/services/dateService";
import { ImageBackground, ScrollView, Text, View } from "react-native";

const PHASE_COLORS: Record<string, { bg: string; accent: string }> = {
  Menstrual: { bg: "#C0162C", accent: "#E8637A" },
  Follicular: { bg: "#9B6B00", accent: "#F59E0B" },
  Ovulation: { bg: "#0F6B3E", accent: "#22C55E" },
  Luteal: { bg: "#5B1B8E", accent: "#A855F7" },
};

export default function HomeScreen() {
  const { user, livePhase, liveCycleDay, cycleSnapshot } = useUser();
  const phase = PHASE_COLORS[livePhase] ?? PHASE_COLORS.Menstrual;
  const hasCycleData =
    cycleSnapshot.phase !== null &&
    cycleSnapshot.cycleDay !== null &&
    cycleSnapshot.effectiveCycleLength !== null;
  const pct =
    hasCycleData && cycleSnapshot.cycleDay && cycleSnapshot.effectiveCycleLength
      ? Math.round(
          (cycleSnapshot.cycleDay / cycleSnapshot.effectiveCycleLength) * 100,
        )
      : null;

  return (
    <ImageBackground
      source={require("@/assets/images/onboarding backgroud.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
      imageStyle={{ opacity: 1 }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(254, 244, 245, 0.14)",
        }}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Greeting ── */}
          <View
            style={{ paddingHorizontal: 24, paddingTop: 56, paddingBottom: 24 }}
          >
            <GreetingHeader name={user.name} />
          </View>

          {/* ── Cycle card ── no negative margin so greeting is never cut off */}
          <View
            style={{
              marginHorizontal: 20,
              borderRadius: 28,
              backgroundColor: "#FAF4EB",
              padding: 22,
              shadowColor: "#C0162C",
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.15,
              shadowRadius: 28,
              elevation: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <View>
                <Text
                  style={{
                    color: "#9A6070",
                    fontSize: 11,
                    fontWeight: "700",
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                  }}
                >
                  Current Phase
                </Text>
                <Text
                  style={{
                    color: "#3A0A12",
                    fontSize: 24,
                    fontWeight: "900",
                    marginTop: 4,
                  }}
                >
                  {cycleSnapshot.phase ?? "Not tracked yet"}
                </Text>
              </View>

              {/* Phase badge */}
              <View
                style={{
                  backgroundColor: phase.bg,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 14,
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}
                >
                  {cycleSnapshot.cycleDay
                    ? `Day ${cycleSnapshot.cycleDay}`
                    : "No data"}
                </Text>
              </View>
            </View>

            {/* Progress bar */}
            <View>
              <View
                style={{
                  height: 8,
                  backgroundColor: "#F5E0E3",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: pct !== null ? `${pct}%` : "0%",
                    backgroundColor: "#C0162C",
                    borderRadius: 4,
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 6,
                }}
              >
                <Text style={{ color: "#B06070", fontSize: 11 }}>Day 1</Text>
                <Text
                  style={{ color: "#C0162C", fontSize: 11, fontWeight: "700" }}
                >
                  {pct !== null ? `${pct}% through cycle` : "No cycle data yet"}
                </Text>
                <Text style={{ color: "#B06070", fontSize: 11 }}>
                  {cycleSnapshot.effectiveCycleLength
                    ? `Day ${cycleSnapshot.effectiveCycleLength}`
                    : "—"}
                </Text>
              </View>
            </View>
          </View>

          {/* ── Quick stats row ── */}
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginHorizontal: 20,
              marginTop: 16,
            }}
          >
            {[
              {
                label: "Cycle Length",
                value: cycleSnapshot.effectiveCycleLength
                  ? `${cycleSnapshot.effectiveCycleLength} days`
                  : "—",
                emoji: "🔄",
              },
              {
                label: "Next Period",
                value: cycleSnapshot.nextPeriodWindow?.point
                  ? (() => {
                      const d = fromDateKey(
                        cycleSnapshot.nextPeriodWindow.point!,
                      );
                      if (!d) return "—";
                      const days = Math.round(
                        (d.getTime() - new Date().setHours(0, 0, 0, 0)) /
                          86400000,
                      );
                      return days > 0
                        ? `In ${days}d`
                        : days === 0
                          ? "Today"
                          : `${Math.abs(days)}d ago`;
                    })()
                  : "—",
                emoji: "📅",
              },
            ].map((stat) => (
              <View
                key={stat.label}
                style={{
                  flex: 1,
                  backgroundColor: "#FAF4EB",
                  borderRadius: 20,
                  padding: 16,
                  shadowColor: "#C0162C",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.07,
                  shadowRadius: 12,
                  elevation: 4,
                }}
              >
                <Text style={{ fontSize: 22, marginBottom: 6 }}>
                  {stat.emoji}
                </Text>
                <Text
                  style={{
                    color: "#9A6070",
                    fontSize: 10,
                    fontWeight: "700",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  {stat.label}
                </Text>
                <Text
                  style={{
                    color: "#3A0A12",
                    fontSize: 15,
                    fontWeight: "800",
                    marginTop: 2,
                  }}
                >
                  {stat.value}
                </Text>
              </View>
            ))}
          </View>

          {/* ── Next period prediction card ── */}
          <View style={{ marginHorizontal: 20 }}>
            <NextPeriodCard
              cycleSnapshot={cycleSnapshot}
              livePhase={livePhase}
              liveCycleDay={liveCycleDay}
              totalCycleDays={user.totalCycleDays}
            />
          </View>

          {/* ── Quick actions ── */}
          <View style={{ marginHorizontal: 20, marginTop: 20 }}>
            <Text
              style={{
                color: "#3A0A12",
                fontSize: 16,
                fontWeight: "800",
                marginBottom: 12,
              }}
            >
              Quick Actions
            </Text>
            <ActionButtons />
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}
