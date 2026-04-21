type SymptomLogLike = {
  dateKey: string;
  symptoms: string[];
};

export function getRecentSymptoms(logs: SymptomLogLike[], maxLogs = 5) {
  return [...logs]
    .sort((a, b) => b.dateKey.localeCompare(a.dateKey))
    .slice(0, maxLogs)
    .flatMap((log) => log.symptoms);
}
