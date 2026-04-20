import PeriodCalendar from "@/components/health/PeriodCalendar";
import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

function buildPeriodRange(startDay: number | null, endDay: number | null) {
  if (startDay === null || endDay === null) return [];

  const low = Math.min(startDay, endDay);
  const high = Math.max(startDay, endDay);
  return Array.from({ length: high - low + 1 }, (_, idx) => low + idx);
}

export default function PeriodLogScreen() {
  const router = useRouter();
  const { user, setUser } = useUser();

  const selectedDay = user.selectedPeriodDate?.getDate();
  const handleMarkPeriodStart = () => {
    if (selectedDay === undefined) return;

    const updatedDays = buildPeriodRange(selectedDay, user.periodEndDay);
    setUser({ periodStartDay: selectedDay, periodDays: updatedDays });
  };

  const handleMarkPeriodEnd = () => {
    if (selectedDay === undefined || user.periodStartDay === null) return;

    const updatedDays = buildPeriodRange(user.periodStartDay, selectedDay);
    setUser({
      periodEndDay: selectedDay,
      periodDays: updatedDays,
      periodLengthDays: updatedDays.length,
    });
  };

  const handleMarkOvulation = () => {
    if (selectedDay === undefined) return;
    const isSameDay = user.ovulationDay === selectedDay;
    setUser({ ovulationDay: isSameDay ? null : selectedDay });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F7C5CC" }}>
      <ScrollView
        contentContainerStyle={{
          padding: 24,
          paddingTop: 56,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Back + title */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 20,
          }}
        >
          <Text style={{ color: "#C0162C", fontSize: 20 }}>←</Text>
          <Text style={{ color: "#C0162C", fontSize: 17, fontWeight: "700" }}>
            Period Log
          </Text>
        </TouchableOpacity>

        {/* Period Tracker header card */}
        <View
          style={{
            backgroundColor: "#E8637A",
            borderRadius: 18,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: "rgba(255,255,255,0.25)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 20 }}>📅</Text>
          </View>
          <View>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800" }}>
              Period Tracker
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
              Track your cycle and symptoms
            </Text>
          </View>
        </View>

        {/* Calendar */}
        <PeriodCalendar
          selectedDate={user.selectedPeriodDate}
          onSelectDate={(date) => setUser({ selectedPeriodDate: date })}
          periodDays={user.periodDays}
          periodStartDay={user.periodStartDay}
          periodEndDay={user.periodEndDay}
          ovulationDay={user.ovulationDay}
        />

        <View
          style={{
            marginTop: 12,
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <TouchableOpacity
            onPress={handleMarkPeriodStart}
            activeOpacity={0.85}
            style={{
              backgroundColor: "#fff",
              borderRadius: 50,
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderWidth: 1,
              borderColor: "#F2D0D5",
            }}
          >
            <Text style={{ color: "#C0162C", fontSize: 12, fontWeight: "700" }}>
              Mark Period Start
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleMarkPeriodEnd}
            activeOpacity={0.85}
            style={{
              backgroundColor: "#fff",
              borderRadius: 50,
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderWidth: 1,
              borderColor: "#F2D0D5",
            }}
          >
            <Text style={{ color: "#C0162C", fontSize: 12, fontWeight: "700" }}>
              Mark Period End
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleMarkOvulation}
            activeOpacity={0.85}
            style={{
              backgroundColor: "#fff",
              borderRadius: 50,
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderWidth: 1,
              borderColor: "#B9E5C8",
            }}
          >
            <Text style={{ color: "#15803D", fontSize: 12, fontWeight: "700" }}>
              Mark Ovulation
            </Text>
          </TouchableOpacity>
        </View>

        {/* Add symptoms & moods button */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={{
            marginTop: 20,
            backgroundColor: "#fff",
            borderRadius: 50,
            paddingVertical: 14,
            paddingHorizontal: 24,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            shadowColor: "#C0162C",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Text style={{ color: "#3A1A20", fontSize: 15, fontWeight: "500" }}>
            Add symptoms & moods
          </Text>
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: "#C0162C",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18, lineHeight: 20 }}>
              +
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
