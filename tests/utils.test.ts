import { describe, expect, it } from "vitest";

import { cn, formatDate, initials, safeNextPath } from "@/lib/utils";

describe("safeNextPath", () => {
  it("keeps an internal path with query and hash", () => {
    expect(safeNextPath("/reset-password?source=email#form")).toBe(
      "/reset-password?source=email#form",
    );
  });

  it("rejects an absolute external URL", () => {
    expect(safeNextPath("https://evil.example/login")).toBe("/");
  });

  it("rejects a protocol-relative URL", () => {
    expect(safeNextPath("//evil.example/login")).toBe("/");
  });

  it("rejects a backslash authority escape", () => {
    expect(safeNextPath("/\\evil.example/login")).toBe("/");
  });

  it("rejects missing values and control characters", () => {
    expect(safeNextPath(null)).toBe("/");
    expect(safeNextPath("/dash\u0000board")).toBe("/");
  });
});

describe("formatDate", () => {
  it("formats a timestamp", () => {
    expect(formatDate("2026-10-19T11:10:00.000Z")).toBe("Oct 19, 2026");
  });

  it("falls back for missing values", () => {
    expect(formatDate(null)).toBe("Just now");
    expect(formatDate(undefined)).toBe("Just now");
  });
});

describe("initials", () => {
  it("takes the first two name parts", () => {
    expect(initials("Alex R. Campita")).toBe("AR");
  });

  it("handles emails and empty values", () => {
    expect(initials("alex@luckypatcher.test")).toBe("AL");
    expect(initials("")).toBe("");
  });
});

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("one", false && "two", undefined, "three")).toBe("one three");
  });
});
