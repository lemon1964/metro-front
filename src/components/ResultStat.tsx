// src/components/ResultStat.tsx
export function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-1">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
