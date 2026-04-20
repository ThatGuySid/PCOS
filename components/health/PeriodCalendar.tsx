import { toDateKey } from "@/constants/cycleUtils";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

type Props = {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  periodDateKeys?: string[];
  periodStartDateKey?: string | null;
  periodEndDateKey?: string | null;
  ovulationDateKey?: string | null;
  compact?: boolean;
};

export default function PeriodCalendar({
  selectedDate,
  onSelectDate,
  periodDateKeys = [],
  periodStartDateKey = null,
  periodEndDateKey = null,
  ovulationDateKey = null,
  compact = false,
}: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  // Build calendar grid — nulls for empty leading cells
  const leadingEmptyCells = Array(firstDay).fill(null);
  const monthDayCells = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const trailingCellCount =
    (7 - ((leadingEmptyCells.length + monthDayCells.length) % 7)) % 7;
  const trailingEmptyCells = Array(trailingCellCount).fill(null);
  const cells: (number | null)[] = [
    ...leadingEmptyCells,
    ...monthDayCells,
    ...trailingEmptyCells,
  ];
  const periodSet = new Set(periodDateKeys);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const isSelected = (day: number) =>
    selectedDate &&
    selectedDate.getDate() === day &&
    selectedDate.getMonth() === viewMonth &&
    selectedDate.getFullYear() === viewYear;

  const isToday = (day: number) =>
    today.getDate() === day &&
    today.getMonth() === viewMonth &&
    today.getFullYear() === viewYear;

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: compact ? 10 : 16,
        shadowColor: "#C0162C",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      {/* Header row — Select Date label + month/year nav */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: compact ? 8 : 14,
        }}
      >
        <Text style={{ fontSize: compact ? 14 : 16 }}>📅</Text>
        <Text
          style={{
            flex: 1,
            marginLeft: 8,
            color: "#C0162C",
            fontWeight: "800",
            fontSize: compact ? 13 : 15,
          }}
        >
          Select Date
        </Text>
        {/* Month navigator */}
        <TouchableOpacity
          onPress={handlePrevMonth}
          style={{ paddingHorizontal: 8 }}
        >
          <Text style={{ color: "#C0162C", fontSize: compact ? 16 : 18 }}>
            ‹
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            color: "#3A1A20",
            fontSize: compact ? 12 : 13,
            fontWeight: "600",
          }}
        >
          {MONTHS[viewMonth].slice(0, 3)} {viewYear}
        </Text>
        <TouchableOpacity
          onPress={handleNextMonth}
          style={{ paddingHorizontal: 8 }}
        >
          <Text style={{ color: "#C0162C", fontSize: compact ? 16 : 18 }}>
            ›
          </Text>
        </TouchableOpacity>
      </View>

      {/* Day-of-week headers */}
      <View style={{ flexDirection: "row", marginBottom: compact ? 4 : 6 }}>
        {DAYS.map((d) => (
          <Text
            key={d}
            style={{
              flex: 1,
              textAlign: "center",
              color: "#B08890",
              fontSize: compact ? 10 : 11,
              fontWeight: "600",
            }}
          >
            {d}
          </Text>
        ))}
      </View>

      {/* Calendar grid */}
      {Array.from({ length: Math.ceil(cells.length / 7) }).map((_, weekIdx) => (
        <View
          key={weekIdx}
          style={{ flexDirection: "row", marginBottom: compact ? 2 : 4 }}
        >
          {cells.slice(weekIdx * 7, weekIdx * 7 + 7).map((day, cellIdx) => {
            const selected = day !== null && isSelected(day);
            const todayCell = day !== null && isToday(day);
            const cellDateKey =
              day === null
                ? null
                : toDateKey(new Date(viewYear, viewMonth, day));
            const isPeriod = cellDateKey !== null && periodSet.has(cellDateKey);
            const isPeriodStart =
              cellDateKey !== null && periodStartDateKey === cellDateKey;
            const isPeriodEnd =
              cellDateKey !== null && periodEndDateKey === cellDateKey;
            const isOvulation =
              cellDateKey !== null && ovulationDateKey === cellDateKey;

            return (
              <TouchableOpacity
                key={cellIdx}
                onPress={() =>
                  day !== null &&
                  onSelectDate(new Date(viewYear, viewMonth, day))
                }
                disabled={day === null}
                style={{
                  flex: 1,
                  height: compact ? 32 : undefined,
                  aspectRatio: compact ? undefined : 1,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 100,
                  borderWidth: isOvulation ? 2 : 0,
                  borderColor: isOvulation ? "#22C55E" : "transparent",
                  backgroundColor: selected
                    ? "#C0162C"
                    : isPeriodStart || isPeriodEnd
                      ? "#E8637A"
                      : isPeriod
                        ? "#F2D0D5"
                        : "transparent",
                }}
              >
                <Text
                  style={{
                    fontSize: compact ? 12 : 13,
                    fontWeight: selected || todayCell ? "700" : "400",
                    color: selected
                      ? "#fff"
                      : isPeriodStart || isPeriodEnd
                        ? "#fff"
                        : todayCell
                          ? "#C0162C"
                          : day
                            ? "#3A1A20"
                            : "transparent",
                  }}
                >
                  {day ?? ""}
                </Text>
                {isPeriodStart && !compact && (
                  <Text
                    style={{
                      fontSize: 8,
                      color: "#fff",
                      marginTop: -2,
                      fontWeight: "700",
                    }}
                  >
                    S
                  </Text>
                )}
                {isPeriodEnd && !compact && (
                  <Text
                    style={{
                      fontSize: 8,
                      color: "#fff",
                      marginTop: -2,
                      fontWeight: "700",
                    }}
                  >
                    E
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      {!compact && (
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            marginTop: 6,
            marginBottom: 4,
            flexWrap: "wrap",
          }}
        >
          <Text style={{ color: "#8C5F66", fontSize: 11 }}>
            Pink = Period Days
          </Text>
          <Text style={{ color: "#8C5F66", fontSize: 11 }}>
            Dark Pink = Start/End
          </Text>
          <Text style={{ color: "#8C5F66", fontSize: 11 }}>
            Green Ring = Ovulation
          </Text>
        </View>
      )}

      {/* Decorative flowers — matching the design */}
      {!compact && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 8,
            paddingHorizontal: 4,
          }}
        >
          <Text style={{ fontSize: 20 }}>🌸</Text>
          <Text style={{ fontSize: 20 }}>🌸</Text>
        </View>
      )}
    </View>
  );
}
