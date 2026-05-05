import {
    fromDateKey,
    getDateKeyDifferenceInDays,
    getLatestPeriodEntry,
    sortPeriodEntriesByStartDate,
    toDateKey,
} from "@/services/dateService";

export type CyclePhaseName =
  | "Menstrual"
  | "Follicular"
  | "Ovulation"
  | "Luteal";

export type FertileWindow = {
  start: string | null;
  end: string | null;
};

export type CycleSnapshot = {
  phase: CyclePhaseName | null;
  cycleDay: number | null;
  effectiveCycleLength: number | null;
  nextPeriodDateKey: string | null;
  ovulationDateKey: string | null;
  fertileWindow: FertileWindow;
  ovulationDay: number | null;
  lastPeriodStartKey: string | null;
};

// Compute the live cycle day (1-indexed) relative to the last period start.
export function computeLiveCycleDay(
  periodStartDateKey: string | null,
  effectiveCycleLength: number,
) {
  if (!periodStartDateKey) return null;

  const todayKey = toDateKey(new Date());
  const elapsed = getDateKeyDifferenceInDays(periodStartDateKey, todayKey);
  if (elapsed < 0) return 1;

  return (elapsed % effectiveCycleLength) + 1;
}

// Compute the ovulation day (cycle day number) based on the luteal-length assumption.
function computeOvulationDayNumber(effectiveCycleLength: number) {
  // ovulationDate = nextPeriodStart - 14
  // ovulationDay = differenceInDays(lastPeriodStart, ovulationDate) + 1
  // => ovulationDay = effectiveCycleLength - 13
  return effectiveCycleLength - 13;
}

function getNormalizedCycleDay(
  elapsedDays: number,
  effectiveCycleLength: number,
) {
  const normalized =
    ((elapsedDays % effectiveCycleLength) + effectiveCycleLength) %
    effectiveCycleLength;
  return normalized + 1;
}

export function computeCyclePhase(
  cycleDay: number,
  effectiveCycleLength: number,
  periodLengthDays: number,
): CyclePhaseName {
  const ovulationDay = computeOvulationDayNumber(effectiveCycleLength);

  if (cycleDay <= periodLengthDays) return "Menstrual";
  if (cycleDay === ovulationDay) return "Ovulation";
  if (cycleDay < ovulationDay) return "Follicular";

  return "Luteal";
}

// Determine an effective cycle length from historical period entries and a user-provided fallback.
// - If fewer than 2 entries, return fallback.
// - If exactly 2 entries, return the average gap.
// - If 3+ entries, return a weighted average favoring recent cycles.
export function computeEffectiveCycleLength(
  periodEntries: Array<{ startDateKey: string }>,
  fallbackCycleLength: number,
) {
  if (!Array.isArray(periodEntries) || periodEntries.length < 2)
    return fallbackCycleLength;

  const sorted = sortPeriodEntriesByStartDate(periodEntries as any);
  const starts = sorted.map((e) => e.startDateKey);

  const gaps: number[] = [];
  for (let i = 1; i < starts.length; i++) {
    const gap = getDateKeyDifferenceInDays(starts[i - 1], starts[i]);
    if (gap > 0 && gap <= 60) {
      gaps.push(gap);
    }
  }

  if (gaps.length === 0) return fallbackCycleLength;

  if (gaps.length === 1) return Math.round(gaps[0]);

  // Weighted average: more weight to recent gaps
  let weightSum = 0;
  let weightedTotal = 0;
  for (let i = 0; i < gaps.length; i++) {
    const weight = i + 1; // older gaps get smaller weight, recent larger
    weightedTotal += gaps[i] * weight;
    weightSum += weight;
  }

  const weighted = Math.round(weightedTotal / weightSum);
  return weighted;
}

export function computeNextPeriodStartKey(
  lastPeriodStartKey: string | null,
  effectiveCycleLength: number,
) {
  if (!lastPeriodStartKey) return null;
  const start = fromDateKey(lastPeriodStartKey);
  if (!start) return null;
  const next = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  next.setDate(next.getDate() + effectiveCycleLength);
  return toDateKey(next);
}

export function computeOvulationDateKey(nextPeriodStartKey: string | null) {
  if (!nextPeriodStartKey) return null;
  const next = fromDateKey(nextPeriodStartKey);
  if (!next) return null;
  const ov = new Date(next.getFullYear(), next.getMonth(), next.getDate());
  ov.setDate(ov.getDate() - 14);
  return toDateKey(ov);
}

export function computeFertileWindowKeys(ovulationDateKey: string | null) {
  if (!ovulationDateKey) return { start: null, end: null };
  const ov = fromDateKey(ovulationDateKey);
  if (!ov) return { start: null, end: null };
  const start = new Date(ov.getFullYear(), ov.getMonth(), ov.getDate());
  start.setDate(start.getDate() - 2);
  const end = new Date(ov.getFullYear(), ov.getMonth(), ov.getDate());
  end.setDate(end.getDate() + 2);
  return { start: toDateKey(start), end: toDateKey(end) };
}

export function getLatestPeriodStartKey(
  periodEntries: Array<{ startDateKey: string }>,
) {
  if (!Array.isArray(periodEntries) || periodEntries.length === 0) return null;
  const latest = getLatestPeriodEntry(periodEntries as any);
  return latest ? latest.startDateKey : null;
}

export function computeCycleSnapshot(params: {
  periodEntries: Array<{ startDateKey: string }>;
  fallbackCycleLength: number;
  periodLengthDays: number;
  currentDateKey?: string;
  lastPeriodStartKey?: string | null;
}): CycleSnapshot {
  const {
    periodEntries,
    fallbackCycleLength,
    periodLengthDays,
    currentDateKey,
    lastPeriodStartKey,
  } = params;

  const resolvedLastStartKey =
    lastPeriodStartKey ?? getLatestPeriodStartKey(periodEntries);

  if (!resolvedLastStartKey) {
    return {
      phase: null,
      cycleDay: null,
      effectiveCycleLength: null,
      nextPeriodDateKey: null,
      ovulationDateKey: null,
      fertileWindow: { start: null, end: null },
      ovulationDay: null,
      lastPeriodStartKey: null,
    };
  }

  const effectiveCycleLength = computeEffectiveCycleLength(
    periodEntries,
    fallbackCycleLength,
  );
  const nextPeriodDateKey = computeNextPeriodStartKey(
    resolvedLastStartKey,
    effectiveCycleLength,
  );
  const ovulationDateKey = computeOvulationDateKey(nextPeriodDateKey);
  const fertileWindow = computeFertileWindowKeys(ovulationDateKey);
  const ovulationDay = computeOvulationDayNumber(effectiveCycleLength);

  const todayKey = currentDateKey ?? toDateKey(new Date());
  const elapsed = getDateKeyDifferenceInDays(resolvedLastStartKey, todayKey);
  const cycleDay =
    elapsed > effectiveCycleLength * 1.5
      ? null
      : getNormalizedCycleDay(elapsed, effectiveCycleLength);
  const phase =
    cycleDay === null
      ? null
      : computeCyclePhase(cycleDay, effectiveCycleLength, periodLengthDays);

  return {
    phase,
    cycleDay,
    effectiveCycleLength,
    nextPeriodDateKey,
    ovulationDateKey,
    fertileWindow,
    ovulationDay,
    lastPeriodStartKey: resolvedLastStartKey,
  };
}
