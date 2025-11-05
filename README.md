# Myself on Metro 🚇

Лёгкое зеркало про вас: биоритмы, число жизненного пути, «тон имени», мини-темперамент.  
**Демо:** https://metro-front.onrender.com

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwindcss)
![Render](https://img.shields.io/badge/Hosted_on-Render-3949AB?logo=render)

## Что внутри
- Next.js App Router + Tailwind, чистый клиентский UI.
- Биоритмы (сегодня + график 14 дней), Life Path, «тон имени».
- OG-картинка для шаринга: `/api/og?...`
- Мобильные стили из коробки.
- Healthcheck: `/api/healthz`.

## Быстрый старт
```bash
npm i
npm run dev     # http://localhost:3000
````

## Сборка/прод

```bash
npm run build
npm run start
```

## Переменные окружения

* `NEXT_PUBLIC_SITE_URL` — базовый URL сайта (на проде), например:

```
NEXT_PUBLIC_SITE_URL=https://metro-front.onrender.com
```

## Структура (фрагмент)

```
src/
  app/
    api/
      healthz/route.ts
      og/route.tsx
    layout.tsx
    page.tsx
    robots.ts
    sitemap.ts
  components/
    features/...
    ui/...
  data/meanings/...
  utils/...
```

## Лицензия

MIT

