import type { CycleSnapshot } from "@/services/cycleService";
import { fromDateKey } from "@/services/dateService";
import { Text, View } from "react-native";

type Props = {
  cycleSnapshot: CycleSnapshot;
  livePhase: string | null;
  liveCycleDay: number | null;
  totalCycleDays: number;
};

const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDateKey(key: string): string {
  const date = fromDateKey(key);
  if (!date) return key;
  return `${MONTH_SHORT[date.getMonth()]} ${date.getDate()}`;
}

function getDaysUntil(dateKey: string): number {
  const target = fromDateKey(dateKey);
  if (!target) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
}

const PHASE_COLORS: Record<string, { bg: string; accent: string }> = {
  Menstrual: { bg: "#F7DDE0", accent: "#C0162C" },
  Follicular: { bg: "#DCFCE7", accent: "#15803D" },
  Ovulation: { bg: "#FEF3C7", accent: "#D97706" },
  Luteal: { bg: "#EDE9FE", accent: "#7C3AED" },
};

export default function NextPeriodCard({
  cycleSnapshot,
  livePhase,
  liveCycleDay,
  totalCycleDays,
}: Props) {
  const colors =
    PHASE_COLORS[(livePhase || "Menstrual") as keyof typeof PHASE_COLORS];
  const hasNextPeriodPrediction = Boolean(
    cycleSnapshot.nextPeriodWindow?.point,
  );

  const daysUntilPoint = cycleSnapshot.nextPeriodWindow?.point
    ? getDaysUntil(cycleSnapshot.nextPeriodWindow.point)
    : null;

  const daysUntilEarliest = cycleSnapshot.nextPeriodWindow?.earliest
    ? getDaysUntil(cycleSnapshot.nextPeriodWindow.earliest)
    : null;

  const daysUntilLatest = cycleSnapshot.nextPeriodWindow?.latest
    ? getDaysUntil(cycleSnapshot.nextPeriodWindow.latest)
    : null;

  // Progress through current cycle
  const progressPct =
    totalCycleDays > 0
      ? Math.min(100, Math.round(((liveCycleDay ?? 0) / totalCycleDays) * 100))
      : 0;

  return (
    <View
      style={{
        backgroundColor: "#FAF4EB",
        borderRadius: 20,
        padding: 18,
        marginTop: 14,
        borderLeftWidth: 4,
        borderLeftColor: colors.accent,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 12,
          gap: 10,
        }}
      >
        <View style={{ flex: 1, minWidth: 0, paddingRight: 6 }}>
          <Text
            style={{
              color: colors.accent,
              fontSize: 14,
              fontWeight: "800",
              marginBottom: 2,
            }}
          >
            Next Period
          </Text>
          {hasNextPeriodPrediction ? (
            <>
              <Text
                style={{ color: "#3A1A20", fontSize: 22, fontWeight: "800" }}
              >
                {cycleSnapshot.nextPeriodWindow?.point
                  ? formatDateKey(cycleSnapshot.nextPeriodWindow.point)
                  : "—"}
              </Text>
              {daysUntilPoint !== null && (
                <Text style={{ color: "#8C5F66", fontSize: 12, marginTop: 2 }}>
                  {daysUntilPoint > 0
                    ? `in ${daysUntilPoint} day${daysUntilPoint === 1 ? "" : "s"}`
                    : daysUntilPoint === 0
                      ? "today"
                      : `${Math.abs(daysUntilPoint)} day${Math.abs(daysUntilPoint) === 1 ? "" : "s"} ago`}
                </Text>
              )}
              {daysUntilEarliest !== null && daysUntilLatest !== null && (
                <Text
                  style={{
                    color: "#8C5F66",
                    fontSize: 11,
                    marginTop: 4,
                    fontStyle: "italic",
                  }}
                >
                  Range: {daysUntilEarliest}–{daysUntilLatest} days away
                </Text>
              )}
              <View style={{ marginTop: 6, flexDirection: "row", gap: 8 }}>
                <Text
                  style={{
                    color: colors.accent,
                    fontSize: 10,
                    fontWeight: "700",
                    backgroundColor: "rgba(0,0,0,0.05)",
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 6,
                  }}
                >
                  {cycleSnapshot.confidence}
                </Text>
              </View>
              {cycleSnapshot.insight && (
                <Text
                  style={{
                    color: "#8C5F66",
                    fontSize: 11,
                    marginTop: 6,
                    lineHeight: 16,
                  }}
                >
                  {cycleSnapshot.insight}
                </Text>
              )}
            </>
          ) : (
            <Text style={{ color: "#8C5F66", fontSize: 14, lineHeight: 19 }}>
              Add your first period entry to see a gentle prediction. The app
              will stay useful either way.
            </Text>
          )}
        </View>

        {/* Cycle day badge */}
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: colors.accent,
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800" }}>
            {liveCycleDay ?? "—"}
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 10 }}>
            of {totalCycleDays > 0 ? totalCycleDays : "—"}
          </Text>
        </View>
      </View>

      {/* Cycle progress bar */}
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <Text style={{ color: "#8C5F66", fontSize: 11 }}>Cycle progress</Text>
          <Text
            style={{ color: colors.accent, fontSize: 11, fontWeight: "700" }}
          >
            {progressPct}%
          </Text>
        </View>
        <View
          style={{
            height: 8,
            borderRadius: 8,
            backgroundColor: "rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: `${progressPct}%`,
              height: "100%",
              backgroundColor: colors.accent,
              borderRadius: 8,
            }}
          />
        </View>
      </View>
    </View>
  );
}
