import { createContext, ReactNode, useContext, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type CyclePhase = "Menstrual" | "Follicular" | "Ovulation" | "Luteal";

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
  periodStartDay: number | null;
  periodEndDay: number | null;
  ovulationDay: number | null;
  selectedPeriodDate: Date | null;
  periodDays: number[];
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
  periodStartDay: 3,
  periodEndDay: 7,
  ovulationDay: null,
  selectedPeriodDate: new Date(),
  periodDays: [3, 4, 5, 6, 7],
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
