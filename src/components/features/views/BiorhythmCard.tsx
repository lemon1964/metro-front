// src/components/features/views/BiorhythmCard.tsx
"use client";
import DemoBadge from "@/components/ui/DemoBadge";
import BiorhythmChart from "@features/BiorhythmChart";
import FadeCard from "@ui/FadeCard";

type Props = {
  formDob: string;
  result: ComputedResult;
  onClickShareImage: () => void;
  onClickShareLink: () => void;
  // onClickUpsell: () => void;
};

export default function BiorhythmCard({
  formDob,
  result,
  onClickShareImage,
  onClickShareLink,
  // onClickUpsell,
}: Props) {
  return (
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
          <li key={`p${i}`}>{h}</li>
        ))}
        {result.emoHints.map((h, i) => (
          <li key={`e${i}`}>{h}</li>
        ))}
        {result.intHints.map((h, i) => (
          <li key={`i${i}`}>{h}</li>
        ))}
      </ul>

      <div className="mt-3 text-xs text-gray-500">
        Ближайшие «критические» дни: физ: {result.zeros.physIn ?? "—"} дн., эмо:{" "}
        {result.zeros.emoIn ?? "—"} дн., интеллект: {result.zeros.intelIn ?? "—"} дн.
      </div>

      <div className="mt-4 flex items-center gap-2">
        <DemoBadge />
        <span className="text-xs text-gray-500">График на 2 месяца откроется в Pro-версии.</span>
      </div>

      <div className="mt-4 flex gap-2 flex-wrap">
        {/* <button
          className="rounded-xl px-4 py-2 border shadow-sm hover:shadow transition"
          onClick={onClickUpsell}
        >
          График на 14 дней • 25 ₽
        </button> */}

        <button
          className="rounded-xl px-4 py-2 border shadow-sm hover:shadow transition"
          onClick={onClickShareImage}
        >
          Открыть картинку для соцсетей
        </button>

        <button
          className="rounded-xl px-4 py-2 border shadow-sm hover:shadow transition"
          onClick={onClickShareLink}
        >
          Поделиться ссылкой
        </button>
      </div>

      <div className="mt-4">
        <BiorhythmChart dob={formDob} days={14} />
      </div>
    </FadeCard>
  );
}
