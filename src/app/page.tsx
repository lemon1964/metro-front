// src/app/page.tsx
import type { Metadata } from "next";
import HomeClient from "@/components/features/HomeClient";

export const dynamic = "force-dynamic";

type Search = { [key: string]: string | string[] | undefined };

type PageProps = {
  searchParams: Promise<Search>;
};

export async function generateMetadata(
  { searchParams }: PageProps
): Promise<Metadata> {
  const sp = await searchParams;

  const name =
    typeof sp.name === "string" && sp.name.trim() ? sp.name : "Гость";
  const lp =
    typeof sp.lp === "string" && sp.lp.trim() ? sp.lp : "-";
  const phys =
    typeof sp.phys === "string" && sp.phys.trim() ? sp.phys : "0.00";
  const emo =
    typeof sp.emo === "string" && sp.emo.trim() ? sp.emo : "0.00";
  const intel =
    typeof sp.intel === "string" && sp.intel.trim() ? sp.intel : "0.00";

  const params = new URLSearchParams({ name, lp, phys, emo, intel }).toString();
  const ogUrl = `/api/og?${params}`;

  return {
    title: "Вы — сегодня | Myself on Metro",
    description:
      "Быстрый взгляд на твой день: биоритмы, число пути, имя, тон имени и настроение дня.",
    openGraph: {
      images: [ogUrl],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogUrl],
    },
  };
}

export default async function Page(
  { searchParams }: PageProps
) {
  const sp = await searchParams;

  const initialForm = {
    dob: typeof sp.dob === "string" ? sp.dob : "",
    name: typeof sp.name === "string" ? sp.name : "",
    fav: typeof sp.fav === "string" ? sp.fav : "",
  };

  // Заголовок пока один, без A/B, спокойно и понятно
  const headline = "Вы — сегодня";

  return <HomeClient headline={headline} initialForm={initialForm} />;
}