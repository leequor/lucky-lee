import { describe, expect, it } from "vitest";

import { safeNextPath } from "@/lib/utils";

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
