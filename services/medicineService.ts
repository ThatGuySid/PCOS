import { toDateKey } from "@/services/dateService";
import {
    doc,
    getDoc,
    onSnapshot,
    serverTimestamp,
    setDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export type MedicineRecurrence =
  | "Once"
  | "Daily"
  | "Every X days"
  | "Custom times per day";

export type Medicine = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  recurrence: MedicineRecurrence;
  intervalDays: number | null;
  reminderTimes: string[];
  startDateKey: string;
  endDateKey: string | null;
  notes: string;
  completedDoseKeys: string[];
};

export type MedicineTrackerDoc = {
  medicines: Medicine[];
};

export type ScheduleItem = {
  id: string;
  medicineId: string;
  title: string;
  subtitle: string;
  meta: string;
  icon: string;
  iconBg: string;
  accent: string;
  actionLabel: string;
  doseKey: string;
  completed: boolean;
  timeLabel: string;
};

const DEFAULT_TRACKER: MedicineTrackerDoc = {
  medicines: [],
};

function trackerDoc(uid: string) {
  return doc(db, "users", uid, "medicineTracker", "current");
}

export function createMedicineId() {
  return `med-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createMedicine(
  input: Omit<Medicine, "id" | "completedDoseKeys">,
) {
  return {
    id: createMedicineId(),
    completedDoseKeys: [],
    ...input,
  } satisfies Medicine;
}

export async function getMedicineTracker(
  uid: string,
): Promise<MedicineTrackerDoc> {
  const snap = await getDoc(trackerDoc(uid));
  if (!snap.exists()) return DEFAULT_TRACKER;

  const data = snap.data() as Partial<MedicineTrackerDoc>;
  return {
    medicines: Array.isArray(data.medicines) ? data.medicines : [],
  };
}

export function subscribeToMedicineTracker(
  uid: string,
  callback: (tracker: MedicineTrackerDoc) => void,
): () => void {
  return onSnapshot(trackerDoc(uid), (snap) => {
    if (!snap.exists()) {
      callback(DEFAULT_TRACKER);
      return;
    }

    const data = snap.data() as Partial<MedicineTrackerDoc>;
    callback({
      medicines: Array.isArray(data.medicines) ? data.medicines : [],
    });
  });
}

export async function saveMedicineTracker(
  uid: string,
  medicines: Medicine[],
): Promise<void> {
  await setDoc(
    trackerDoc(uid),
    {
      medicines,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

function parseDateKey(dateKey: string) {
  const date = new Date(`${dateKey}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function compareDateKeys(a: string, b: string) {
  return a.localeCompare(b);
}

function isMedicineActiveOnDate(medicine: Medicine, dateKey: string) {
  if (compareDateKeys(dateKey, medicine.startDateKey) < 0) return false;
  if (
    medicine.endDateKey &&
    compareDateKeys(dateKey, medicine.endDateKey) > 0
  ) {
    return false;
  }
  return true;
}

function isDoseDueOnDate(medicine: Medicine, dateKey: string) {
  if (!isMedicineActiveOnDate(medicine, dateKey)) return false;

  if (medicine.recurrence === "Once") {
    return dateKey === medicine.startDateKey;
  }

  if (medicine.recurrence === "Every X days") {
    const start = parseDateKey(medicine.startDateKey);
    const date = parseDateKey(dateKey);
    const intervalDays = medicine.intervalDays ?? 1;

    if (!start || !date || intervalDays <= 0) return false;

    const diffDays = Math.floor((date.getTime() - start.getTime()) / 86400000);
    return diffDays >= 0 && diffDays % intervalDays === 0;
  }

  return true;
}

function parseTimeLabel(label: string) {
  const match = label.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return Number.POSITIVE_INFINITY;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();

  if (hours === 12) hours = 0;
  if (meridiem === "PM") hours += 12;

  return hours * 60 + minutes;
}

function getDoseTimes(medicine: Medicine) {
  const normalizedTimes = medicine.reminderTimes
    .map((time) => time.trim())
    .filter(Boolean);

  return normalizedTimes;
}

export function buildMedicineSchedule(
  medicines: Medicine[],
  dateKey: string,
  now = new Date(),
): ScheduleItem[] {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return medicines
    .filter((medicine) => isDoseDueOnDate(medicine, dateKey))
    .flatMap((medicine) => {
      const times = getDoseTimes(medicine);

      return times.map((timeLabel, index) => {
        const doseKey = `${medicine.id}|${dateKey}|${timeLabel}`;
        const completed = medicine.completedDoseKeys.includes(doseKey);
        const timeMinutes = parseTimeLabel(timeLabel);
        const actionLabel = completed
          ? "Taken ✓"
          : timeMinutes <= currentMinutes
            ? "Take Now"
            : timeLabel;

        return {
          id: doseKey,
          medicineId: medicine.id,
          title: medicine.name,
          subtitle: `${medicine.dosage}${medicine.frequency ? ` · ${medicine.frequency}` : ""}`,
          meta: completed ? "Taken" : actionLabel,
          icon: "💊",
          iconBg:
            index % 3 === 0
              ? "#E8F8EF"
              : index % 3 === 1
                ? "#FEE8EB"
                : "#FFF4E5",
          accent: completed
            ? "#16A34A"
            : timeMinutes <= currentMinutes
              ? "#E84D73"
              : "#F97316",
          actionLabel,
          doseKey,
          completed,
          timeLabel,
        } satisfies ScheduleItem;
      });
    })
    .sort((a, b) => parseTimeLabel(a.timeLabel) - parseTimeLabel(b.timeLabel));
}

export function toggleDoseTaken(medicine: Medicine, doseKey: string) {
  const completedDoseKeys = medicine.completedDoseKeys.includes(doseKey)
    ? medicine.completedDoseKeys.filter((key) => key !== doseKey)
    : [...medicine.completedDoseKeys, doseKey];

  return { ...medicine, completedDoseKeys } satisfies Medicine;
}

export function upsertMedicine(medicines: Medicine[], nextMedicine: Medicine) {
  const index = medicines.findIndex(
    (medicine) => medicine.id === nextMedicine.id,
  );

  if (index < 0) return [...medicines, nextMedicine];

  const copy = [...medicines];
  copy[index] = nextMedicine;
  return copy;
}

export function deleteMedicineById(medicines: Medicine[], medicineId: string) {
  return medicines.filter((medicine) => medicine.id !== medicineId);
}

export function medicineToDateKey(value: string | null) {
  if (!value) return null;

  const key = value.trim();
  const date = new Date(`${key}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : toDateKey(date);
}
