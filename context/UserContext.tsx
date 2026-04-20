import { toDateKey } from "@/constants/cycleUtils";
import { createContext, ReactNode, useContext, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type CyclePhase = "Menstrual" | "Follicular" | "Ovulation" | "Luteal";

export type PeriodEntry = {
  startDateKey: string;
  endDateKey: string;
  dateKeys: string[];
};

type UserData = {
  name: string;
  avatarIndex: number | null;
  ageGroup: string | null;
  bmiHeightCm: number | null;
  bmiWeightKg: number | null;
  cycleDay: number;
  totalCycleDays: number;
  cyclePhase: CyclePhase;
  periodLengthDays: number | null;
  cycleRegularity: "Regular" | "Irregular" | null;
  flowIntensity: "Light" | "Medium" | "Heavy" | null;
  periodStartDateKey: string | null;
  periodEndDateKey: string | null;
  ovulationDateKey: string | null;
  selectedPeriodDate: Date | null;
  periodDateKeys: string[];
  periodEntries: PeriodEntry[];
  symptoms: string[];
};

type UserContextType = {
  user: UserData;
  setUser: (data: Partial<UserData>) => void;
};

// ── Defaults ──────────────────────────────────────────────────────────────────
const DEFAULT_USER: UserData = {
  name: "Anchal",
  avatarIndex: 0,
  ageGroup: null,
  bmiHeightCm: null,
  bmiWeightKg: null,
  cycleDay: 1,
  totalCycleDays: 31,
  cyclePhase: "Menstrual",
  periodLengthDays: 5,
  cycleRegularity: null,
  flowIntensity: null,
  periodStartDateKey: toDateKey(
    new Date(new Date().getFullYear(), new Date().getMonth(), 3),
  ),
  periodEndDateKey: toDateKey(
    new Date(new Date().getFullYear(), new Date().getMonth(), 7),
  ),
  ovulationDateKey: null,
  selectedPeriodDate: new Date(),
  periodDateKeys: [
    toDateKey(new Date(new Date().getFullYear(), new Date().getMonth(), 3)),
    toDateKey(new Date(new Date().getFullYear(), new Date().getMonth(), 4)),
    toDateKey(new Date(new Date().getFullYear(), new Date().getMonth(), 5)),
    toDateKey(new Date(new Date().getFullYear(), new Date().getMonth(), 6)),
    toDateKey(new Date(new Date().getFullYear(), new Date().getMonth(), 7)),
  ],
  periodEntries: [
    {
      startDateKey: toDateKey(
        new Date(new Date().getFullYear(), new Date().getMonth(), 3),
      ),
      endDateKey: toDateKey(
        new Date(new Date().getFullYear(), new Date().getMonth(), 7),
      ),
      dateKeys: [
        toDateKey(new Date(new Date().getFullYear(), new Date().getMonth(), 3)),
        toDateKey(new Date(new Date().getFullYear(), new Date().getMonth(), 4)),
        toDateKey(new Date(new Date().getFullYear(), new Date().getMonth(), 5)),
        toDateKey(new Date(new Date().getFullYear(), new Date().getMonth(), 6)),
        toDateKey(new Date(new Date().getFullYear(), new Date().getMonth(), 7)),
      ],
    },
  ],
  symptoms: [],
};

// ── Context ───────────────────────────────────────────────────────────────────
const UserContext = createContext<UserContextType | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserData>(DEFAULT_USER);

  const setUser = (data: Partial<UserData>) => {
    setUserState((prev) => ({ ...prev, ...data }));
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}
