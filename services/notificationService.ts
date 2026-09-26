import * as Notifications from "expo-notifications";

import type { CycleSnapshot } from "@/services/cycleService";
import {
    fromDateKey,
    getDateKeyDifferenceInDays,
    toDateKey,
} from "@/constants/cycleUtils";
import {
    compareDateKeys,
    isDoseDueOnDate,
} from "@/constants/medicineSchedule";
import type { Medicine } from "@/services/medicineService";
import { storage } from "@/services/storage";

type NotificationIdStore = {
  cycle: string[];
  cute: string[];
  medicine: Record<string, { reminder: string; missed: string }>;
};

const STORAGE_KEY = "@herflow/notification-ids";
const CUTE_MESSAGES = [
  "You're doing amazing, don't forget to drink water \ud83d\udca7",
  "Gentle reminder: rest is productive too \ud83c\udf19",
  "Your body works so hard for you. Be kind to it today \ud83c\udf38",
  "A little self-care goes a long way \ud83d\udc95",
  "You've got this, even on the hard days \ud83e\udef6",
  "Proud of you for showing up today \ud83c\udf3a",
  "Remember to breathe. You're doing great \ud83d\udcab",
  "Your feelings are valid. Always \ud83e\udd0d",
  "Small steps still count as progress \ud83c\udf31",
  "Be as kind to yourself as you are to others \ud83d\udc97",
  "Today is a good day to take care of you \u2728",
  "You are stronger than you think \ud83e\udd8b",
  "Hydrate. Rest. Repeat. You've got this \ud83d\udca7",
  "Sending you good energy today \ud83c\udf38",
  "One day at a time, you're doing beautifully \ud83c\udf3c",
];

function defaultStore(): NotificationIdStore {
  return { cycle: [], cute: [], medicine: {} };
}

async function loadStore(): Promise<NotificationIdStore> {
  const raw = await storage.getItem(STORAGE_KEY);
  if (!raw) return defaultStore();

  try {
    const parsed = JSON.parse(raw) as Partial<NotificationIdStore>;
    return {
      cycle: Array.isArray(parsed.cycle) ? parsed.cycle : [],
      cute: Array.isArray(parsed.cute) ? parsed.cute : [],
      medicine:
        parsed.medicine && typeof parsed.medicine === "object"
          ? parsed.medicine
          : {},
    };
  } catch {
    return defaultStore();
  }
}

async function saveStore(store: NotificationIdStore) {
  await storage.setItem(STORAGE_KEY, JSON.stringify(store));
}

async function cancelIds(ids: string[]) {
  await Promise.all(
    ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)),
  );
}

function addDays(base: Date, days: number) {
  const next = new Date(base.getTime());
  next.setDate(next.getDate() + days);
  return next;
}

function inWindow(
  dateKey: string,
  earliest: string | null,
  latest: string | null,
  point: string | null,
) {
  const minKey = earliest ?? point;
  const maxKey = latest ?? point;
  if (!minKey || !maxKey) return false;
  return (
    compareDateKeys(dateKey, minKey) >= 0 &&
    compareDateKeys(dateKey, maxKey) <= 0
  );
}

function randomTimeForDate(
  date: Date,
  minHour: number,
  maxHourExclusive: number,
) {
  const hour = Math.floor(
    Math.random() * (maxHourExclusive - minHour) + minHour,
  );
  const minute = Math.floor(Math.random() * 60);
  const scheduled = new Date(date.getTime());
  scheduled.setHours(hour, minute, 0, 0);
  return scheduled;
}

async function scheduleAtDate(date: Date, body: string) {
  return Notifications.scheduleNotificationAsync({
    content: { title: "herFlow", body },
    trigger: { date },
  });
}

export async function requestPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const next = await Notifications.requestPermissionsAsync();
  return next.granted;
}

export async function scheduleAllCycleNotifications(
  cycleSnapshot: CycleSnapshot,
) {
  const store = await loadStore();
  await cancelIds(store.cycle);
  store.cycle = [];

  const today = new Date();
  const todayKey = toDateKey(today);
  const window = cycleSnapshot.nextPeriodWindow;
  const targetKey = window.point ?? window.earliest ?? null;

  if (targetKey) {
    const targetDate = fromDateKey(targetKey);
    if (targetDate) {
      const offsets = [2, 1];
      for (const daysBefore of offsets) {
        const reminderDate = addDays(targetDate, -daysBefore);
        reminderDate.setHours(9, 0, 0, 0);
        if (reminderDate.getTime() > today.getTime()) {
          const id = await scheduleAtDate(
            reminderDate,
            "Your period may be arriving soon \ud83c\udf38 Stay prepared!",
          );
          store.cycle.push(id);
        }
      }
    }
  }

  if (cycleSnapshot.ovulationDateKey) {
    const ovulationDate = fromDateKey(cycleSnapshot.ovulationDateKey);
    if (ovulationDate) {
      ovulationDate.setHours(9, 0, 0, 0);
      if (ovulationDate.getTime() > today.getTime()) {
        const id = await scheduleAtDate(
          ovulationDate,
          "You may be in your fertile window today \ud83c\udf3f",
        );
        store.cycle.push(id);
      }
    }
  }

  if (window.point || window.earliest) {
    for (let i = 0; i < 30; i += 1) {
      const date = addDays(today, i);
      const dateKey = toDateKey(date);
      const isWithinWindow = inWindow(
        dateKey,
        window.earliest,
        window.latest,
        window.point,
      );
      const isNearOvulation =
        cycleSnapshot.ovulationDateKey &&
        Math.abs(
          getDateKeyDifferenceInDays(cycleSnapshot.ovulationDateKey, dateKey),
        ) <= 5;

      if (!isWithinWindow && !isNearOvulation) continue;

      const scheduled = randomTimeForDate(date, 10, 21);
      if (scheduled.getTime() <= today.getTime()) continue;

      const id = await scheduleAtDate(
        scheduled,
        "How are you feeling today? Log your symptoms \ud83d\udc95",
      );
      store.cycle.push(id);
    }
  }

  await saveStore(store);
}

export async function scheduleCuteNotifications() {
  const store = await loadStore();
  await cancelIds(store.cute);
  store.cute = [];

  const today = new Date();

  for (let i = 0; i < 30; i += 1) {
    const date = addDays(today, i);
    const scheduled = randomTimeForDate(date, 9, 22);
    if (scheduled.getTime() <= today.getTime()) continue;

    const message = CUTE_MESSAGES[i % CUTE_MESSAGES.length];
    const id = await scheduleAtDate(scheduled, message);
    store.cute.push(id);
  }

  await saveStore(store);
}

function parseTimeLabelToMinutes(label: string) {
  const match = label.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();

  if (hours === 12) hours = 0;
  if (meridiem === "PM") hours += 12;

  return { hours, minutes };
}

function getNextDoseDate(medicine: Medicine, now: Date) {
  const reminderTimes = medicine.reminderTimes
    .map((time) => time.trim())
    .filter(Boolean);
  if (reminderTimes.length === 0) return null;

  for (let offset = 0; offset < 30; offset += 1) {
    const date = addDays(now, offset);
    const dateKey = toDateKey(date);
    if (!isDoseDueOnDate(medicine, dateKey)) continue;

    const candidates = reminderTimes
      .map((label) => {
        const parsed = parseTimeLabelToMinutes(label);
        if (!parsed) return null;
        const scheduled = new Date(date.getTime());
        scheduled.setHours(parsed.hours, parsed.minutes, 0, 0);
        return scheduled;
      })
      .filter((value): value is Date => value !== null)
      .sort((a, b) => a.getTime() - b.getTime());

    for (const scheduled of candidates) {
      if (scheduled.getTime() > now.getTime()) return scheduled;
    }
  }

  return null;
}

export async function scheduleMedicineNotifications(medicines: Medicine[]) {
  const store = await loadStore();

  for (const medicine of medicines) {
    const existing = store.medicine[medicine.id];
    if (existing) {
      await cancelIds([existing.reminder, existing.missed]);
    }

    const nextDose = getNextDoseDate(medicine, new Date());
    if (!nextDose) {
      delete store.medicine[medicine.id];
      continue;
    }

    const reminderId = await scheduleAtDate(
      nextDose,
      `Time to take ${medicine.name} \ud83d\udc8a`,
    );

    const missedDate = addDays(nextDose, 0);
    missedDate.setHours(nextDose.getHours(), nextDose.getMinutes() + 60, 0, 0);

    const missedId = await scheduleAtDate(
      missedDate,
      `Did you take ${medicine.name}? Don't forget \ud83d\udc8a`,
    );

    store.medicine[medicine.id] = { reminder: reminderId, missed: missedId };
  }

  await saveStore(store);
}

export async function cancelMedicineNotification(medicineId: string) {
  const store = await loadStore();
  const entry = store.medicine[medicineId];
  if (!entry) return;

  await cancelIds([entry.missed]);
  store.medicine[medicineId] = { ...entry, missed: entry.missed };
  await saveStore(store);
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await saveStore(defaultStore());
}
