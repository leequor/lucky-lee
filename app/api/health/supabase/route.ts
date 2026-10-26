import { NextResponse } from "next/server";

import { checkSupabaseConnection } from "@/lib/health";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await checkSupabaseConnection();
  const statusCode = result.status === "connected" ? 200 : 503;

  return NextResponse.json(
    {
      service: "supabase",
      ...result,
    },
    {
      status: statusCode,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
