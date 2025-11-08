// src/app/page.tsx
import type { Metadata } from "next";
import HomeClient from "@/components/features/HomeClient";

export const dynamic = "force-dynamic";

type Search = { [key: string]: string | string[] | undefined };

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const name = typeof sp.name === "string" ? sp.name : "Гость";
  const lp = typeof sp.lp === "string" ? sp.lp : "-";
  const phys = typeof sp.phys === "string" ? sp.phys : "0.00";
  const emo = typeof sp.emo === "string" ? sp.emo : "0.00";
  const intel = typeof sp.intel === "string" ? sp.intel : "0.00";
  // const name  = sp.name  ?? "Гость";
  // const lp    = sp.lp    ?? "-";
  // const phys  = sp.phys  ?? "0.00";
  // const emo   = sp.emo   ?? "0.00";
  // const intel = sp.intel ?? "0.00";

  const params = new URLSearchParams({ name, lp, phys, emo, intel }).toString();
  const ogUrl = `/api/og?${params}`;

  return {
    title: "Вы — сегодня | Myself on Metro",
    description: "Быстрый взгляд на твой день: ритмы, числа, имя, темперамент за минуту.",
    openGraph: {
      title: "Вы — сегодня | Myself on Metro",
      description: "Лёгкое зеркало твоего дня.",
      images: [ogUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: "Вы — сегодня | Myself on Metro",
      description: "Лёгкое зеркало твоего дня.",
      images: [ogUrl],
    },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Search;
}) // { searchParams }: { searchParams: Promise<Record<string, string | undefined>> }
{
  const sp = await searchParams;

  const headline = sp.headline === "v2" ? "Мгновенное зеркало" : "Вы — сегодня";

  const initialForm = {
    dob: typeof sp.dob === "string" ? sp.dob : "",
    name: typeof sp.name === "string" ? sp.name : "",
    fav: typeof sp.fav === "string" ? sp.fav : "",
  };

  return <HomeClient headline={headline} initialForm={initialForm} />;
  // return <HomeClient headline={headline} />;
}
