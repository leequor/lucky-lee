// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

import { initialAuthState } from "@/lib/auth/types";

const mocks = vi.hoisted(() => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT;${path}`);
  }),
  createClient: vi.fn(),
  loginWithPassword: vi.fn(),
  registerWithPassword: vi.fn(),
  requestPasswordReset: vi.fn(),
  updatePassword: vi.fn(),
  logout: vi.fn(),
}));

vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: mocks.createClient,
}));
vi.mock("@/lib/auth/service", () => ({
  loginWithPassword: mocks.loginWithPassword,
  registerWithPassword: mocks.registerWithPassword,
  requestPasswordReset: mocks.requestPasswordReset,
  updatePassword: mocks.updatePassword,
  logout: mocks.logout,
}));

import {
  forgotPasswordAction,
  loginAction,
  logoutAction,
  registerAction,
  resetPasswordAction,
} from "@/app/actions/auth";

const signOut = vi.fn();

function formData(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) {
    data.set(key, value);
  }
  return data;
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.createClient.mockResolvedValue({ auth: { signOut } });
  signOut.mockResolvedValue({ error: null });
});

describe("loginAction", () => {
  it("redirects to the landing page after a successful login", async () => {
    mocks.loginWithPassword.mockResolvedValue({ ok: true, data: {} });

    await expect(
      loginAction(initialAuthState, formData({ email: "user@example.com", password: "secret123" })),
    ).rejects.toThrow("NEXT_REDIRECT;/");

    expect(mocks.loginWithPassword).toHaveBeenCalledWith(expect.anything(), {
      email: "user@example.com",
      password: "secret123",
    });
  });

  it("returns the service error and field errors without redirecting", async () => {
    mocks.loginWithPassword.mockResolvedValue({
      ok: false,
      message: "Email is required.",
      fieldErrors: { email: "Email is required." },
    });

    const state = await loginAction(initialAuthState, formData({ email: "", password: "" }));

    expect(state).toEqual({
      status: "error",
      message: "Email is required.",
      fieldErrors: { email: "Email is required." },
    });
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("reports a configuration failure without calling Supabase", async () => {
    mocks.createClient.mockRejectedValue(new Error("Supabase is not configured"));

    const state = await loginAction(
      initialAuthState,
      formData({ email: "user@example.com", password: "secret123" }),
    );

    expect(state).toEqual({
      status: "error",
      message:
        "Supabase is not configured. Copy .env.example to .env.local and add your project keys.",
    });
    expect(mocks.loginWithPassword).not.toHaveBeenCalled();
  });
});

describe("registerAction", () => {
  it("redirects when Supabase returns a session", async () => {
    mocks.registerWithPassword.mockResolvedValue({
      ok: true,
      data: { needsEmailConfirmation: false },
    });

    await expect(
      registerAction(
        initialAuthState,
        formData({ email: "new@example.com", password: "secret123", fullName: "New Person" }),
      ),
    ).rejects.toThrow("NEXT_REDIRECT;/");
  });

  it("asks the user to confirm when Supabase returns no session", async () => {
    mocks.registerWithPassword.mockResolvedValue({
      ok: true,
      data: { needsEmailConfirmation: true },
    });

    const state = await registerAction(
      initialAuthState,
      formData({ email: "new@example.com", password: "secret123", fullName: "" }),
    );

    expect(state).toEqual({
      status: "success",
      message:
        "Account created. Check your email for the confirmation link, then return here to log in.",
    });
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("passes field errors through to the form", async () => {
    mocks.registerWithPassword.mockResolvedValue({
      ok: false,
      message: "Password is required.",
      fieldErrors: { password: "Password is required." },
    });

    const state = await registerAction(
      initialAuthState,
      formData({ email: "new@example.com", password: "" }),
    );

    expect(state).toEqual({
      status: "error",
      message: "Password is required.",
      fieldErrors: { password: "Password is required." },
    });
  });
});

describe("forgotPasswordAction", () => {
  it("returns the same generic success message for a valid request", async () => {
    mocks.requestPasswordReset.mockResolvedValue({
      ok: true,
      data: { email: "user@example.com" },
    });

    const state = await forgotPasswordAction(
      initialAuthState,
      formData({ email: "user@example.com" }),
    );

    expect(state.status).toBe("success");
    expect(state.message).toContain("user@example.com");
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("returns validation errors", async () => {
    mocks.requestPasswordReset.mockResolvedValue({
      ok: false,
      message: "Please enter a valid email address.",
      fieldErrors: { email: "Please enter a valid email address." },
    });

    const state = await forgotPasswordAction(initialAuthState, formData({ email: "bad" }));

    expect(state.status).toBe("error");
    expect(state.fieldErrors).toEqual({ email: "Please enter a valid email address." });
  });
});

describe("resetPasswordAction", () => {
  it("signs out and redirects to login after a successful update", async () => {
    mocks.updatePassword.mockResolvedValue({ ok: true, data: { updated: true } });

    await expect(
      resetPasswordAction(
        initialAuthState,
        formData({ password: "secret123", confirmPassword: "secret123" }),
      ),
    ).rejects.toThrow("NEXT_REDIRECT;/login?message=");

    expect(signOut).toHaveBeenCalled();
    expect(mocks.redirect.mock.calls[0]?.[0]).toContain(
      encodeURIComponent("Password updated. Log in with your new password."),
    );
  });

  it("does not sign out or redirect when the update fails", async () => {
    mocks.updatePassword.mockResolvedValue({
      ok: false,
      message: "Passwords do not match.",
      fieldErrors: { confirmPassword: "Passwords do not match." },
    });

    const state = await resetPasswordAction(
      initialAuthState,
      formData({ password: "secret123", confirmPassword: "secret456" }),
    );

    expect(state.status).toBe("error");
    expect(signOut).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });
});

describe("logoutAction", () => {
  it("signs out and redirects to login", async () => {
    mocks.logout.mockResolvedValue({ ok: true, data: { signedOut: true } });

    await expect(logoutAction()).rejects.toThrow("NEXT_REDIRECT;/login");

    expect(mocks.logout).toHaveBeenCalled();
  });

  it("still redirects when the Supabase client is unavailable", async () => {
    mocks.createClient.mockRejectedValue(new Error("offline"));

    await expect(logoutAction()).rejects.toThrow("NEXT_REDIRECT;/login");

    expect(mocks.logout).not.toHaveBeenCalled();
  });
});
