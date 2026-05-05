// userProfileService.ts
// Place this file at: services/userProfileService.ts

import {
    CyclePhase,
    PeriodEntry,
    SymptomLogEntry,
} from "@/context/UserContext";
import {
    deleteDoc,
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
    Timestamp,
    updateDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export type FirestoreUserProfile = {
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
  selectedPeriodDate: string | null;
  periodDateKeys: string[];
  periodEntries: PeriodEntry[];
  symptoms: string[];
  symptomLogs: SymptomLogEntry[];
  profileComplete: boolean;
  updatedAt?: Timestamp;
  createdAt?: Timestamp;
};

function userDoc(uid: string) {
  return doc(db, "users", uid);
}

export async function createUserProfile(
  uid: string,
  profile: Omit<FirestoreUserProfile, "updatedAt" | "createdAt">,
): Promise<void> {
  await setDoc(userDoc(uid), {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getUserProfile(
  uid: string,
): Promise<FirestoreUserProfile | null> {
  const snap = await getDoc(userDoc(uid));
  if (!snap.exists()) return null;
  return snap.data() as FirestoreUserProfile;
}

export async function deleteUserProfile(uid: string): Promise<void> {
  await deleteDoc(userDoc(uid));
}

export async function updateUserProfile(
  uid: string,
  partial: Partial<Omit<FirestoreUserProfile, "createdAt" | "updatedAt">>,
): Promise<void> {
  await updateDoc(userDoc(uid), {
    ...partial,
    updatedAt: serverTimestamp(),
  });
}

export async function savePeriodData(
  uid: string,
  data: Pick<
    FirestoreUserProfile,
    | "periodStartDateKey"
    | "periodEndDateKey"
    | "periodDateKeys"
    | "periodEntries"
    | "selectedPeriodDate"
    | "cycleDay"
    | "cyclePhase"
  >,
): Promise<void> {
  await updateDoc(userDoc(uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function saveSymptomLog(
  uid: string,
  updatedLogs: SymptomLogEntry[],
  currentSymptoms: string[],
): Promise<void> {
  await updateDoc(userDoc(uid), {
    symptomLogs: updatedLogs,
    symptoms: currentSymptoms,
    updatedAt: serverTimestamp(),
  });
}
