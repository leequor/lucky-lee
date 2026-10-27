import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createBrowserClient: vi.fn(),
  getSupabasePublicConfig: vi.fn(),
}));

vi.mock("@supabase/ssr", () => ({ createBrowserClient: mocks.createBrowserClient }));
vi.mock("@/lib/supabase/env", () => ({
  getSupabasePublicConfig: mocks.getSupabasePublicConfig,
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
  mocks.getSupabasePublicConfig.mockReturnValue({
    url: "https://project.supabase.co",
    anonKey: "anon-key",
  });
  mocks.createBrowserClient.mockReturnValue({ auth: {} });
});

describe("getSupabaseBrowserClient", () => {
  it("creates one browser client per module instance", async () => {
    const { getSupabaseBrowserClient } = await import("@/lib/supabase/client");

    const first = getSupabaseBrowserClient();
    const second = getSupabaseBrowserClient();

    expect(first).toBe(second);
    expect(mocks.createBrowserClient).toHaveBeenCalledTimes(1);
    expect(mocks.createBrowserClient).toHaveBeenCalledWith(
      "https://project.supabase.co",
      "anon-key",
    );
  });

  it("propagates a configuration failure", async () => {
    mocks.getSupabasePublicConfig.mockImplementation(() => {
      throw new Error("not configured");
    });
    const { getSupabaseBrowserClient } = await import("@/lib/supabase/client");

    expect(() => getSupabaseBrowserClient()).toThrow("not configured");
  });
});
