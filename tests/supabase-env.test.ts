// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getSupabasePublicConfig,
  isSupabaseConfigured,
  SupabaseConfigError,
} from "@/lib/supabase/env";

function setEnv(url?: string, key?: string) {
  if (url === undefined) {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
  } else {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", url);
  }
  if (key === undefined) {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
  } else {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", key);
  }
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getSupabasePublicConfig", () => {
  it("throws when the URL or key is missing", () => {
    setEnv(undefined, undefined);

    expect(() => getSupabasePublicConfig()).toThrow(SupabaseConfigError);
    expect(() => getSupabasePublicConfig()).toThrow(/not configured/);
  });

  it("rejects an invalid URL", () => {
    setEnv("not-a-url", "key");

    expect(() => getSupabasePublicConfig()).toThrow(/must be a valid URL/);
  });

  it("rejects plain HTTP for a non-local host", () => {
    setEnv("http://project.supabase.co", "key");

    expect(() => getSupabasePublicConfig()).toThrow(/must use HTTPS/);
  });

  it("allows HTTP for localhost and 127.0.0.1", () => {
    setEnv("http://localhost:54321/", "key");
    expect(getSupabasePublicConfig().url).toBe("http://localhost:54321");

    setEnv("http://127.0.0.1:54321", "key");
    expect(getSupabasePublicConfig().url).toBe("http://127.0.0.1:54321");
  });

  it("rejects credentials, paths, queries, and hashes", () => {
    const invalid = [
      "https://user:pass@project.supabase.co",
      "https://project.supabase.co/rest/v1",
      "https://project.supabase.co?x=1",
      "https://project.supabase.co#fragment",
    ];

    for (const url of invalid) {
      setEnv(url, "key");
      expect(() => getSupabasePublicConfig(), url).toThrow(/without a path, query, or credentials/);
    }
  });

  it("trims values and normalizes the origin", () => {
    setEnv("  https://project.supabase.co  ", "  key  ");

    expect(getSupabasePublicConfig()).toEqual({
      url: "https://project.supabase.co",
      anonKey: "key",
    });
  });
});

describe("isSupabaseConfigured", () => {
  it("returns true for a valid configuration", () => {
    setEnv("https://project.supabase.co", "key");
    expect(isSupabaseConfigured()).toBe(true);
  });

  it("returns false for a missing or invalid configuration", () => {
    setEnv(undefined, "key");
    expect(isSupabaseConfigured()).toBe(false);

    setEnv("http://project.supabase.co", "key");
    expect(isSupabaseConfigured()).toBe(false);
  });
});
