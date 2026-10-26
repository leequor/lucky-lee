import { NextResponse, type NextRequest } from "next/server";

import { mapAuthError } from "@/lib/auth/errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"), "/");
  const providerError = searchParams.get("error_description") || searchParams.get("error");

  if (providerError) {
    const friendly = mapAuthError(providerError, next.startsWith("/reset-password") ? "reset" : "login");
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(friendly)}`, origin));
  }

  if (!code) {
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent("The authentication link is missing a code. Request a new link.")}`,
        origin,
      ),
    );
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      const friendly = mapAuthError(error.message, next.startsWith("/reset-password") ? "reset" : "login");
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(friendly)}`, origin));
    }

    return NextResponse.redirect(new URL(next, origin));
  } catch {
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent("Unable to complete the authentication link. Request a new link.")}`,
        origin,
      ),
    );
  }
}
