import { getDateKeyDifferenceInDays, toDateKey } from "@/services/dateService";

export type CyclePhaseName =
  | "Menstrual"
  | "Follicular"
  | "Ovulation"
  | "Luteal";

export function computeLiveCycleDay(
  periodStartDateKey: string | null,
  totalCycleDays: number,
) {
  if (!periodStartDateKey) return 1;

  const todayKey = toDateKey(new Date());
  const elapsed = getDateKeyDifferenceInDays(periodStartDateKey, todayKey);
  if (elapsed < 0) return 1;

  return (elapsed % totalCycleDays) + 1;
}

export function computeCyclePhase(
  cycleDay: number,
  totalCycleDays: number,
  periodLengthDays: number,
): CyclePhaseName {
  const ovulationDay = Math.round(totalCycleDays * 0.5);

  if (cycleDay <= periodLengthDays) return "Menstrual";
  if (Math.abs(cycleDay - ovulationDay) <= 1) return "Ovulation";
  if (cycleDay < ovulationDay) return "Follicular";

  return "Luteal";
}
