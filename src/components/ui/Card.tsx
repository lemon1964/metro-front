import { PropsWithChildren } from "react";

export default function Card({ children }: PropsWithChildren) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/60 dark:bg-white/5 backdrop-blur p-5 shadow-lg">
      {children}
    </div>
  );
}
