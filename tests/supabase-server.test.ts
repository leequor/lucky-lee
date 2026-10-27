// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  cookies: vi.fn(),
  createServerClient: vi.fn(),
  getSupabasePublicConfig: vi.fn(),
}));

vi.mock("next/headers", () => ({ cookies: mocks.cookies }));
vi.mock("@supabase/ssr", () => ({ createServerClient: mocks.createServerClient }));
vi.mock("@/lib/supabase/env", () => ({
  getSupabasePublicConfig: mocks.getSupabasePublicConfig,
}));

import { createSupabaseServerClient } from "@/lib/supabase/server";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getSupabasePublicConfig.mockReturnValue({
    url: "https://project.supabase.co",
    anonKey: "anon-key",
  });
  mocks.cookies.mockResolvedValue({
    getAll: () => [{ name: "sb-session", value: "old" }],
    set: vi.fn(),
  });
  mocks.createServerClient.mockReturnValue({ from: vi.fn() });
});

describe("createSupabaseServerClient", () => {
  it("creates a server client with the public config", async () => {
    await createSupabaseServerClient();

    expect(mocks.createServerClient).toHaveBeenCalledWith(
      "https://project.supabase.co",
      "anon-key",
      expect.objectContaining({ cookies: expect.any(Object) }),
    );

    const options = mocks.createServerClient.mock.calls[0]?.[2] as {
      cookies: { getAll: () => unknown };
    };
    expect(options.cookies.getAll()).toEqual([{ name: "sb-session", value: "old" }]);
  });

  it("writes refreshed cookies to the cookie store", async () => {
    const set = vi.fn();
    mocks.cookies.mockResolvedValue({ getAll: () => [], set });
    await createSupabaseServerClient();

    const options = mocks.createServerClient.mock.calls[0]?.[2] as {
      cookies: { setAll: (cookies: Array<{ name: string; value: string }>) => void };
    };
    options.cookies.setAll([{ name: "sb-session", value: "new" }]);

    expect(set).toHaveBeenCalledWith("sb-session", "new", undefined);
  });

  it("ignores cookie writes from a Server Component", async () => {
    mocks.cookies.mockResolvedValue({
      getAll: () => [],
      set: vi.fn(() => {
        throw new Error("Cookies can only be modified in a Server Action or Route Handler");
      }),
    });
    await createSupabaseServerClient();

    const options = mocks.createServerClient.mock.calls[0]?.[2] as {
      cookies: { setAll: (cookies: Array<{ name: string; value: string }>) => void };
    };

    expect(() => options.cookies.setAll([{ name: "sb-session", value: "new" }])).not.toThrow();
  });

  it("propagates a configuration failure", async () => {
    mocks.getSupabasePublicConfig.mockImplementation(() => {
      throw new Error("not configured");
    });

    await expect(createSupabaseServerClient()).rejects.toThrow("not configured");
  });
});
