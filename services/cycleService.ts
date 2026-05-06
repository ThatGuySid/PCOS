import {
    fromDateKey,
    getDateKeyDifferenceInDays,
    getLatestPeriodEntry,
    sortPeriodEntriesByStartDate,
    toDateKey,
} from "@/services/dateService";

// ── Types ─────────────────────────────────────────────────────────────────────

export type CyclePhaseName =
  | "Menstrual"
  | "Follicular"
  | "Ovulation"
  | "Luteal";

export type ConfidenceLevel = "low" | "medium" | "high" | "very_high";

export type PredictionWindow = {
  earliest: string | null; // ISO date key
  latest: string | null; // ISO date key
  point: string | null; // single best estimate (null if too uncertain)
};

export type FertileWindow = {
  start: string | null;
  end: string | null;
};

export type CycleSnapshot = {
  phase: CyclePhaseName | null;
  cycleDay: number | null;
  effectiveCycleLength: number | null;
  nextPeriodWindow: PredictionWindow;
  ovulationDateKey: string | null;
  fertileWindow: FertileWindow;
  ovulationDay: number | null;
  lastPeriodStartKey: string | null;
  confidence: ConfidenceLevel;
  confidenceScore: number; // 0.0 – 1.0
  insight: string | null; // human-readable explanation
  trendDirection: "shortening" | "lengthening" | "stable" | "unknown";
};

// ── Internal helpers ──────────────────────────────────────────────────────────

function addDays(dateKey: string, days: number): string | null {
  const d = fromDateKey(dateKey);
  if (!d) return null;
  const result = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  result.setDate(result.getDate() + days);
  return toDateKey(result);
}

function normalizeCycleLength(value: number | null | undefined) {
  if (!value || !Number.isFinite(value) || value < 1) return 28;
  return Math.round(value);
}

function normalizePeriodLength(value: number | null | undefined) {
  if (!value || !Number.isFinite(value) || value < 1) return 5;
  return Math.round(value);
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const avg = mean(values);
  const variance =
    values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
  return Math.sqrt(variance);
}

// ── Step 1: Extract raw cycle gaps from period entries ────────────────────────

function extractGaps(periodEntries: Array<{ startDateKey: string }>): number[] {
  if (!Array.isArray(periodEntries) || periodEntries.length < 2) return [];

  const sorted = sortPeriodEntriesByStartDate(periodEntries as any);
  const starts = sorted.map((e) => e.startDateKey);
  const gaps: number[] = [];

  for (let i = 1; i < starts.length; i++) {
    const gap = getDateKeyDifferenceInDays(starts[i - 1], starts[i]);
    // Sanity check — ignore clearly invalid gaps
    if (gap >= 14 && gap <= 90) gaps.push(gap);
  }

  return gaps;
}

// ── Step 2: Weighted average — recent gaps count more ────────────────────────
// Uses exponential-style decay: most recent gap has highest weight.

function weightedAverageCycleLength(gaps: number[]): number {
  if (gaps.length === 0) return 0;
  if (gaps.length === 1) return gaps[0];

  let weightSum = 0;
  let weightedTotal = 0;

  for (let i = 0; i < gaps.length; i++) {
    // Weight increases exponentially for recent gaps
    // gaps[0] is oldest, gaps[n-1] is most recent
    const weight = Math.pow(2, i); // 1, 2, 4, 8, 16...
    weightedTotal += gaps[i] * weight;
    weightSum += weight;
  }

  return weightedTotal / weightSum;
}

// ── Step 3: Trend detection ───────────────────────────────────────────────────
// Compare recent half of cycles to older half.

function detectTrend(
  gaps: number[],
): "shortening" | "lengthening" | "stable" | "unknown" {
  if (gaps.length < 3) return "unknown";

  const mid = Math.floor(gaps.length / 2);
  const older = gaps.slice(0, mid);
  const newer = gaps.slice(gaps.length - mid);

  const olderMean = mean(older);
  const newerMean = mean(newer);
  const diff = newerMean - olderMean;

  if (Math.abs(diff) < 1.5) return "stable";
  return diff < 0 ? "shortening" : "lengthening";
}

// ── Step 4: Trend adjustment ──────────────────────────────────────────────────
// If cycles are consistently shortening or lengthening, nudge the prediction.

function trendAdjustment(
  trend: "shortening" | "lengthening" | "stable" | "unknown",
  gaps: number[],
): number {
  if (trend === "unknown" || trend === "stable" || gaps.length < 3) return 0;

  const mid = Math.floor(gaps.length / 2);
  const older = gaps.slice(0, mid);
  const newer = gaps.slice(gaps.length - mid);
  const diff = mean(newer) - mean(older);

  // Cap trend adjustment at ±3 days to avoid overcorrecting
  return Math.max(-3, Math.min(3, diff * 0.5));
}

// ── Step 5: Confidence scoring ────────────────────────────────────────────────
// Combines number of cycles logged, variability, and recency of last log.

export function computeConfidenceScore(params: {
  gaps: number[];
  lastPeriodStartKey: string | null;
  cycleRegularity: "Regular" | "Irregular" | null;
}): number {
  const { gaps, lastPeriodStartKey, cycleRegularity } = params;

  if (gaps.length === 0) return 0.1; // Only profile data, no logs

  // Component 1: data volume (0–0.45)
  // Saturates around 6 cycles
  const volumeScore = Math.min(0.45, gaps.length * 0.08);

  // Component 2: consistency (0–0.40)
  // Lower std deviation = higher score
  const sd = stdDev(gaps);
  const consistencyScore = sd === 0 ? 0.4 : Math.max(0, 0.4 - (sd / 10) * 0.4);

  // Component 3: recency (0–0.15)
  // Penalise if last logged period was more than 90 days ago
  let recencyScore = 0.15;
  if (lastPeriodStartKey) {
    const todayKey = toDateKey(new Date());
    const daysSince = getDateKeyDifferenceInDays(lastPeriodStartKey, todayKey);
    if (daysSince > 90) recencyScore = 0.0;
    else if (daysSince > 60) recencyScore = 0.05;
    else if (daysSince > 45) recencyScore = 0.1;
  }

  // Penalty for self-reported irregularity
  const regularityPenalty = cycleRegularity === "Irregular" ? 0.1 : 0;

  const raw = volumeScore + consistencyScore + recencyScore - regularityPenalty;
  return Math.max(0.05, Math.min(1.0, raw));
}

export function confidenceLevel(score: number): ConfidenceLevel {
  if (score >= 0.8) return "very_high";
  if (score >= 0.55) return "high";
  if (score >= 0.3) return "medium";
  return "low";
}

// ── Step 6: Prediction window ─────────────────────────────────────────────────
// Widens or narrows based on confidence + variability.

function buildPredictionWindow(
  pointEstimateKey: string,
  confidenceScore: number,
  gaps: number[],
  trend: "shortening" | "lengthening" | "stable" | "unknown",
): PredictionWindow {
  const sd = stdDev(gaps);
  const level = confidenceLevel(confidenceScore);

  // Window half-width in days
  let halfWidth: number;

  if (level === "very_high") {
    halfWidth = sd < 1.5 ? 0 : 1; // Single day or ±1
  } else if (level === "high") {
    halfWidth = Math.max(1, Math.ceil(sd * 0.75));
  } else if (level === "medium") {
    halfWidth = Math.max(2, Math.ceil(sd));
  } else {
    // Low confidence — wide window
    halfWidth = gaps.length === 0 ? 7 : Math.max(4, Math.ceil(sd * 1.5));
  }

  // Unknown/shifting trend → widen slightly
  if (trend === "shortening" || trend === "lengthening") halfWidth += 1;

  const earliest = addDays(pointEstimateKey, -halfWidth);
  const latest = addDays(pointEstimateKey, halfWidth);

  // Only show a single-day point estimate if high enough confidence
  const point =
    level === "very_high" || (level === "high" && halfWidth <= 1)
      ? pointEstimateKey
      : null;

  return { earliest, latest, point };
}

// ── Step 7: Symptom-based adjustment ─────────────────────────────────────────
// If spotting/cramps consistently appear N days before period, pull estimate earlier.

function computeSymptomAdjustment(
  symptomLogs: Array<{
    dateKey: string;
    symptoms: string[];
    cycleDay: number;
    cyclePhase: string;
  }>,
  effectiveCycleLength: number,
): number {
  if (symptomLogs.length < 3) return 0;

  // Find logs that contained spotting or cramps in the luteal/late-cycle phase
  const lateCycleLogs = symptomLogs.filter(
    (log) =>
      log.cyclePhase === "Luteal" &&
      (log.symptoms.includes("Spotting") || log.symptoms.includes("Cramps")),
  );

  if (lateCycleLogs.length < 2) return 0;

  // Average how many days before the predicted period end these appeared
  const cycleDays = lateCycleLogs.map((log) => log.cycleDay);
  const avgSymptomDay = mean(cycleDays);

  // If symptoms appear on average 3+ days before end of cycle, nudge earlier
  const daysBeforeEnd = effectiveCycleLength - avgSymptomDay;
  if (daysBeforeEnd >= 3) return -1; // Pull prediction 1 day earlier
  return 0;
}

// ── Step 8: Insight message generation ───────────────────────────────────────

function buildInsight(params: {
  gaps: number[];
  confidenceScore: number;
  trend: "shortening" | "lengthening" | "stable" | "unknown";
  sd: number;
  symptomAdjustment: number;
  cycleRegularity: "Regular" | "Irregular" | null;
}): string | null {
  const {
    gaps,
    confidenceScore,
    trend,
    sd,
    symptomAdjustment,
    cycleRegularity,
  } = params;
  const level = confidenceLevel(confidenceScore);

  if (gaps.length === 0) {
    return "Prediction is based on your profile settings. Log your first period to start personalising this.";
  }

  if (gaps.length === 1) {
    return "Based on one logged cycle. Log more periods to improve accuracy.";
  }

  if (level === "very_high") {
    return "Your cycles have been very consistent. This prediction is likely accurate to within a day.";
  }

  if (trend === "shortening") {
    return "Your recent cycles have been getting shorter. The estimate reflects this shift.";
  }

  if (trend === "lengthening") {
    return "Your recent cycles have been getting longer. The estimate accounts for this trend.";
  }

  if (sd > 5) {
    return "Your cycle lengths vary quite a bit, so this estimate covers a wider range.";
  }

  if (sd > 3) {
    return "Recent cycles have varied somewhat, so the prediction window is moderately wide.";
  }

  if (level === "high" && sd <= 3) {
    return "Recent cycles have become more consistent. Predictions are now more precise.";
  }

  if (symptomAdjustment < 0) {
    return "Your symptoms tend to appear shortly before your period, which slightly adjusted this estimate.";
  }

  if (cycleRegularity === "Irregular") {
    return "You marked your cycles as irregular. Estimates will naturally be broader until patterns emerge.";
  }

  return "Prediction is based on your logged cycle history.";
}

// ── Main exports ──────────────────────────────────────────────────────────────

export function computeLiveCycleDay(
  periodStartDateKey: string | null,
  effectiveCycleLength: number,
): number | null {
  const safeCycleLength = normalizeCycleLength(effectiveCycleLength);
  if (!periodStartDateKey) return null;

  const todayKey = toDateKey(new Date());
  const elapsed = getDateKeyDifferenceInDays(periodStartDateKey, todayKey);
  if (elapsed < 0) return 1;

  // If it's been more than 1.5 cycles without a new log, return null
  // (prevents showing Day 45 of a 28-day cycle)
  if (elapsed > safeCycleLength * 1.5) return null;

  return (elapsed % safeCycleLength) + 1;
}

export function computeCyclePhase(
  cycleDay: number,
  effectiveCycleLength: number,
  periodLengthDays: number,
): CyclePhaseName {
  const safeCycleLength = normalizeCycleLength(effectiveCycleLength);
  const safePeriodLength = normalizePeriodLength(periodLengthDays);
  const ovulationDay = safeCycleLength - 13; // Luteal is always ~14d

  if (cycleDay <= safePeriodLength) return "Menstrual";
  if (cycleDay === ovulationDay) return "Ovulation";
  if (cycleDay < ovulationDay) return "Follicular";
  return "Luteal";
}

export function computeEffectiveCycleLength(
  periodEntries: Array<{ startDateKey: string }>,
  fallbackCycleLength: number,
): number {
  const safeFallbackCycleLength = normalizeCycleLength(fallbackCycleLength);
  return safeFallbackCycleLength;
}

export function computeOvulationDateKey(
  nextPeriodStartKey: string | null,
): string | null {
  if (!nextPeriodStartKey) return null;
  return addDays(nextPeriodStartKey, -14);
}

export function computeFertileWindowKeys(
  ovulationDateKey: string | null,
): FertileWindow {
  if (!ovulationDateKey) return { start: null, end: null };
  return {
    start: addDays(ovulationDateKey, -2),
    end: addDays(ovulationDateKey, 2),
  };
}

export function getLatestPeriodStartKey(
  periodEntries: Array<{ startDateKey: string }>,
): string | null {
  if (!Array.isArray(periodEntries) || periodEntries.length === 0) return null;
  const latest = getLatestPeriodEntry(periodEntries as any);
  return latest ? latest.startDateKey : null;
}

// ── Master snapshot function ──────────────────────────────────────────────────

export function computeCycleSnapshot(params: {
  periodEntries: Array<{ startDateKey: string }>;
  fallbackCycleLength: number;
  periodLengthDays: number;
  cycleRegularity?: "Regular" | "Irregular" | null;
  symptomLogs?: Array<{
    dateKey: string;
    symptoms: string[];
    cycleDay: number;
    cyclePhase: string;
  }>;
  currentDateKey?: string;
  lastPeriodStartKey?: string | null;
}): CycleSnapshot {
  const {
    periodEntries,
    fallbackCycleLength,
    periodLengthDays,
    cycleRegularity = null,
    symptomLogs = [],
    currentDateKey,
    lastPeriodStartKey,
  } = params;

  const resolvedLastStartKey =
    lastPeriodStartKey ?? getLatestPeriodStartKey(periodEntries);
  const safeFallbackCycleLength = normalizeCycleLength(fallbackCycleLength);

  // ── No data at all — full empty state ────────────────────────────────────
  if (!resolvedLastStartKey) {
    return {
      phase: null,
      cycleDay: null,
      effectiveCycleLength: safeFallbackCycleLength,
      nextPeriodWindow: { earliest: null, latest: null, point: null },
      ovulationDateKey: null,
      fertileWindow: { start: null, end: null },
      ovulationDay: null,
      lastPeriodStartKey: null,
      confidence: "low",
      confidenceScore: 0,
      insight: "Log your first period to start tracking your cycle.",
      trendDirection: "unknown",
    };
  }

  // ── Core computations ─────────────────────────────────────────────────────
  const gaps = extractGaps(periodEntries);
  const trend = detectTrend(gaps);
  const effectiveCycleLength = computeEffectiveCycleLength(
    periodEntries,
    safeFallbackCycleLength,
  );

  // Symptom adjustment (pull earlier if spotting/cramps consistently precede period)
  const symptomAdj = computeSymptomAdjustment(
    symptomLogs,
    effectiveCycleLength,
  );

  // Point estimate for next period
  const rawNextKey = addDays(
    resolvedLastStartKey,
    effectiveCycleLength + symptomAdj,
  );

  // Confidence
  const confidenceScore = computeConfidenceScore({
    gaps,
    lastPeriodStartKey: resolvedLastStartKey,
    cycleRegularity,
  });
  const confidence = confidenceLevel(confidenceScore);

  // Prediction window
  const nextPeriodWindow = rawNextKey
    ? buildPredictionWindow(rawNextKey, confidenceScore, gaps, trend)
    : { earliest: null, latest: null, point: null };

  // Ovulation + fertile window (off point estimate, or midpoint of window)
  const ovulationBase = nextPeriodWindow.point ?? rawNextKey;
  const ovulationDateKey = computeOvulationDateKey(ovulationBase);
  const fertileWindow = computeFertileWindowKeys(ovulationDateKey);
  const ovulationDay = effectiveCycleLength - 13;

  // Current cycle day + phase
  const todayKey = currentDateKey ?? toDateKey(new Date());
  const elapsed = getDateKeyDifferenceInDays(resolvedLastStartKey, todayKey);
  const cycleDay =
    elapsed < 0
      ? 1
      : elapsed > effectiveCycleLength * 1.5
        ? null
        : (elapsed % effectiveCycleLength) + 1;

  const phase =
    cycleDay === null
      ? null
      : computeCyclePhase(cycleDay, effectiveCycleLength, periodLengthDays);

  // Insight
  const insight = buildInsight({
    gaps,
    confidenceScore,
    trend,
    sd: stdDev(gaps),
    symptomAdjustment: symptomAdj,
    cycleRegularity,
  });

  return {
    phase,
    cycleDay,
    effectiveCycleLength,
    nextPeriodWindow,
    ovulationDateKey,
    fertileWindow,
    ovulationDay,
    lastPeriodStartKey: resolvedLastStartKey,
    confidence,
    confidenceScore,
    insight,
    trendDirection: trend,
  };
}
