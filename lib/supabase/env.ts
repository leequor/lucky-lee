export type SupabasePublicConfig = {
  url: string;
  anonKey: string;
};

export class SupabaseConfigError extends Error {
  constructor(message = "Supabase is not configured. Copy .env.example to .env.local and add your project keys.") {
    super(message);
    this.name = "SupabaseConfigError";
  }
}

function normalizeUrl(rawUrl: string) {
  let parsed: URL;

  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new SupabaseConfigError("NEXT_PUBLIC_SUPABASE_URL must be a valid URL.");
  }

  const isLocalHttp =
    parsed.protocol === "http:" &&
    (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1");

  if (parsed.protocol !== "https:" && !isLocalHttp) {
    throw new SupabaseConfigError(
      "NEXT_PUBLIC_SUPABASE_URL must use HTTPS (HTTP is allowed only for localhost).",
    );
  }

  if (
    parsed.username ||
    parsed.password ||
    parsed.pathname !== "/" ||
    parsed.search ||
    parsed.hash
  ) {
    throw new SupabaseConfigError(
      "NEXT_PUBLIC_SUPABASE_URL must be the project URL without a path, query, or credentials.",
    );
  }

  return parsed.origin;
}

export function getSupabasePublicConfig(): SupabasePublicConfig {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!rawUrl || !anonKey) {
    throw new SupabaseConfigError();
  }

  return {
    url: normalizeUrl(rawUrl),
    anonKey,
  };
}

export function isSupabaseConfigured() {
  try {
    getSupabasePublicConfig();
    return true;
  } catch {
    return false;
  }
}
