import { toDateKey } from "@/constants/cycleUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
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
  symptomLogs: [],
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
        if (restored && !cancelled) {
          setUserState(restored);
        }
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
    ).catch(() => {
      // Ignore write failures to avoid breaking app interactions.
    });
  }, [isHydrated, user]);

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
