// src/components/ui/ProgressBar.tsx
export default function ProgressBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="w-full h-3 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
      <div
        className="h-full bg-indigo-500 dark:bg-indigo-400 transition-[width]"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
