import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { mapAuthError } from "@/lib/auth/errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeNextPath(searchParams.get("next"), "/reset-password");

  if (!tokenHash || !type) {
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent("The reset link is invalid or incomplete. Request a new one.")}`,
        origin,
      ),
    );
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (error) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(mapAuthError(error.message, "reset"))}`, origin),
      );
    }

    return NextResponse.redirect(new URL(next, origin));
  } catch {
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent("Unable to verify the reset link. Request a new one.")}`,
        origin,
      ),
    );
  }
}
