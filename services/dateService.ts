import {
    buildDateRangeKeys,
    flattenUniqueDateKeys,
    fromDateKey,
    getLatestPeriodEntry,
    sortPeriodEntriesByStartDate,
    toDateKey,
} from "@/constants/cycleUtils";

export {
    buildDateRangeKeys,
    flattenUniqueDateKeys, fromDateKey, getLatestPeriodEntry, sortPeriodEntriesByStartDate, toDateKey
};

export function getDateKeyDifferenceInDays(startKey: string, endKey: string) {
  const start = fromDateKey(startKey);
  const end = fromDateKey(endKey);
  if (!start || !end) return 0;

  return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}
