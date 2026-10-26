// @vitest-environment node
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  exchangeCodeForSession: vi.fn(),
  verifyOtp: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: mocks.createClient,
}));

import { GET as callbackGET } from "@/app/auth/callback/route";
import { GET as confirmGET } from "@/app/auth/confirm/route";

const ORIGIN = "http://localhost:3000";

function request(path: string) {
  return new NextRequest(`${ORIGIN}${path}`);
}

function location(response: Response) {
  return new URL(response.headers.get("location") ?? "");
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.exchangeCodeForSession.mockResolvedValue({ error: null });
  mocks.verifyOtp.mockResolvedValue({ error: null });
  mocks.createClient.mockResolvedValue({
    auth: {
      exchangeCodeForSession: mocks.exchangeCodeForSession,
      verifyOtp: mocks.verifyOtp,
    },
  });
});

describe("GET /auth/callback", () => {
  it("exchanges a valid code and redirects to the requested path", async () => {
    const response = await callbackGET(request("/auth/callback?code=abc&next=/reset-password"));

    expect(response.status).toBe(307);
    expect(location(response).pathname).toBe("/reset-password");
    expect(mocks.exchangeCodeForSession).toHaveBeenCalledWith("abc");
  });

  it("falls back to the landing page for an external next value", async () => {
    const response = await callbackGET(
      request("/auth/callback?code=abc&next=https://evil.example/steal"),
    );

    expect(location(response).pathname).toBe("/");
  });

  it("redirects provider errors to login with a friendly message", async () => {
    const response = await callbackGET(
      request(
        "/auth/callback?error_description=Invalid%20login%20credentials&next=/reset-password",
      ),
    );

    const url = location(response);
    expect(url.pathname).toBe("/login");
    expect(url.searchParams.get("error")).toBe("Wrong email or password.");
  });

  it("rejects a callback without a code", async () => {
    const response = await callbackGET(request("/auth/callback"));

    const url = location(response);
    expect(url.pathname).toBe("/login");
    expect(url.searchParams.get("error")).toBe(
      "The authentication link is missing a code. Request a new link.",
    );
    expect(mocks.exchangeCodeForSession).not.toHaveBeenCalled();
  });

  it("maps an exchange failure to a login error", async () => {
    mocks.exchangeCodeForSession.mockResolvedValue({
      error: { message: "Token has expired" },
    });

    const response = await callbackGET(
      request("/auth/callback?code=abc&next=/reset-password"),
    );

    const url = location(response);
    expect(url.pathname).toBe("/login");
    expect(url.searchParams.get("error")).toBe(
      "This reset link is invalid, expired, or has already been used. Request a new one.",
    );
  });

  it("handles an unexpected client failure", async () => {
    mocks.createClient.mockRejectedValue(new Error("boom"));

    const response = await callbackGET(request("/auth/callback?code=abc"));

    const url = location(response);
    expect(url.pathname).toBe("/login");
    expect(url.searchParams.get("error")).toBe(
      "Unable to complete the authentication link. Request a new link.",
    );
  });
});

describe("GET /auth/confirm", () => {
  it("verifies a token hash and redirects to the reset page by default", async () => {
    const response = await confirmGET(
      request("/auth/confirm?token_hash=hash-1&type=recovery"),
    );

    expect(location(response).pathname).toBe("/reset-password");
    expect(mocks.verifyOtp).toHaveBeenCalledWith({
      type: "recovery",
      token_hash: "hash-1",
    });
  });

  it("honors a safe internal next path", async () => {
    const response = await confirmGET(
      request("/auth/confirm?token_hash=hash-1&type=recovery&next=/status"),
    );

    expect(location(response).pathname).toBe("/status");
  });

  it("ignores an external next path", async () => {
    const response = await confirmGET(
      request("/auth/confirm?token_hash=hash-1&type=recovery&next=//evil.example"),
    );

    expect(location(response).pathname).toBe("/reset-password");
  });

  it("rejects an incomplete link", async () => {
    const response = await confirmGET(request("/auth/confirm?type=recovery"));

    const url = location(response);
    expect(url.pathname).toBe("/login");
    expect(url.searchParams.get("error")).toBe(
      "The reset link is invalid or incomplete. Request a new one.",
    );
    expect(mocks.verifyOtp).not.toHaveBeenCalled();
  });

  it("maps an expired token to a friendly error", async () => {
    mocks.verifyOtp.mockResolvedValue({
      error: { message: "Token has expired" },
    });

    const response = await confirmGET(
      request("/auth/confirm?token_hash=hash-1&type=recovery"),
    );

    const url = location(response);
    expect(url.pathname).toBe("/login");
    expect(url.searchParams.get("error")).toBe(
      "This reset link is invalid, expired, or has already been used. Request a new one.",
    );
  });

  it("handles an unexpected verification failure", async () => {
    mocks.verifyOtp.mockRejectedValue(new Error("network down"));

    const response = await confirmGET(
      request("/auth/confirm?token_hash=hash-1&type=recovery"),
    );

    const url = location(response);
    expect(url.pathname).toBe("/login");
    expect(url.searchParams.get("error")).toBe(
      "Unable to verify the reset link. Request a new one.",
    );
  });
});
