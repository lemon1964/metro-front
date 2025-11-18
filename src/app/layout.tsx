// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
// import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Вы — сегодня | Myself on Metro",
  description: "Быстрый взгляд на твой день: биоритмы, число пути, тон имени и темперамент.",
  keywords: [
    "биоритмы", "число жизненного пути", "нумерология", "темперамент",
    "самоанализ", "настроение дня", "еженедельные подсказки", "вы сегодня",
  ],
  icons: {
    icon: [{ url: "/favicon.ico" }],
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Myself on Metro",
    title: "Вы — сегодня",
    description: "Лёгкий персональный срез: ритмы, число пути, тон имени, темперамент.",
    images: [
      {
        url: "/api/og", // динамический OG уже есть
        width: 1200,
        height: 630,
        alt: "Вы — сегодня | Myself on Metro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Вы — сегодня | Myself on Metro",
    description: "Лёгкий персональный срез: ритмы, число пути, тон имени, темперамент.",
    images: ["/api/og"],
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
// export const metadata: Metadata = {
//   metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
//   title: "Вы — сегодня | Myself on Metro",
//   description: "Быстрый взгляд на твой день: биоритмы, число пути, имя, темперамент.",
//   icons: {
//     icon: [{ url: "/favicon.ico" }],
//   },
// };

// вынесено из metadata — как рекомендует Next 14
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
