// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  checkSupabaseConnection: vi.fn(),
}));

vi.mock("@/lib/health", () => ({
  checkSupabaseConnection: mocks.checkSupabaseConnection,
}));

import { GET as appHealthGET } from "@/app/api/health/route";
import { GET as supabaseHealthGET } from "@/app/api/health/supabase/route";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/health", () => {
  it("reports the web app as healthy and disables caching", async () => {
    const response = await appHealthGET();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("no-store");
    const body = await response.json();
    expect(body.status).toBe("ok");
    expect(body.service).toBe("web");
    expect(new Date(body.timestamp).toString()).not.toBe("Invalid Date");
  });
});

describe("GET /api/health/supabase", () => {
  it("returns 200 when Supabase is connected", async () => {
    mocks.checkSupabaseConnection.mockResolvedValue({
      status: "connected",
      latencyMs: 12,
    });

    const response = await supabaseHealthGET();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(await response.json()).toEqual({
      service: "supabase",
      status: "connected",
      latencyMs: 12,
    });
  });

  it("returns 503 when Supabase is unavailable", async () => {
    mocks.checkSupabaseConnection.mockResolvedValue({
      status: "unavailable",
      message: "Supabase responded with HTTP 503.",
    });

    const response = await supabaseHealthGET();

    expect(response.status).toBe(503);
    expect((await response.json()).message).toContain("503");
  });

  it("returns 503 when Supabase is not configured", async () => {
    mocks.checkSupabaseConnection.mockResolvedValue({
      status: "not_configured",
      message: "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    });

    const response = await supabaseHealthGET();

    expect(response.status).toBe(503);
    expect((await response.json()).status).toBe("not_configured");
  });
});

