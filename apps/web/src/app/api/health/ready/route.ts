import { isDatabaseReady } from "@/lib/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const ready = await isDatabaseReady();
  return Response.json(
    { status: ready ? "ready" : "unavailable" },
    { status: ready ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
