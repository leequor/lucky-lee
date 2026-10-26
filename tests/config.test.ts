// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

import { getAuthCallbackUrl, getSiteUrl } from "@/lib/config";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getSiteUrl", () => {
  it("defaults to localhost", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });

  it("removes a trailing slash", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://lucky.example/");
    expect(getSiteUrl()).toBe("https://lucky.example");
  });
});

describe("getAuthCallbackUrl", () => {
  it("encodes the nested next path", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://lucky.example");

    expect(getAuthCallbackUrl("/reset-password?source=email")).toBe(
      "https://lucky.example/auth/callback?next=%2Freset-password%3Fsource%3Demail",
    );
  });

  it("defaults to the reset page", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");

    expect(getAuthCallbackUrl()).toBe(
      "http://localhost:3000/auth/callback?next=%2Freset-password",
    );
  });
});
