"use client";
import { useMemo, useState } from "react";
import ProgressBar from "@ui/ProgressBar";
import tdata from "@data/meanings/temperament.json";
import { scoreTemperament, topTemperaments, TemperamentKey } from "@/utils/temperament";

type Q = {
  id: number;
  text: string;
  options: { label: string; profile: TemperamentKey }[];
};

export default function TemperamentQuiz() {
  const questions = (tdata).questions as Q[];
  const profiles = (tdata).profiles as Record<
    TemperamentKey,
    { title: string; brief: string; advice: string[] }
  >;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<TemperamentKey[]>([]);

  const isDone = step >= questions.length;

  const result = useMemo(() => {
    if (!isDone) return null;
    const scores = scoreTemperament(answers);
    const total = answers.length || 1;
    const pct = {
      choleric: (scores.choleric / total) * 100,
      sanguine: (scores.sanguine / total) * 100,
      phlegmatic: (scores.phlegmatic / total) * 100,
      melancholic: (scores.melancholic / total) * 100,
    };
    const top = topTemperaments(scores);
    return { scores, pct, top };
  }, [answers, isDone]);

  const q = questions[step];

  return (
    <div className="space-y-4">
      {!isDone ? (
        <>
          <div className="text-sm text-gray-500">Вопрос {step + 1} / {questions.length}</div>
          <div className="text-lg font-medium">{q.text}</div>
          <div className="grid gap-2">
            {q.options.map((o, i) => (
              <button
                key={i}
                className="rounded-xl border px-4 py-2 text-left hover:shadow-sm active:scale-[0.99] transition"
                onClick={() => {
                  setAnswers((a) => [...a, o.profile]);
                  setStep((s) => s + 1);
                }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="text-lg font-bold">Твой темперамент (топ-профили)</div>
          <div className="text-sm text-gray-600">
            {result!.top.map((k) => profiles[k].title).join(" + ")}
          </div>

          <div className="grid gap-3">
            {(["choleric", "sanguine", "phlegmatic", "melancholic"] as TemperamentKey[]).map((k) => (
              <div key={k} className="space-y-1">
                <div className="flex items-baseline justify-between">
                  <div className="font-medium">{profiles[k].title}</div>
                  <div className="text-sm text-gray-500">{Math.round(result!.pct[k])}%</div>
                </div>
                <ProgressBar value={result!.pct[k]} />
                <div className="text-xs text-gray-500">{profiles[k].brief}</div>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <div className="text-sm font-semibold mb-1">Советы:</div>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {result!.top.flatMap((k) => profiles[k].advice).map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>

          <div className="pt-3">
            <button
              className="rounded-xl px-4 py-2 border shadow-sm hover:shadow transition"
              onClick={() => { setStep(0); setAnswers([]); }}
            >
              Пройти ещё раз
            </button>
          </div>
        </>
      )}
    </div>
  );
}
