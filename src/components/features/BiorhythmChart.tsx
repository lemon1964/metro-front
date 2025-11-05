"use client";
import { useEffect, useRef } from "react";
// import { biorhythmRange } from "@/utils/biorhythm";
import { biorhythmRangeFrom } from "@/utils/biorhythm";

export default function BiorhythmChart({ dob, days = 14 }: { dob: string; days?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!dob || !ref.current) return;
    const canvas = ref.current;
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // bg
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillRect(0, 0, width, height);

    // grid
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= days; i++) {
      const x = (i / days) * width;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(0, height / 2); ctx.lineTo(width, height / 2); ctx.stroke();

    // данные: -3..+10 дней
    const startOffsetDays = -3;
    const data = biorhythmRangeFrom(dob, startOffsetDays, days);

    const drawLine = (key: "phys" | "emo" | "intel") => {
      ctx.beginPath();
      for (let i = 0; i < data.length; i++) {
        const x = (i / (days - 1)) * width;
        const y = height / 2 - (data[i][key] as number) * (height / 2 - 8);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };
    const drawDot = (i: number, key: "phys" | "emo" | "intel", color: string, r = 4) => {
      const x = (i / (days - 1)) * width;
      const y = height / 2 - (data[i][key] as number) * (height / 2 - 8);
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
    };

    // линии
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(99,102,241,1)"; drawLine("phys");   // индиго
    ctx.strokeStyle = "rgba(16,185,129,1)"; drawLine("emo");    // зелёный
    ctx.strokeStyle = "rgba(234,88,12,1)";  drawLine("intel");  // оранжевый

    // точки: вчера/позавчера/позапозавчера + сегодня (индексы 0..3)
    // drawDot(0, "phys",  "rgba(99,102,241,0.9)", 3);
    // drawDot(1, "phys",  "rgba(99,102,241,0.9)", 3);
    // drawDot(2, "phys",  "rgba(99,102,241,0.9)", 3);
    drawDot(3, "phys",  "rgba(99,102,241,1.0)", 4);

    // drawDot(0, "emo",   "rgba(16,185,129,0.9)", 3);
    // drawDot(1, "emo",   "rgba(16,185,129,0.9)", 3);
    // drawDot(2, "emo",   "rgba(16,185,129,0.9)", 3);
    drawDot(3, "emo",   "rgba(16,185,129,1.0)", 4);

    // drawDot(0, "intel", "rgba(234,88,12,0.9)",  3);
    // drawDot(1, "intel", "rgba(234,88,12,0.9)",  3);
    // drawDot(2, "intel", "rgba(234,88,12,0.9)",  3);
    drawDot(3, "intel", "rgba(234,88,12,1.0)",  4);
  }, [dob, days]);

  return (
    <div className="rounded-xl border border-black/10 bg-white/60 dark:bg-white/5 p-3">
      <div className="text-sm text-gray-600 mb-2">Биоритмы: 3 дня назад → 10 дней вперёд</div>
      <div className="text-sm text-yellow-100 mb-2">Опция графика будет платной</div>
      <canvas ref={ref} className="w-full h-40 block" />
      <div className="mt-2 text-xs text-gray-500">
        Сегодня — точка; физ (индиго), эмо (зелёный), интеллект (оранжевый).
      </div>
    </div>
  );
}
