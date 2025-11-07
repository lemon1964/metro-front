import lifePathData from "@data/meanings/life-path.json";
import nameNumberData from "@data/meanings/name-number.json";
import hintsDataJson from "@data/meanings/hints.json";
import temperamentData from "@data/meanings/temperament.json";

import type {
  HintsConfig,
  LifePathMeaning,
  NameTone,
  ComputedResult,
  FormState,
} from "@/@types/mom";

import { biorhythmToday, nextZeroCrossings } from "@/utils/biorhythm";
import { lifePathFromDOB, nameNumber, playfulNumberMeaning } from "@/utils/numerology";

const hintsData = hintsDataJson as HintsConfig;

function pickZone(v: number, low: number, high: number): "low" | "mid" | "high" {
  if (v < low) return "low";
  if (v > high) return "high";
  return "mid";
}

function randomSamples<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

export function buildHintsFromValue(channel: "phys" | "emo" | "intel", v: number): string[] {
  const { low, high } = hintsData.thresholds;
  const zone = pickZone(v, low, high);
  const pool = hintsData[channel][zone] ?? [];
  return randomSamples(pool, Math.min(2, pool.length));
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
  const zeros = nextZeroCrossings(form.dob, 21);

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
    zeros,
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
