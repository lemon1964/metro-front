// src/utils/biorhythm.ts
export type BiorhythmPoint = {
  dayOffset: number; // 0 = сегодня
  phys: number;
  emo: number;
  intel: number;
};

const TWO_PI = Math.PI * 2;
const P_PHYS = 23;
const P_EMO = 28;
const P_INT = 33;

export function daysSinceBirth(dobISO: string, refDate = new Date()): number {
  const dob = new Date(dobISO);
  const diff = refDate.getTime() - dob.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function biorhythmValue(t: number, period: number): number {
  return Math.sin((TWO_PI * t) / period);
}

export function biorhythmToday(dobISO: string, refDate = new Date()) {
  const t = daysSinceBirth(dobISO, refDate);
  return {
    t,
    phys: biorhythmValue(t, P_PHYS),
    emo: biorhythmValue(t, P_EMO),
    intel: biorhythmValue(t, P_INT),
  };
}

export function biorhythmRange(dobISO: string, days = 14, refDate = new Date()): BiorhythmPoint[] {
  const startT = daysSinceBirth(dobISO, refDate);
  const arr: BiorhythmPoint[] = [];
  for (let d = 0; d < days; d++) {
    const t = startT + d;
    arr.push({
      dayOffset: d,
      phys: biorhythmValue(t, P_PHYS),
      emo: biorhythmValue(t, P_EMO),
      intel: biorhythmValue(t, P_INT),
    });
  }
  return arr;
}

// новый хелпер: диапазон от startOffset дней относительно сегодня
export function biorhythmRangeFrom(dobISO: string, startOffsetDays: number, days: number) {
  const arr: Array<{ phys: number; emo: number; intel: number }> = [];
  for (let i = 0; i < days; i++) {
    const offset = startOffsetDays + i; // может быть отрицательным
    const d = new Date();
    d.setDate(d.getDate() + offset);
    const dob = new Date(dobISO + "T00:00:00");
    const t = Math.floor((d.getTime() - dob.getTime()) / 86400000);
    const phys = Math.sin((2 * Math.PI * t) / 23);
    const emo = Math.sin((2 * Math.PI * t) / 28);
    const intel = Math.sin((2 * Math.PI * t) / 33);
    arr.push({ phys, emo, intel });
  }
  return arr;
}

// export function nextZeroCrossings(dobISO: string, lookAheadDays = 21, refDate = new Date()) {
//   // грубая оценка ближайших «критических» дней — когда знак меняется
//   const t0 = daysSinceBirth(dobISO, refDate);
//   const check = (period: number) => {
//     let prev = biorhythmValue(t0, period);
//     for (let d = 1; d <= lookAheadDays; d++) {
//       const curr = biorhythmValue(t0 + d, period);
//       if ((prev <= 0 && curr > 0) || (prev >= 0 && curr < 0)) return d;
//       prev = curr;
//     }
//     return null;
//   };
//   return {
//     physIn:  check(P_PHYS),
//     emoIn:   check(P_EMO),
//     intelIn: check(P_INT),
//   };
// }

export function nextPeaks(dob: string) {
  const birth = new Date(dob + "T00:00:00");
  const today = new Date();
  const diffDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));

  function nextPeak(period: number): number {
    const base = period / 4; // первый максимум sin в t = P/4
    if (diffDays <= base) {
      return Math.round(base - diffDays);
    }
    const k = Math.ceil((diffDays - base) / period);
    const next = base + k * period;
    return Math.round(next - diffDays);
  }

  return {
    physIn: nextPeak(23),
    emoIn: nextPeak(28),
    intelIn: nextPeak(33),
  };
}

export function hintFromValue(v: number, label: "phys" | "emo" | "intel"): string {
  const strong = v > 0.5;
  const weak = v < -0.5;

  if (label === "phys") {
    if (strong) return "Тело на пике — хорошее время для действий и спорта.";
    if (weak) return "Бережный режим: сон, прогулка, тёплый душ.";
    return "Нейтральный фон — держи умеренный темп.";
  }
  if (label === "emo") {
    if (strong) return "Эмоциональный подъём: общение, творчество, встречи.";
    if (weak) return "Заземление: меньше новостей, больше тишины.";
    return "Спокойно и ровно — хороший день для рутины.";
  }
  // intel
  if (strong) return "Голова ясная — идеальна логика и планирование.";
  if (weak) return "Не перегружай мозг, делегируй сложное.";
  return "Нормальный тонус — делай по списку без фанатизма.";
}
