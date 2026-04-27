// UserContext.tsx  (Firebase-backed version)
// Drop this in at: context/UserContext.tsx
//
// Changes from the original:
//  - Listens to Firebase Auth state; exposes `firebaseUser`.
//  - On sign-in, merges Firestore profile into local state (AsyncStorage
//    still used as the offline/fast cache).
//  - setUser() writes to Firestore whenever a user is signed in.

import { subscribeToAuthState } from "@/services/authService";
import {
    computeCyclePhase,
    computeLiveCycleDay,
} from "@/services/cycleService";
import { toDateKey } from "@/services/dateService";
import { getRecentSymptoms } from "@/services/symptomService";
import {
    getUserProfile,
    updateUserProfile,
} from "@/services/userProfileService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "firebase/auth";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useRef,
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
  livePhase: CyclePhase;
  liveCycleDay: number;
  recentSymptoms: string[];
  /** The signed-in Firebase user, or null when logged out. */
  firebaseUser: User | null;
  isAuthLoading: boolean;
};

// ── Defaults ──────────────────────────────────────────────────────────────────
const DEFAULT_USER: UserData = {
  name: "Friend",
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

function toStoredUser(u: UserData): StoredUserData {
  return {
    ...u,
    selectedPeriodDate: u.selectedPeriodDate
      ? u.selectedPeriodDate.toISOString()
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

function fromFirestoreProfile(raw: Record<string, unknown>): Partial<UserData> {
  const selectedPeriodDate =
    typeof raw.selectedPeriodDate === "string"
      ? new Date(raw.selectedPeriodDate)
      : null;
  return { ...(raw as Partial<UserData>), selectedPeriodDate };
}

// ── Context ───────────────────────────────────────────────────────────────────
const UserContext = createContext<UserContextType | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserData>(DEFAULT_USER);
  const [isHydrated, setIsHydrated] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const hydratedUidRef = useRef<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToAuthState(async (fbUser) => {
      setFirebaseUser(fbUser);
      setIsAuthLoading(false);

      if (fbUser && hydratedUidRef.current !== fbUser.uid) {
        hydratedUidRef.current = fbUser.uid;

        try {
          const profile = await getUserProfile(fbUser.uid);
          if (profile) {
            setUserState((prev) => ({
              ...prev,
              ...fromFirestoreProfile(profile as Record<string, unknown>),
            }));
            const merged = {
              ...DEFAULT_USER,
              ...fromFirestoreProfile(profile as Record<string, unknown>),
            };
            await AsyncStorage.setItem(
              USER_STORAGE_KEY,
              JSON.stringify(toStoredUser(merged as UserData)),
            );
          }
        } catch {
          // Offline: AsyncStorage hydration (handled below) will cover this.
        }
      }

      if (!fbUser) {
        hydratedUidRef.current = null;
      }
    });

    return unsub;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function hydrateFromStorage() {
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
        // Keep defaults.
      } finally {
        if (!cancelled) setIsHydrated(true);
      }
    }

    hydrateFromStorage();
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

  const firestoreSyncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isHydrated) return;
    if (!firebaseUser) return;

    if (firestoreSyncTimer.current) clearTimeout(firestoreSyncTimer.current);

    firestoreSyncTimer.current = setTimeout(() => {
      const stored = toStoredUser(user);
      updateUserProfile(firebaseUser.uid, stored).catch(() => {
        // Silently ignore write failures (e.g. offline).
      });
    }, 1500);

    return () => {
      if (firestoreSyncTimer.current) clearTimeout(firestoreSyncTimer.current);
    };
  }, [isHydrated, firebaseUser, user]);

  const setUser = (data: Partial<UserData>) => {
    setUserState((prev) => ({ ...prev, ...data }));
  };

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

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        livePhase,
        liveCycleDay,
        recentSymptoms,
        firebaseUser,
        isAuthLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}
