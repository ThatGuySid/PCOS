import type { Medicine } from "@/services/medicineService";

export function parseDateKey(dateKey: string) {
  const date = new Date(`${dateKey}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function compareDateKeys(a: string, b: string) {
  return a.localeCompare(b);
}

export function isMedicineActiveOnDate(medicine: Medicine, dateKey: string) {
  if (compareDateKeys(dateKey, medicine.startDateKey) < 0) return false;
  if (
    medicine.endDateKey &&
    compareDateKeys(dateKey, medicine.endDateKey) > 0
  ) {
    return false;
  }
  return true;
}

export function isDoseDueOnDate(medicine: Medicine, dateKey: string) {
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
