// src/components/features/HomeClient.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import FadeCard from "@ui/FadeCard";
import TemperamentQuiz from "@features/TemperamentQuiz";
import BiorhythmChart from "@features/BiorhythmChart";

import { biorhythmToday, nextZeroCrossings } from "@/utils/biorhythm";
import { lifePathFromDOB, nameNumber, playfulNumberMeaning } from "@/utils/numerology";

import lifePathData from "@data/meanings/life-path.json";
import nameNumberData from "@data/meanings/name-number.json";
import hintsData from "@data/meanings/hints.json";
import temperamentData from "@data/meanings/temperament.json";

import DemoBadge from "@ui/DemoBadge";

function pickZone(v: number, low: number, high: number): "low" | "mid" | "high" {
  if (v < low) return "low";
  if (v > high) return "high";
  return "mid";
}
function randomSamples<T>(arr: T[], n: number): T[] {
  const copy = [...arr],
    out: T[] = [];
  for (let i = 0; i < n && copy.length; i++)
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  return out;
}
function buildHintsFromValue(channel: "phys" | "emo" | "intel", v: number): string[] {
  const low = hintsData.thresholds.low;
  const high = hintsData.thresholds.high;
  const zone = pickZone(v, low, high);
  const pool: string[] = hintsData[channel][zone] ?? [];
  return randomSamples(pool, Math.min(2, pool.length));
}

function buildLifePathMeaning(lpValue: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lp: any = (lifePathData as any)[lpValue];
  if (!lp)
    return {
      title: "Нейтральный день",
      short: "Двигайся мягко и осознанно.",
      long: [],
      do: [],
      dont: [],
      motto: "",
    };
  return {
    title: lp.title,
    short: lp.short,
    long: lp.long ?? [],
    do: lp.do ?? [],
    dont: lp.dont ?? [],
    motto: lp.motto ?? "",
  };
}
function buildNameTone(nameRaw: string, reducedNumber: number) {
  const name = (nameRaw || "").toLowerCase();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const base = (nameNumberData as any).base_by_number[String(reducedNumber)] || "";
  const overrides: string[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const item of (nameNumberData as any).keyword_overrides || []) {
    if (item.match.some((m: string) => name.includes(m))) overrides.push(item.text);
  }
  return { base, overrides };
}

type FormState = { dob: string; name: string; fav: string };

export default function HomeClient({ headline }: { headline: string }) {
  const router = useRouter();
  // 1) ПУСТО на старте — для совпадения SSR/CSR
  const [form, setForm] = useState<FormState>({ dob: "", name: "", fav: "" });
  
  // 2) Подтягиваем сохранённые данные не-синхронно
  useEffect(() => {
    // читаем и применяем после кадра
    const id = requestAnimationFrame(() => {
      try {
        const url = new URL(window.location.href);
        const wantReset = url.searchParams.get("reset") === "1";

        if (wantReset) {
          localStorage.removeItem("mom_form");
          // чистим URL без setState
          url.searchParams.delete("reset");
          window.history.replaceState({}, "", url.toString());
          return; // форма остаётся пустой
        }

        const raw = localStorage.getItem("mom_form");
        if (raw) {
          const parsed = JSON.parse(raw) as FormState;
          // применяем уже после первого кадра — без «синхронного setState в эффекте»
          setForm(parsed);
        }
      } catch {}
    });

    return () => cancelAnimationFrame(id);
  }, []);

  // 3) Сохраняем форму (это допустимо в эффекте — состояния не читаем и не синхронны с SSR)
  useEffect(() => {
    try { localStorage.setItem("mom_form", JSON.stringify(form)); } catch {}
  }, [form]);
  
  const result = useMemo(() => {
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
    const favText = playfulNumberMeaning(Number(form.fav));
    const temperamentProfilesCount = Object.keys(temperamentData.profiles || {}).length;
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
  }, [form.dob, form.name, form.fav]);

  // простой «щелчок» (WebAudio)
  const click = () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = 880;
      gain.gain.value = 0.05;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      setTimeout(() => {
        osc.stop();
        ctx.close();
      }, 100);
    } catch {}
  };

  const clarity = result ? result.bio.intel : null;
  const clarityText = useMemo(() => {
    if (clarity == null) return "";
    const v = clarity;
    if (v > 0.6)
      return `Сегодня индекс ясности ${v.toFixed(2)} — самое время для планирования и решений.`;
    if (v > 0.2)
      return `Сегодня индекс ясности ${v.toFixed(2)} — нормальный тонус, делай по списку.`;
    if (v > -0.2) return `Сегодня индекс ясности ${v.toFixed(2)} — нейтрально, не разгоняйся.`;
    if (v > -0.6)
      return `Сегодня индекс ясности ${v.toFixed(2)} — береги концентрацию, дроби задачи.`;
    return `Сегодня индекс ясности ${v.toFixed(2)} — сложные дела лучше отложить.`;
  }, [clarity]);

  function onField<K extends keyof FormState>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(s => ({ ...s, [key]: e.target.value }));
  }

  return (
    <main className="min-h-screen p-6 pb-28 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="pt-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight" suppressHydrationWarning>
            {headline}
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-2xl">
            Введите пару данных — и получите лёгкое «зеркало про вас» прямо сейчас.
          </p>
          {result && (
            <div className="mt-2 text-sm px-3 py-2 rounded-lg bg-white/60 dark:bg-white/10 inline-block">
              {clarityText}
            </div>
          )}
        </header>

        {/* Форма */}
        <FadeCard>
          <form className="grid gap-4 md:grid-cols-3" onSubmit={e => e.preventDefault()}>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Дата рождения</label>
              <input
                type="date"
                value={form.dob}
                onChange={onField("dob")}
                // onChange={e => setForm((s: any) => ({ ...s, dob: e.target.value }))}
                className="rounded-xl border px-3 py-2 bg-white/80 dark:bg-white/10"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Имя (лат/рус)</label>
              <input
                type="text"
                placeholder="Марина / Alex"
                value={form.name}
                onChange={onField("name")}
                // onChange={e => setForm((s: any) => ({ ...s, name: e.target.value }))}
                className="rounded-xl border px-3 py-2 bg-white/80 dark:bg-white/10"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Любимое число</label>
              <input
                type="number"
                placeholder="7"
                value={form.fav}
                onChange={onField("fav")}
                // onChange={e => setForm((s: any) => ({ ...s, fav: e.target.value }))}
                className="rounded-xl border px-3 py-2 bg-white/80 dark:bg-white/10"
              />
            </div>
          </form>
          <p className="mt-3 text-xs text-gray-500">
            Развлекательный сервис. Не заменяет медицинские или психологические рекомендации.
          </p>
        </FadeCard>

        {/* Результаты */}
        {result && (
          <section className="grid gap-6 md:grid-cols-3">
            {/* Биоритмы */}
            <FadeCard>
              <h2 className="text-xl font-bold mb-2">Биоритмы — сегодня</h2>
              <div className="space-y-1">
                <div>
                  Физический: <b>{result.bio.phys.toFixed(2)}</b>
                </div>
                <div>
                  Эмоциональный: <b>{result.bio.emo.toFixed(2)}</b>
                </div>
                <div>
                  Интеллектуальный: <b>{result.bio.intel.toFixed(2)}</b>
                </div>
              </div>
              <ul className="mt-3 text-sm list-disc pl-5 space-y-1">
                {result.physHints.map((h, i) => (
                  <li key={"p" + i}>{h}</li>
                ))}
                {result.emoHints.map((h, i) => (
                  <li key={"e" + i}>{h}</li>
                ))}
                {result.intHints.map((h, i) => (
                  <li key={"i" + i}>{h}</li>
                ))}
              </ul>
              <div className="mt-3 text-xs text-gray-500">
                Ближайшие «критические» дни: физ: {result.zeros.physIn ?? "—"} дн., эмо:{" "}
                {result.zeros.emoIn ?? "—"} дн., интеллект: {result.zeros.intelIn ?? "—"} дн.
              </div>

              {/* Кнопки */}
              <div className="mt-4 flex gap-2 flex-wrap">
                <button
                  className="rounded-xl px-4 py-2 border shadow-sm hover:shadow transition"
                  onClick={() => {
                    click(); /* апсел позже */
                  }}
                >
                  График на 14 дней • 25 ₽
                </button>

                {/* Открыть изображение */}
                <button
                  className="rounded-xl px-4 py-2 border shadow-sm hover:shadow transition"
                  onClick={() => {
                    click();
                    const params = new URLSearchParams({
                      name: form.name || "Гость",
                      lp: result.lp.value,
                      phys: result.bio.phys.toFixed(2),
                      emo: result.bio.emo.toFixed(2),
                      intel: result.bio.intel.toFixed(2),
                    });
                    window.open(`/api/og?${params.toString()}`, "_blank");
                  }}
                >
                  Открыть картинку для соцсетей
                </button>

                {/* Поделиться ссылкой (обновляет URL, чтобы OG подгрузился) */}
                <button
                  className="rounded-xl px-4 py-2 border shadow-sm hover:shadow transition"
                  onClick={() => {
                    click();
                    const params = new URLSearchParams({
                      name: form.name || "Гость",
                      lp: result.lp.value,
                      phys: result.bio.phys.toFixed(2),
                      emo: result.bio.emo.toFixed(2),
                      intel: result.bio.intel.toFixed(2),
                    });
                    router.replace(`/?${params.toString()}`);
                    alert("Ссылка готова — скопируй её из адресной строки.");
                  }}
                >
                  Поделиться ссылкой
                </button>
              </div>

              {/* График */}
              <div className="mt-4">
                <BiorhythmChart dob={form.dob} days={14} />
              </div>
            </FadeCard>

            {/* Life Path + Имя */}
            <FadeCard>
              <h2 className="text-xl font-bold mb-2">Число жизненного пути</h2>
              <div className="text-5xl font-black">{result.lp.value}</div>
              <p className="mt-2 text-sm leading-relaxed">{result.lpMeaning.short}</p>
              {result.lpMeaning.long.length > 0 && (
                <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                  {result.lpMeaning.long.map((x: string, idx: number) => (
                    <li key={idx}>{x}</li>
                  ))}
                </ul>
              )}

              <h3 className="mt-4 text-lg font-semibold">Тон имени</h3>
              <p className="text-sm leading-relaxed">{result.nameTone.base}</p>
              {result.nameTone.overrides.length > 0 && (
                <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
                  {result.nameTone.overrides.map((x: string, idx: number) => (
                    <li key={idx}>{x}</li>
                  ))}
                </ul>
              )}

              <div className="mt-4 flex items-center gap-2">
                <DemoBadge />
                <span className="text-xs text-gray-500">
                  Вся история Имени откроется после оплаты.
                </span>
              </div>
            </FadeCard>

            {/* Любимое число */}
            <FadeCard>
              <h2 className="text-xl font-bold mb-2">Любимое число</h2>
              <p className="text-sm leading-relaxed">{result.favText}</p>
              <p className="mt-3 text-xs text-gray-500">
                Профилей темперамента поддерживается: {result.temperamentProfilesCount}
              </p>

              <div className="mt-4 flex items-center gap-2">
                <DemoBadge />
                <span className="text-xs text-gray-500">Вся магия твоих чисел после оплаты.</span>
              </div>
            </FadeCard>
          </section>
        )}

        {/* Темперамент */}
        <section className="mt-6">
          <FadeCard>
            <h2 className="text-xl font-bold mb-2">Темперамент (мини-тест)</h2>
            <p className="text-sm text-gray-600 mb-3">
              10 коротких вопросов — покажем профиль и советы.
            </p>
            <div className="max-w-2xl">
              <TemperamentQuiz />
            </div>
          </FadeCard>
        </section>
      </div>
    </main>
  );
}
