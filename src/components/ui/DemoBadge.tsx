export default function DemoBadge({ label = "Демо-предпросмотр" }: { label?: string }) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
        {label}
      </span>
    );
  }
  