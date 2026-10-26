import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";

import {
  getDefaultRole,
  loginWithPassword,
  logout,
  registerWithPassword,
  requestPasswordReset,
  updatePassword,
} from "@/lib/auth/service";

function fakeClient(auth: Record<string, unknown>) {
  return { auth } as unknown as SupabaseClient;
}

const user = {
  id: "user-1",
  email: "new@example.com",
  app_metadata: {},
  user_metadata: { role: "superadmin" },
  created_at: "2026-10-19T11:10:00.000Z",
  identities: [{ provider: "email" }],
};

const session = {
  access_token: "access",
  refresh_token: "refresh",
  expires_in: 3600,
  token_type: "bearer",
  user,
};

describe("getDefaultRole", () => {
  it("defaults development signups to superadmin", () => {
    expect(getDefaultRole({ NODE_ENV: "development" })).toBe("superadmin");
  });

  it("defaults production signups to user", () => {
    expect(getDefaultRole({ NODE_ENV: "production" })).toBe("user");
  });

  it("honors an explicit valid role", () => {
    expect(getDefaultRole({ NODE_ENV: "production", NEXT_PUBLIC_DEV_DEFAULT_ROLE: "admin" })).toBe(
      "admin",
    );
  });
});

describe("registerWithPassword", () => {
  it("rejects a short password before contacting Supabase", async () => {
    const signUp = vi.fn();
    const client = fakeClient({ signUp });

    const result = await registerWithPassword(client, {
      email: "new@example.com",
      password: "abc",
    });

    expect(result.ok).toBe(false);
    expect(signUp).not.toHaveBeenCalled();
  });

  it("normalizes the email and sends the development role", async () => {
    const signUp = vi.fn().mockResolvedValue({
      data: { user, session: null },
      error: null,
    });
    const client = fakeClient({ signUp });

    const result = await registerWithPassword(
      client,
      { email: " New@Example.com ", password: "secret123" },
      { env: { NODE_ENV: "development" } },
    );

    expect(signUp).toHaveBeenCalledWith({
      email: "new@example.com",
      password: "secret123",
      options: {
        emailRedirectTo: undefined,
        data: { role: "superadmin", full_name: "" },
      },
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.needsEmailConfirmation).toBe(true);
      expect(result.data.role).toBe("superadmin");
    }
  });

  it("returns a clear duplicate email message", async () => {
    const signUp = vi.fn().mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "User already registered" },
    });

    const result = await registerWithPassword(fakeClient({ signUp }), {
      email: "taken@example.com",
      password: "secret123",
    });

    expect(result).toEqual({
      ok: false,
      message: "Email already registered.",
    });
  });

  it("treats an obfuscated duplicate (empty identities) as an error", async () => {
    const signUp = vi.fn().mockResolvedValue({
      data: { user: { ...user, identities: [] }, session: null },
      error: null,
    });

    const result = await registerWithPassword(fakeClient({ signUp }), {
      email: "taken@example.com",
      password: "secret123",
    });

    expect(result).toEqual({
      ok: false,
      message: "Email already registered.",
    });
  });
});

describe("loginWithPassword", () => {
  it("returns the user and session on success", async () => {
    const signInWithPassword = vi.fn().mockResolvedValue({
      data: { user, session },
      error: null,
    });

    const result = await loginWithPassword(
      fakeClient({ signInWithPassword }),
      { email: "new@example.com", password: "secret123" },
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.user.email).toBe("new@example.com");
      expect(result.data.session.access_token).toBe("access");
    }
  });

  it("maps a wrong password to a clear message", async () => {
    const signInWithPassword = vi.fn().mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "Invalid login credentials" },
    });

    const result = await loginWithPassword(
      fakeClient({ signInWithPassword }),
      { email: "new@example.com", password: "wrong" },
    );

    expect(result).toEqual({
      ok: false,
      message: "Wrong email or password.",
    });
  });

  it("validates empty fields before calling Supabase", async () => {
    const signInWithPassword = vi.fn();

    const result = await loginWithPassword(
      fakeClient({ signInWithPassword }),
      { email: "", password: "" },
    );

    expect(result.ok).toBe(false);
    expect(signInWithPassword).not.toHaveBeenCalled();
  });
});

describe("requestPasswordReset", () => {
  it("rejects an invalid email before calling Supabase", async () => {
    const resetPasswordForEmail = vi.fn();

    const result = await requestPasswordReset(
      fakeClient({ resetPasswordForEmail }),
      "not-an-email",
      { redirectTo: "http://localhost:3000/auth/callback" },
    );

    expect(result.ok).toBe(false);
    expect(resetPasswordForEmail).not.toHaveBeenCalled();
  });

  it("returns a generic success for unknown emails", async () => {
    const resetPasswordForEmail = vi.fn().mockResolvedValue({
      data: {},
      error: null,
    });

    const result = await requestPasswordReset(
      fakeClient({ resetPasswordForEmail }),
      "new@example.com",
      { redirectTo: "http://localhost:3000/auth/callback" },
    );

    expect(result).toEqual({ ok: true, data: { email: "new@example.com" } });
  });

  it("maps rate limiting", async () => {
    const resetPasswordForEmail = vi.fn().mockResolvedValue({
      data: {},
      error: { message: "Too many requests" },
    });

    const result = await requestPasswordReset(
      fakeClient({ resetPasswordForEmail }),
      "new@example.com",
      { redirectTo: "http://localhost:3000/auth/callback" },
    );

    expect(result).toEqual({
      ok: false,
      message: "Too many attempts. Please wait a minute and try again.",
    });
  });
});

describe("updatePassword", () => {
  it("rejects mismatched passwords before calling Supabase", async () => {
    const updateUser = vi.fn();

    const result = await updatePassword(fakeClient({ updateUser }), {
      password: "secret123",
      confirmPassword: "secret456",
    });

    expect(result.ok).toBe(false);
    expect(updateUser).not.toHaveBeenCalled();
  });

  it("updates a valid password", async () => {
    const updateUser = vi.fn().mockResolvedValue({ data: { user }, error: null });

    const result = await updatePassword(fakeClient({ updateUser }), {
      password: "secret123",
      confirmPassword: "secret123",
    });

    expect(result).toEqual({ ok: true, data: { updated: true } });
    expect(updateUser).toHaveBeenCalledWith({ password: "secret123" });
  });

  it("maps a missing session to an expired link", async () => {
    const updateUser = vi.fn().mockResolvedValue({
      data: { user: null },
      error: { message: "Auth session missing!" },
    });

    const result = await updatePassword(fakeClient({ updateUser }), {
      password: "secret123",
      confirmPassword: "secret123",
    });

    expect(result).toEqual({
      ok: false,
      message:
        "This reset link is invalid, expired, or has already been used. Request a new one.",
    });
  });
});

describe("logout", () => {
  it("signs out and reports success", async () => {
    const signOut = vi.fn().mockResolvedValue({ error: null });

    const result = await logout(fakeClient({ signOut }));

    expect(result).toEqual({ ok: true, data: { signedOut: true } });
    expect(signOut).toHaveBeenCalled();
  });
});
