// @vitest-environment node
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  isSupabaseConfigured: vi.fn(),
  getSupabasePublicConfig: vi.fn(),
  createServerClient: vi.fn(),
}));

vi.mock("@/lib/supabase/env", () => ({
  isSupabaseConfigured: mocks.isSupabaseConfigured,
  getSupabasePublicConfig: mocks.getSupabasePublicConfig,
}));
vi.mock("@supabase/ssr", () => ({
  createServerClient: mocks.createServerClient,
}));

import { updateSession } from "@/lib/supabase/middleware";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.isSupabaseConfigured.mockReturnValue(false);
  mocks.getSupabasePublicConfig.mockReturnValue({
    url: "https://project.supabase.co",
    anonKey: "key",
  });
});

describe("updateSession", () => {
  it("passes the request through when Supabase is not configured", async () => {
    const response = await updateSession(new NextRequest("http://localhost:3000/"));

    expect(response.status).toBe(200);
    expect(mocks.createServerClient).not.toHaveBeenCalled();
  });

  it("refreshes the session when Supabase is configured", async () => {
    mocks.isSupabaseConfigured.mockReturnValue(true);
    const getUser = vi.fn().mockResolvedValue({ data: { user: null } });
    mocks.createServerClient.mockReturnValue({ auth: { getUser } });

    const response = await updateSession(new NextRequest("http://localhost:3000/"));

    expect(response.status).toBe(200);
    expect(getUser).toHaveBeenCalled();
    expect(mocks.createServerClient).toHaveBeenCalledWith(
      "https://project.supabase.co",
      "key",
      expect.objectContaining({ cookies: expect.any(Object) }),
    );
  });

  it("keeps the app usable when the client throws", async () => {
    mocks.isSupabaseConfigured.mockReturnValue(true);
    mocks.createServerClient.mockImplementation(() => {
      throw new Error("offline");
    });

    const response = await updateSession(new NextRequest("http://localhost:3000/"));

    expect(response.status).toBe(200);
  });

  it("refreshes cookies through the Supabase setAll callback", async () => {
    mocks.isSupabaseConfigured.mockReturnValue(true);
    const getUser = vi.fn().mockImplementation(async () => ({ data: { user: null } }));
    mocks.createServerClient.mockImplementation((_url, _key, options) => {
      options.cookies.setAll([
        { name: "sb-session", value: "new-value", options: { path: "/" } },
      ]);
      return { auth: { getUser } };
    });

    const response = await updateSession(new NextRequest("http://localhost:3000/status"));

    expect(response.cookies.get("sb-session")?.value).toBe("new-value");
  });
});
