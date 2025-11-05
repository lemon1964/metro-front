// src/app/page.tsx
import type { Metadata } from "next";
import HomeClient from "@/components/features/HomeClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  { searchParams }: { searchParams: Promise<Record<string, string | undefined>> }
): Promise<Metadata> {
  const sp = await searchParams;
  const name  = sp.name  ?? "Гость";
  const lp    = sp.lp    ?? "-";
  const phys  = sp.phys  ?? "0.00";
  const emo   = sp.emo   ?? "0.00";
  const intel = sp.intel ?? "0.00";

  const params = new URLSearchParams({ name, lp, phys, emo, intel }).toString();
  const ogUrl = `/api/og?${params}`;

  return {
    title: "Myself on Metro",
    description: "Лёгкое зеркало про вас: биоритмы, имя, путь, темперамент.",
    openGraph: { images: [ogUrl] },
    twitter:  { card: "summary_large_image", images: [ogUrl] },
  };
}

export default async function Page(
  { searchParams }: { searchParams: Promise<Record<string, string | undefined>> }
) {
  const sp = await searchParams;
  const headline = sp.headline === "v2"
    ? "Зеркало про вас — мгновенно"
    : "Myself on Metro 🚇";

  return <HomeClient headline={headline} />;
}
