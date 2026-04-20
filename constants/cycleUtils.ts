export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function fromDateKey(dateKey: string) {
  const [yearStr, monthStr, dayStr] = dateKey.split("-");
  const year = Number.parseInt(yearStr, 10);
  const month = Number.parseInt(monthStr, 10);
  const day = Number.parseInt(dayStr, 10);

  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    return null;
  }

  return new Date(year, month - 1, day);
}

export function buildDateRangeKeys(startDateKey: string, endDateKey: string) {
  const startDate = fromDateKey(startDateKey);
  const endDate = fromDateKey(endDateKey);

  if (!startDate || !endDate) return [];

  const first = startDate <= endDate ? startDate : endDate;
  const last = startDate <= endDate ? endDate : startDate;

  const cursor = new Date(
    first.getFullYear(),
    first.getMonth(),
    first.getDate(),
  );
  const keys: string[] = [];

  while (cursor <= last) {
    keys.push(toDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return keys;
}

export function flattenUniqueDateKeys(entries: Array<{ dateKeys: string[] }>) {
  return [...new Set(entries.flatMap((entry) => entry.dateKeys))].sort();
}

export function sortPeriodEntriesByStartDate<
  T extends { startDateKey: string; endDateKey: string; dateKeys: string[] },
>(entries: T[]) {
  return [...entries].sort((a, b) => {
    const aStart = fromDateKey(a.startDateKey);
    const bStart = fromDateKey(b.startDateKey);

    if (!aStart || !bStart) return a.startDateKey.localeCompare(b.startDateKey);
    return aStart.getTime() - bStart.getTime();
  });
}

export function getLatestPeriodEntry<
  T extends { startDateKey: string; endDateKey: string },
>(entries: T[]) {
  if (!entries.length) return null;
  const sorted = sortPeriodEntriesByStartDate(
    entries as Array<{
      startDateKey: string;
      endDateKey: string;
      dateKeys: string[];
    }>,
  );
  return sorted[sorted.length - 1] ?? null;
}
