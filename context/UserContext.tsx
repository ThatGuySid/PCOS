// UserContext.tsx  (Firebase-backed version)
// Drop this in at: context/UserContext.tsx
//
// Changes from the original:
//  - Listens to Firebase Auth state; exposes `firebaseUser`.
//  - On sign-in, merges Firestore profile into local state (AsyncStorage
//    still used as the offline/fast cache).
//  - setUser() writes to Firestore whenever a user is signed in.

import {
    deleteCurrentUserAccount,
    logOut,
    subscribeToAuthState,
} from "@/services/authService";
import {
    computeCyclePhase,
    computeLiveCycleDay,
} from "@/services/cycleService";
import { fromDateKey, toDateKey } from "@/services/dateService";
import { getRecentSymptoms } from "@/services/symptomService";
import {
    deleteUserProfile,
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
  profileComplete: boolean;
};

type UserContextType = {
  user: UserData;
  setUser: (data: Partial<UserData>) => void;
  signOutUser: () => Promise<{ success: boolean; error?: string }>;
  resetUser: () => Promise<{ success: boolean; error?: string }>;
  livePhase: CyclePhase;
  liveCycleDay: number;
  predictedNextPeriodDateKey: string | null;
  recentSymptoms: string[];
  isProfileHydrated: boolean;
  hasProfileData: boolean;
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
  profileComplete: false,
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

function isLegacyProfileComplete(profile: Partial<UserData>): boolean {
  return (
    typeof profile.name === "string" &&
    profile.name.trim().length > 0 &&
    profile.avatarIndex !== null &&
    profile.ageGroup !== null &&
    profile.bmiHeightCm !== null &&
    profile.bmiWeightKg !== null &&
    profile.totalCycleDays !== null &&
    profile.periodLengthDays !== null &&
    profile.cycleRegularity !== null &&
    profile.flowIntensity !== null
  );
}

// ── Context ───────────────────────────────────────────────────────────────────
const UserContext = createContext<UserContextType | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserData>(DEFAULT_USER);
  const [isHydrated, setIsHydrated] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isProfileHydrated, setIsProfileHydrated] = useState(false);
  const [hasProfileData, setHasProfileData] = useState(false);

  const hydratedUidRef = useRef<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToAuthState(async (fbUser) => {
      setFirebaseUser(fbUser);
      setIsAuthLoading(false);

      if (fbUser && hydratedUidRef.current !== fbUser.uid) {
        hydratedUidRef.current = fbUser.uid;
        setIsProfileHydrated(false);
        setHasProfileData(false);

        try {
          const profile = await getUserProfile(fbUser.uid);
          if (profile) {
            const normalizedProfile = fromFirestoreProfile(
              profile as Record<string, unknown>,
            );
            const profileHasData =
              Boolean(normalizedProfile.profileComplete) ||
              isLegacyProfileComplete(normalizedProfile);

            setHasProfileData(profileHasData);
            setUserState((prev) => ({
              ...prev,
              ...normalizedProfile,
            }));
            const merged = {
              ...DEFAULT_USER,
              ...normalizedProfile,
            };
            await AsyncStorage.setItem(
              USER_STORAGE_KEY,
              JSON.stringify(toStoredUser(merged as UserData)),
            );
          }
        } catch {
          // Offline: AsyncStorage hydration (handled below) will cover this.
        } finally {
          setIsProfileHydrated(true);
        }
      }

      if (!fbUser) {
        hydratedUidRef.current = null;
        setIsProfileHydrated(false);
        setHasProfileData(false);
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
    setHasProfileData(Boolean(data.profileComplete));
  };

  const signOutUser = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    const result = await logOut();
    if (result.success) {
      hydratedUidRef.current = null;
      setUserState(DEFAULT_USER);
      setHasProfileData(false);
      await AsyncStorage.removeItem(USER_STORAGE_KEY).catch(() => {});
    }
    return result;
  };

  const resetUser = async (): Promise<{ success: boolean; error?: string }> => {
    if (!firebaseUser) {
      return { success: false, error: "No signed-in account found." };
    }

    if (firestoreSyncTimer.current) {
      clearTimeout(firestoreSyncTimer.current);
      firestoreSyncTimer.current = null;
    }

    const uid = firebaseUser.uid;

    try {
      await deleteUserProfile(uid);
    } catch {
      return {
        success: false,
        error: "Could not delete your saved data. Please try again.",
      };
    }

    const authResult = await deleteCurrentUserAccount();
    if (!authResult.success) {
      return authResult;
    }

    hydratedUidRef.current = null;
    setUserState(DEFAULT_USER);
    setHasProfileData(false);
    await AsyncStorage.removeItem(USER_STORAGE_KEY).catch(() => {});

    return { success: true };
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

  const predictedNextPeriodDateKey = useMemo(() => {
    if (!user.periodStartDateKey) return null;

    const start = fromDateKey(user.periodStartDateKey);
    if (!start) return null;

    const nextStart = new Date(start);
    nextStart.setDate(nextStart.getDate() + user.totalCycleDays);
    return toDateKey(nextStart);
  }, [user.periodStartDateKey, user.totalCycleDays]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        signOutUser,
        resetUser,
        livePhase,
        liveCycleDay,
        predictedNextPeriodDateKey,
        recentSymptoms,
        isProfileHydrated,
        hasProfileData,
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
