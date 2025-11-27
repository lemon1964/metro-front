// src/app/api/healthz/route.ts
export const runtime = "nodejs";

export async function GET() {
  return new Response("OK", { status: 200 });
}
