// src/utils/temperament.ts
export type TemperamentKey = "choleric" | "sanguine" | "phlegmatic" | "melancholic";

export type TemperamentScores = Record<TemperamentKey, number>;

export function scoreTemperament(answers: TemperamentKey[]): TemperamentScores {
  const s: TemperamentScores = { choleric: 0, sanguine: 0, phlegmatic: 0, melancholic: 0 };
  for (const a of answers) s[a] += 1;
  return s;
}

export function topTemperaments(scores: TemperamentScores): TemperamentKey[] {
  const entries = Object.entries(scores) as [TemperamentKey, number][];
  entries.sort((a, b) => b[1] - a[1]);
  const top1 = entries[0][1];
  return entries.filter(([, v]) => v === top1).map(([k]) => k);
}
