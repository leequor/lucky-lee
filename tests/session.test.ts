// @vitest-environment node
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  isSupabaseConfigured: vi.fn(),
  createClient: vi.fn(),
}));

vi.mock("@/lib/supabase/env", () => ({
  isSupabaseConfigured: mocks.isSupabaseConfigured,
}));
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: mocks.createClient,
}));

import { getAuthUser, toAuthUser } from "@/lib/auth/session";

function user(overrides: Partial<User> = {}): User {
  return {
    id: "user-1",
    email: "user@example.com",
    app_metadata: {},
    user_metadata: {},
    created_at: "2026-10-19T11:10:00.000Z",
    ...overrides,
  } as User;
}

function profileClient(result: { data: unknown; error?: unknown }) {
  const maybeSingle = vi.fn().mockResolvedValue(result);
  const eq = vi.fn(() => ({ maybeSingle }));
  const select = vi.fn(() => ({ eq }));
  const from = vi.fn(() => ({ select }));

  return { client: { from } as unknown as SupabaseClient, from, select, eq, maybeSingle };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
  mocks.isSupabaseConfigured.mockReturnValue(false);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("toAuthUser", () => {
  it("prefers the app role and exposes profile fields", () => {
    const result = toAuthUser(
      user({
        app_metadata: { role: "admin" },
        user_metadata: { role: "superadmin", full_name: "Alex Campita" },
      }),
    );

    expect(result).toEqual({
      id: "user-1",
      email: "user@example.com",
      role: "admin",
      fullName: "Alex Campita",
      createdAt: "2026-10-19T11:10:00.000Z",
    });
  });

  it("falls back to user metadata role", () => {
    expect(toAuthUser(user({ user_metadata: { role: "superadmin" } })).role).toBe(
      "superadmin",
    );
  });

  it("coerces unknown roles and missing fields to safe defaults", () => {
    const result = toAuthUser(
      user({
        email: undefined,
        user_metadata: { role: "owner", full_name: 42 },
        created_at: undefined,
      }),
    );

    expect(result).toEqual({
      id: "user-1",
      email: "",
      role: "user",
      fullName: null,
      createdAt: null,
    });
  });
});

describe("getAuthUser", () => {
  it("returns metadata without a query when Supabase is not configured", async () => {
    const result = await getAuthUser(user({ user_metadata: { role: "admin" } }));

    expect(result.role).toBe("admin");
    expect(mocks.createClient).not.toHaveBeenCalled();
  });

  it("lets the profiles row override role and name", async () => {
    mocks.isSupabaseConfigured.mockReturnValue(true);
    const profile = profileClient({
      data: { role: "user", full_name: "Profile Name", created_at: "2026-01-02T00:00:00Z" },
      error: null,
    });
    mocks.createClient.mockResolvedValue(profile.client);

    const result = await getAuthUser(
      user({ user_metadata: { role: "superadmin", full_name: "Meta Name" } }),
    );

    expect(result).toMatchObject({
      role: "user",
      fullName: "Profile Name",
      createdAt: "2026-01-02T00:00:00Z",
    });
    expect(profile.from).toHaveBeenCalledWith("profiles");
    expect(profile.eq).toHaveBeenCalledWith("id", "user-1");
  });

  it("keeps metadata when the profile row is missing", async () => {
    mocks.isSupabaseConfigured.mockReturnValue(true);
    mocks.createClient.mockResolvedValue(
      profileClient({ data: null, error: { message: "not found" } }).client,
    );

    const result = await getAuthUser(user({ user_metadata: { role: "admin" } }));

    expect(result.role).toBe("admin");
  });

  it("keeps metadata when the profile query throws", async () => {
    mocks.isSupabaseConfigured.mockReturnValue(true);
    const from = vi.fn(() => {
      throw new Error("network");
    });
    mocks.createClient.mockResolvedValue({ from } as unknown as SupabaseClient);

    const result = await getAuthUser(user({ user_metadata: { role: "admin" } }));

    expect(result.role).toBe("admin");
  });
});

describe("getCurrentUser", () => {
  it("returns null when Supabase is not configured", async () => {
    const session = await import("@/lib/auth/session");

    await expect(session.getCurrentUser()).resolves.toBeNull();
    expect(mocks.createClient).not.toHaveBeenCalled();
  });

  it("returns the authenticated user", async () => {
    mocks.isSupabaseConfigured.mockReturnValue(true);
    const getUser = vi.fn().mockResolvedValue({ data: { user: user() }, error: null });
    mocks.createClient.mockResolvedValue({ auth: { getUser } } as unknown as SupabaseClient);

    const session = await import("@/lib/auth/session");

    await expect(session.getCurrentUser()).resolves.toMatchObject({ id: "user-1" });
  });

  it("returns null when Supabase reports an auth error", async () => {
    mocks.isSupabaseConfigured.mockReturnValue(true);
    mocks.createClient.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: { message: "expired" } }),
      },
    } as unknown as SupabaseClient);

    const session = await import("@/lib/auth/session");

    await expect(session.getCurrentUser()).resolves.toBeNull();
  });

  it("returns null when the client cannot be created", async () => {
    mocks.isSupabaseConfigured.mockReturnValue(true);
    mocks.createClient.mockRejectedValue(new Error("offline"));

    const session = await import("@/lib/auth/session");

    await expect(session.getCurrentUser()).resolves.toBeNull();
  });
});
