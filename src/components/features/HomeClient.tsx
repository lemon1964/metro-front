// src/components/features/HomeClient.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";

import FadeCard from "@ui/FadeCard";
import TemperamentQuiz from "@features/TemperamentQuiz";
import { computeResult } from "@/utils/mom-meanings";
import BiorhythmCard from "./views/BiorhythmCard";
import LifePathNameCard from "./views/LifePathNameCard";
import FavoriteNumberCard from "./views/FavoriteNumberCard";

type Props = {
  headline: string;
  initialForm?: FormState;
};

export default function HomeClient({ headline, initialForm }: Props) {
  // export default function HomeClient({ headline }: Props) {
  // const router = useRouter();
  const [form, setForm] = useState<FormState>(() => initialForm ?? { dob: "", name: "", fav: "" });
  // const [form, setForm] = useState<FormState>({ dob: "", name: "", fav: "" });

  // Подтягиваем сохранённые данные после первого кадра
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const url = new URL(window.location.href);
        const wantReset = url.searchParams.get("reset") === "1";

        if (wantReset) {
          localStorage.removeItem("mom_form");
          url.searchParams.delete("reset");
          window.history.replaceState({}, "", url.toString());
          return;
        }

        const raw = localStorage.getItem("mom_form");
        if (raw) {
          const parsed = JSON.parse(raw) as FormState;
          setForm(parsed);
        }
      } catch {
        // ignore
      }
    });

    return () => cancelAnimationFrame(id);
  }, []);

  // Сохраняем форму
  useEffect(() => {
    try {
      localStorage.setItem("mom_form", JSON.stringify(form));
    } catch {}
  }, [form]);
  // useEffect(() => {
  //   try {
  //     localStorage.setItem("mom_form", JSON.stringify(form));
  //   } catch {
  //     // ignore
  //   }
  // }, [form]);

  const result: ComputedResult | null = useMemo(() => computeResult(form), [form]);

  function onField<K extends keyof FormState>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(s => ({ ...s, [key]: e.target.value }));
  }

  function playClick() {
    try {
      // лёгкий звук, без навязчивости
      const audio = new Audio("/sounds/button.wav");
      audio.volume = 0.4;
      audio.play().catch(() => {
        // мобилки / запреты автоплея — молча игнорим
      });
    } catch {
      // если что-то пошло не так — просто без звука
    }
  }

  // const click = () => {
  //   try {
  //     const Ctor = (window).AudioContext || (window).AudioContext;
  //     const ctx = new Ctor();
  //     const osc = ctx.createOscillator();
  //     const gain = ctx.createGain();
  //     osc.type = "square";
  //     osc.frequency.value = 880;
  //     gain.gain.value = 0.05;
  //     osc.connect(gain);
  //     gain.connect(ctx.destination);
  //     osc.start();
  //     setTimeout(() => {
  //       osc.stop();
  //       ctx.close();
  //     }, 100);
  //   } catch {
  //     // no audio (mobile / permissions) — ок
  //   }
  // };

  const clarityText = useMemo(() => {
    if (!result) return "";
    const v = result.bio.intel;
    if (v > 0.6)
      return `Сегодня индекс ясности ${v.toFixed(2)} — самое время для планов и решений.`;
    if (v > 0.2)
      return `Сегодня индекс ясности ${v.toFixed(2)} — нормальный тонус, можно идти по списку дел.`;
    if (v > -0.2)
      return `Сегодня индекс ясности ${v.toFixed(2)} — нейтрально, не разгоняй себя лишним.`;
    if (v > -0.6)
      return `Сегодня индекс ясности ${v.toFixed(2)} — береги концентрацию, дроби задачи.`;
    return `Сегодня индекс ясности ${v.toFixed(2)} — сложные дела лучше перенести.`;
  }, [result]);

  // Handlers

  const handleShareImage = () => {
    if (!result) return;
    playClick();
    // click();
    const params = new URLSearchParams({
      name: form.name || "Гость",
      lp: result.lp.value,
      phys: result.bio.phys.toFixed(2),
      emo: result.bio.emo.toFixed(2),
      intel: result.bio.intel.toFixed(2),
    });
    window.open(`/api/og?${params.toString()}`, "_blank");
  };

  const handleShareLink = () => {
    if (!result) return;
    playClick();

    const params = new URLSearchParams({
      dob: form.dob || "",
      name: form.name || "",
      fav: form.fav || "",
      lp: result.lp.value,
      phys: result.bio.phys.toFixed(2),
      emo: result.bio.emo.toFixed(2),
      intel: result.bio.intel.toFixed(2),
    });

    const shareUrl = `${window.location.origin}/?${params.toString()}`;

    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          alert("Ссылка скопирована. Можно отправлять кому угодно.");
        })
        .catch(() => {
          // fallback: хотя бы показать правильный URL
          window.history.replaceState({}, "", shareUrl);
          alert("Ссылка в адресной строке — скопируй её вручную.");
        });
    } else {
      window.history.replaceState({}, "", shareUrl);
      alert("Ссылка в адресной строке — скопируй её вручную.");
    }
  };

  // const handleShareLink = () => {
  //   if (!result) return;
  //   playClick();

  //   const params = new URLSearchParams({
  //     name: form.name || "Гость",
  //     lp: result.lp.value,
  //     phys: result.bio.phys.toFixed(2),
  //     emo: result.bio.emo.toFixed(2),
  //     intel: result.bio.intel.toFixed(2),
  //   });

  //   const shareUrl = `${window.location.origin}/?${params.toString()}`;

  //   if (navigator.clipboard && navigator.clipboard.writeText) {
  //     navigator.clipboard
  //       .writeText(shareUrl)
  //       .then(() => {
  //         alert("Ссылка скопирована. Можно отправлять кому хочешь.");
  //       })
  //       .catch(() => {
  //         // fallback — хотя бы показать в адресной строке
  //         router.replace(`/?${params.toString()}`);
  //         alert("Я открыл ссылку в адресной строке — скопируй её вручную.");
  //       });
  //   } else {
  //     // старые браузеры: просто обновим URL
  //     router.replace(`/?${params.toString()}`);
  //     alert("Ссылка в адресной строке. Скопируй её вручную.");
  //   }
  // };

  return (
    <main className="min-h-screen p-6 pb-28 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-black">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="pt-4">
          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight"
            suppressHydrationWarning
          >
            {headline}
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-2xl">
            Введи пару цифр про себя — и за минуту увидишь свои ритмы, число пути, тон имени и
            настроение дня.
          </p>
          <p className="mt-1 text-xs text-gray-400">
            by <span className="font-semibold">Myself on Metro 🚇</span>
          </p>
          {result && clarityText && (
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
                className="rounded-xl border px-3 py-2 bg-white/80 dark:bg-white/10"
              />
            </div>
          </form>
          <p className="mt-3 text-xs text-gray-500">
            Развлекательный сервис. Не про диагнозы и судьбу, а про мягкий фокус на себе.
          </p>
        </FadeCard>

        {/* Результаты */}
        {result && (
          <section className="grid gap-6 md:grid-cols-3">
            <BiorhythmCard
              formDob={form.dob}
              result={result}
              onClickShareImage={handleShareImage}
              onClickShareLink={handleShareLink}
              // onClickUpsell={handleUpsell}
            />
            <LifePathNameCard result={result} />
            <FavoriteNumberCard result={result} />
          </section>
        )}

        {/* Темперамент */}
        <section className="mt-6">
          <FadeCard>
            <h2 className="text-xl font-bold mb-2">Темперамент (мини-тест)</h2>
            <p className="text-sm text-gray-600 mb-3">
              10 коротких вопросов — покажем профиль и мягкие советы.
            </p>
            <div className="max-w-2xl">
              <TemperamentQuiz />
            </div>
          </FadeCard>
        </section>
        <footer className="mt-10 text-[10px] text-gray-400 text-center">
          Данные не сохраняются. Все расчёты выполняются в браузере.
        </footer>
      </div>
    </main>
  );
}
