// src/components/features/views/LifePathNameCard.tsx
"use client";
import FadeCard from "@ui/FadeCard";
import DemoBadge from "@ui/DemoBadge";

export default function LifePathNameCard({ result }: { result: ComputedResult }) {
  return (
    <FadeCard>
      <h2 className="text-xl font-bold mb-2">Число жизненного пути</h2>
      <div className="text-5xl font-black">{result.lp.value}</div>
      <p className="mt-2 text-sm leading-relaxed">{result.lpMeaning.short}</p>

      {result.lpMeaning.long.length > 0 && (
        <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
          {result.lpMeaning.long.map((x, idx) => (
            <li key={idx}>{x}</li>
          ))}
        </ul>
      )}

      <h3 className="mt-4 text-lg font-semibold">Тон имени</h3>
      <p className="text-sm leading-relaxed">{result.nameTone.base}</p>

      {result.nameTone.overrides.length > 0 && (
        <ul className="mt-2 text-sm list-disc pl-5 space-y-1">
          {result.nameTone.overrides.map((x, idx) => (
            <li key={idx}>{x}</li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-center gap-2">
        <DemoBadge />
        <span className="text-xs text-gray-500">
          Вся история имени откроется в Pro-версии.
        </span>
      </div>
    </FadeCard>
  );
}
