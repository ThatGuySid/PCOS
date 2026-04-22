import {
  computeCyclePhase,
  computeLiveCycleDay,
} from "@/services/cycleService";
import { fromDateKey, toDateKey } from "@/services/dateService";
import { getRecentSymptoms } from "@/services/symptomService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
export type CyclePhase = "Menstrual" | "Follicular" | "Ovulation" | "Luteal";

export type PeriodEntry = {
  startDateKey: string;
  endDateKey: string;
  dateKeys: string[];
};

export type SymptomLogEntry = {
  id: string;
  dateKey: string;
  symptoms: string[];
  cycleDay: number;
  cyclePhase: CyclePhase;
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
  symptomLogs: SymptomLogEntry[];
  // Settings
  notificationsEnabled: boolean;
};

type UserContextType = {
  user: UserData;
  setUser: (data: Partial<UserData>) => void;
  resetUser: () => void;
  // Live computed
  livePhase: CyclePhase;
  liveCycleDay: number;
  recentSymptoms: string[];
  predictedNextPeriodDateKey: string | null; // next period start prediction
  isHydrated: boolean;
};

// ── Defaults ──────────────────────────────────────────────────────────────────
export const DEFAULT_USER: UserData = {
  name: "User",
  avatarIndex: null,
  ageGroup: null,
  bmiHeightCm: null,
  bmiWeightKg: null,
  cycleDay: 1,
  totalCycleDays: 28,
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
  symptomLogs: [],
  notificationsEnabled: false,
};

const USER_STORAGE_KEY = "@herflow/user";

type StoredUserData = Omit<UserData, "selectedPeriodDate"> & {
  selectedPeriodDate: string | null;
};

function toStoredUser(user: UserData): StoredUserData {
  return {
    ...user,
    selectedPeriodDate: user.selectedPeriodDate
      ? user.selectedPeriodDate.toISOString()
      : null,
  };
}

function fromStoredUser(raw: string): UserData | null {
  try {
    const parsed = JSON.parse(raw) as Partial<StoredUserData>;
    const parsedDate = parsed.selectedPeriodDate
      ? new Date(parsed.selectedPeriodDate)
      : null;
    const selectedPeriodDate =
      parsedDate && !Number.isNaN(parsedDate.getTime())
        ? parsedDate
        : DEFAULT_USER.selectedPeriodDate;

    return {
      ...DEFAULT_USER,
      ...parsed,
      selectedPeriodDate,
      periodEntries: Array.isArray(parsed.periodEntries)
        ? parsed.periodEntries
        : DEFAULT_USER.periodEntries,
      periodDateKeys: Array.isArray(parsed.periodDateKeys)
        ? parsed.periodDateKeys
        : DEFAULT_USER.periodDateKeys,
      symptoms: Array.isArray(parsed.symptoms)
        ? parsed.symptoms
        : DEFAULT_USER.symptoms,
      symptomLogs: Array.isArray(parsed.symptomLogs)
        ? parsed.symptomLogs
        : DEFAULT_USER.symptomLogs,
    };
  } catch {
    return null;
  }
}

// ── Prediction helper ─────────────────────────────────────────────────────────
// Uses average of last 3 cycle lengths if available, otherwise totalCycleDays
function computePredictedNextPeriod(
  periodEntries: PeriodEntry[],
  periodStartDateKey: string | null,
  totalCycleDays: number,
): string | null {
  if (!periodStartDateKey) return null;

  // Average cycle length from last 3 entries if we have enough data
  let cycleLengthToUse = totalCycleDays;
  if (periodEntries.length >= 2) {
    const sorted = [...periodEntries].sort((a, b) =>
      a.startDateKey.localeCompare(b.startDateKey),
    );
    const recent = sorted.slice(-3);
    const gaps: number[] = [];
    for (let i = 1; i < recent.length; i++) {
      const prev = fromDateKey(recent[i - 1].startDateKey);
      const curr = fromDateKey(recent[i].startDateKey);
      if (prev && curr) {
        gaps.push(
          Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)),
        );
      }
    }
    if (gaps.length > 0) {
      cycleLengthToUse = Math.round(
        gaps.reduce((a, b) => a + b, 0) / gaps.length,
      );
    }
  }

  const start = fromDateKey(periodStartDateKey);
  if (!start) return null;
  const next = new Date(start);
  next.setDate(next.getDate() + cycleLengthToUse);
  return toDateKey(next);
}

// ── Context ───────────────────────────────────────────────────────────────────
const UserContext = createContext<UserContextType | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserData>(DEFAULT_USER);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function hydrateUser() {
      try {
        const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (!stored || cancelled) {
          setIsHydrated(true);
          return;
        }
        const restored = fromStoredUser(stored);
        if (restored && !cancelled) setUserState(restored);
      } catch {
        // Keep defaults on storage read errors.
      } finally {
        if (!cancelled) setIsHydrated(true);
      }
    }
    hydrateUser();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(
      USER_STORAGE_KEY,
      JSON.stringify(toStoredUser(user)),
    ).catch(() => {});
  }, [isHydrated, user]);

  const setUser = (data: Partial<UserData>) => {
    setUserState((prev) => ({ ...prev, ...data }));
  };

  // Hard reset — clears storage and returns to defaults
  const resetUser = async () => {
    await AsyncStorage.removeItem(USER_STORAGE_KEY).catch(() => {});
    setUserState(DEFAULT_USER);
  };

  // ── Computed values ───────────────────────────────────────────────────────
  const liveCycleDay = useMemo(
    () => computeLiveCycleDay(user.periodStartDateKey, user.totalCycleDays),
    [user.periodStartDateKey, user.totalCycleDays],
  );

  const livePhase = useMemo(
    () =>
      computeCyclePhase(
        liveCycleDay,
        user.totalCycleDays,
        user.periodLengthDays ?? 5,
      ),
    [liveCycleDay, user.totalCycleDays, user.periodLengthDays],
  );

  const recentSymptoms = useMemo(
    () => getRecentSymptoms(user.symptomLogs),
    [user.symptomLogs],
  );

  const predictedNextPeriodDateKey = useMemo(
    () =>
      computePredictedNextPeriod(
        user.periodEntries,
        user.periodStartDateKey,
        user.totalCycleDays,
      ),
    [user.periodEntries, user.periodStartDateKey, user.totalCycleDays],
  );

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        resetUser,
        livePhase,
        liveCycleDay,
        recentSymptoms,
        predictedNextPeriodDateKey,
        isHydrated,
      }}
    >
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
