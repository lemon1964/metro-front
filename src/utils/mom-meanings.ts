// src/utils/mom-meanings.ts
import lifePathData from "@data/meanings/life-path.json";
import nameNumberData from "@data/meanings/name-number.json";
import hintsDataJson from "@data/meanings/hints.json";
import temperamentData from "@data/meanings/temperament.json";

import { biorhythmToday, nextPeaks } from "@/utils/biorhythm";
import { lifePathFromDOB, nameNumber, playfulNumberMeaning } from "@/utils/numerology";

const hintsData = hintsDataJson as HintsConfig;

function pickZone(v: number, low: number, high: number): "low" | "mid" | "high" {
  if (v < low) return "low";
  if (v > high) return "high";
  return "mid";
}

export function buildHintsFromValue(channel: "phys" | "emo" | "intel", v: number): string[] {
  const low = hintsData.thresholds.low;
  const high = hintsData.thresholds.high;
  const zone = pickZone(v, low, high);
  const pool: string[] = hintsData[channel][zone] ?? [];

  // детерминированно: берём первые 2
  const limit = pool.length >= 2 ? 2 : pool.length;
  return pool.slice(0, limit);
}

export function buildLifePathMeaning(lpValue: string): LifePathMeaning {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (lifePathData as Record<string, any>)[lpValue];
  if (!raw) {
    return {
      title: "Нейтральный день",
      short: "Двигайся мягко и осознанно.",
      long: [],
      do: [],
      dont: [],
      motto: "",
    };
  }
  return {
    title: raw.title,
    short: raw.short,
    long: raw.long ?? [],
    do: raw.do ?? [],
    dont: raw.dont ?? [],
    motto: raw.motto ?? "",
  };
}

export function buildNameTone(nameRaw: string, reducedNumber: number): NameTone {
  const name = (nameRaw || "").toLowerCase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const baseByNumber = (nameNumberData as any).base_by_number ?? {};
  const base = baseByNumber[String(reducedNumber)] || "";

  const overrides: string[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const list = ((nameNumberData as any).keyword_overrides || []) as {
    match: string[];
    text: string;
  }[];

  for (const item of list) {
    if (item.match.some(m => name.includes(m))) {
      overrides.push(item.text);
    }
  }

  return { base, overrides };
}

export function computeResult(form: FormState): ComputedResult | null {
  if (!form.dob) return null;

  const bio = biorhythmToday(form.dob);
  const peaks = nextPeaks(form.dob);

  const physHints = buildHintsFromValue("phys", bio.phys);
  const emoHints = buildHintsFromValue("emo", bio.emo);
  const intHints = buildHintsFromValue("intel", bio.intel);

  const lp = lifePathFromDOB(form.dob);
  const lpMeaning = buildLifePathMeaning(lp.value);

  const nn = nameNumber(form.name);
  const nameTone = buildNameTone(form.name, nn.value);

  const favText = playfulNumberMeaning(Number(form.fav) || 0);

  const temperamentProfilesCount = Object.keys(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (temperamentData as any).profiles || {}
  ).length;

  return {
    bio,
    peaks,
    physHints,
    emoHints,
    intHints,
    lp,
    lpMeaning,
    nn,
    nameTone,
    favText,
    temperamentProfilesCount,
  };
}
