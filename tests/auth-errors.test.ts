import { describe, expect, it } from "vitest";

import { isExpiredOrUsedLinkError, mapAuthError } from "@/lib/auth/errors";

describe("mapAuthError", () => {
  it("maps invalid credentials to a clear login message", () => {
    expect(mapAuthError("Invalid login credentials", "login")).toBe(
      "Wrong email or password.",
    );
  });

  it("maps duplicate registration errors", () => {
    expect(mapAuthError("User already registered", "register")).toBe(
      "Email already registered.",
    );
  });

  it("maps short password errors", () => {
    expect(mapAuthError("Password should be at least 6 characters", "register")).toBe(
      "Password must be at least 6 characters long.",
    );
  });

  it("maps expired reset links", () => {
    expect(mapAuthError("Token has expired", "reset")).toBe(
      "This reset link is invalid, expired, or has already been used. Request a new one.",
    );
  });

  it("maps missing sessions", () => {
    expect(mapAuthError("Auth session missing!", "reset")).toBe(
      "This reset link is invalid, expired, or has already been used. Request a new one.",
    );
  });

  it("maps network failures", () => {
    expect(mapAuthError("fetch failed", "general")).toBe(
      "Unable to reach Supabase. Check your connection and environment settings.",
    );
  });

  it("falls back with context-specific copy", () => {
    expect(mapAuthError("unexpected", "login")).toBe(
      "Unable to log in right now. Please try again.",
    );
  });
});

describe("isExpiredOrUsedLinkError", () => {
  it("recognizes expired and used links", () => {
    expect(isExpiredOrUsedLinkError("Token has expired")).toBe(true);
    expect(isExpiredOrUsedLinkError("Link already used")).toBe(true);
    expect(isExpiredOrUsedLinkError("Auth session missing")).toBe(true);
  });

  it("does not flag unrelated errors", () => {
    expect(isExpiredOrUsedLinkError("Wrong email or password")).toBe(false);
  });
});
