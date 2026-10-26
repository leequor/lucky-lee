import { getSupabasePublicConfig, isSupabaseConfigured } from "./supabase/env";

export type SupabaseHealth = {
  status: "connected" | "not_configured" | "unavailable";
  latencyMs?: number;
  message?: string;
};

export async function checkSupabaseConnection(
  fetchImpl: typeof fetch = fetch,
): Promise<SupabaseHealth> {
  if (!isSupabaseConfigured()) {
    return {
      status: "not_configured",
      message: "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
    };
  }

  const startedAt = Date.now();

  try {
    const { url, anonKey } = getSupabasePublicConfig();
    const response = await fetchImpl(`${url}/auth/v1/health`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return {
        status: "unavailable",
        latencyMs: Date.now() - startedAt,
        message: `Supabase responded with HTTP ${response.status}.`,
      };
    }

    return {
      status: "connected",
      latencyMs: Date.now() - startedAt,
    };
  } catch (error) {
    return {
      status: "unavailable",
      latencyMs: Date.now() - startedAt,
      message: error instanceof Error ? error.message : "Unable to reach Supabase.",
    };
  }
}
