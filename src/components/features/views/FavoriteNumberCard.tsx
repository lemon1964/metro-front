// src/components/features/views/FavoriteNumberCard.tsx
"use client";
import FadeCard from "@ui/FadeCard";
import DemoBadge from "@ui/DemoBadge";

export default function FavoriteNumberCard({ result }: { result: ComputedResult }) {
  return (
    <FadeCard>
      <h2 className="text-xl font-bold mb-2">Любимое число</h2>
      <p className="text-sm leading-relaxed">{result.favText}</p>
      <div className="mt-4 flex items-center gap-2">
        <DemoBadge />
        <span className="text-xs text-gray-500">
          Все загадки твоих чисел откроются в Pro-версии.
        </span>
      </div>
    </FadeCard>
  );
}
