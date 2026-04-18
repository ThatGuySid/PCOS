import { createContext, useContext, useState, ReactNode } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type CyclePhase = "Menstrual" | "Follicular" | "Ovulation" | "Luteal";

type UserData = {
  name: string;
  avatarIndex: number | null;
  cycleDay: number;
  totalCycleDays: number;
  cyclePhase: CyclePhase;
};

type UserContextType = {
  user: UserData;
  setUser: (data: Partial<UserData>) => void;
};

// ── Defaults ──────────────────────────────────────────────────────────────────
const DEFAULT_USER: UserData = {
  name: "Anchal",
  avatarIndex: 0,
  cycleDay: 1,
  totalCycleDays: 31,
  cyclePhase: "Menstrual",
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
