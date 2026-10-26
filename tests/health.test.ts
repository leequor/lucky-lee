import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { checkSupabaseConnection } from "@/lib/health";

function stubConfigured(value = "https://project.supabase.co", key = "test-key") {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", value);
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", key);
}

describe("checkSupabaseConnection", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("reports missing configuration", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");

    const result = await checkSupabaseConnection();

    expect(result.status).toBe("not_configured");
  });

  it("checks the configured Auth health endpoint", async () => {
    stubConfigured();
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true, status: 200 });

    const result = await checkSupabaseConnection(fetchImpl as unknown as typeof fetch);

    expect(result.status).toBe("connected");
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://project.supabase.co/auth/v1/health",
      expect.objectContaining({
        headers: {
          apikey: "test-key",
          Authorization: "Bearer test-key",
        },
      }),
    );
  });

  it("reports an unavailable project", async () => {
    stubConfigured();
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false, status: 503 });

    const result = await checkSupabaseConnection(fetchImpl as unknown as typeof fetch);

    expect(result.status).toBe("unavailable");
    expect(result.message).toContain("503");
  });

  it("reports a network failure", async () => {
    stubConfigured();
    const fetchImpl = vi.fn().mockRejectedValue(new Error("fetch failed"));

    const result = await checkSupabaseConnection(fetchImpl as unknown as typeof fetch);

    expect(result.status).toBe("unavailable");
    expect(result.message).toContain("fetch failed");
  });
});
