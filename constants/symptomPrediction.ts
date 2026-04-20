export type PredictionResult = {
  symptoms: string[];
  confidenceLabel: "High" | "Medium" | "Low";
};

export const SYMPTOM_OPTIONS = [
  "Cramps",
  "Bloating",
  "Headache",
  "Mood Swings",
  "Fatigue",
  "Acne",
  "Nausea",
  "Dizziness",
  "Lower Back Pain",
  "Anxiety",
  "Insomnia",
  "Food Cravings",
  "Spotting",
  "Heavy Flow",
] as const;

const PREDICTION_MAP: Record<string, string[]> = {
  Cramps: [
    "cramp",
    "cramps",
    "abdomen pain",
    "lower belly pain",
    "pelvic pain",
  ],
  Bloating: ["bloat", "bloated", "gas", "swollen belly"],
  Headache: ["headache", "head pain", "migraine"],
  "Mood Swings": ["mood swing", "irritable", "irritated", "emotional", "angry"],
  Fatigue: ["fatigue", "tired", "low energy", "exhausted", "sleepy"],
  Acne: ["acne", "pimple", "breakout", "skin breakout"],
  Nausea: ["nausea", "nauseous", "queasy", "vomit"],
  Dizziness: ["dizzy", "dizziness", "lightheaded", "faint"],
  "Lower Back Pain": ["back pain", "lower back", "backache"],
  Anxiety: ["anxiety", "anxious", "panic"],
  Insomnia: ["insomnia", "can not sleep", "cant sleep", "sleepless"],
  "Food Cravings": ["craving", "cravings", "hungry", "sweet cravings"],
  Spotting: ["spotting", "spot", "light bleeding"],
  "Heavy Flow": ["heavy flow", "heavy bleeding", "soaking pad"],
};

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/\bi\s*am\b/g, "i am")
    .replace(/\bcan't\b/g, "cant")
    .replace(/\bcannot\b/g, "cant")
    .replace(/\bcan not\b/g, "cant")
    .replace(/\blight\s*headed\b/g, "lightheaded")
    .replace(/\bperiod\s*pain\b/g, "cramps")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshteinDistance(a: string, b: string) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) =>
      i === 0 ? j : j === 0 ? i : 0,
    ),
  );

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[a.length][b.length];
}

function isFuzzyTokenMatch(inputToken: string, keywordToken: string) {
  if (!inputToken || !keywordToken) return false;
  if (inputToken === keywordToken) return true;

  const maxDistance = keywordToken.length <= 5 ? 1 : 2;
  return levenshteinDistance(inputToken, keywordToken) <= maxDistance;
}

function keywordMatchesText(
  normalizedText: string,
  textTokens: string[],
  keyword: string,
) {
  if (!keyword) return false;

  const normalizedKeyword = normalizeText(keyword);
  if (!normalizedKeyword) return false;

  if (normalizedText.includes(normalizedKeyword)) {
    return true;
  }

  const keywordTokens = normalizedKeyword.split(" ").filter(Boolean);
  if (keywordTokens.length === 0) return false;

  return keywordTokens.every((keywordToken) =>
    textTokens.some((token) => isFuzzyTokenMatch(token, keywordToken)),
  );
}

export function predictSymptomsFromText(input: string): PredictionResult {
  const normalized = normalizeText(input);

  if (!normalized) {
    return { symptoms: [], confidenceLabel: "Low" };
  }

  const textTokens = normalized.split(" ").filter(Boolean);

  const scoredMatches = Object.entries(PREDICTION_MAP)
    .map(([symptom, keywords]) => {
      let exactMatchCount = 0;
      let fuzzyMatchCount = 0;

      keywords.forEach((keyword) => {
        const normalizedKeyword = normalizeText(keyword);
        if (!normalizedKeyword) return;

        if (normalized.includes(normalizedKeyword)) {
          exactMatchCount += 1;
          return;
        }

        if (keywordMatchesText(normalized, textTokens, keyword)) {
          fuzzyMatchCount += 1;
        }
      });

      const score = exactMatchCount * 1 + fuzzyMatchCount * 0.55;

      return {
        symptom,
        exactMatchCount,
        score,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const predicted = scoredMatches.map((item) => item.symptom);

  const totalScore = scoredMatches.reduce((sum, item) => sum + item.score, 0);
  const strongSignals = scoredMatches.filter(
    (item) => item.exactMatchCount > 0 || item.score >= 1.2,
  ).length;

  const confidenceScore = Math.min(
    1,
    strongSignals * 0.35 +
      totalScore * 0.08 +
      Math.min(predicted.length, 4) * 0.06,
  );

  const confidenceLabel: PredictionResult["confidenceLabel"] =
    confidenceScore >= 0.75
      ? "High"
      : confidenceScore >= 0.45
        ? "Medium"
        : "Low";

  return { symptoms: predicted, confidenceLabel };
}
