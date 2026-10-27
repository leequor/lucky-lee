import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/session", () => ({
  getCurrentUser: vi.fn(),
  getAuthUser: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT;${path}`);
  }),
}));

import { getAuthUser, getCurrentUser } from "@/lib/auth/session";
import { getStaff, requireAdmin, requireStaff } from "@/lib/repair/session";

const user = {
  id: "user-1",
  email: "alex@example.com",
  role: "superadmin" as const,
  fullName: "Alex Campita",
  createdAt: "2026-10-19T11:10:00.000Z",
};

describe("repair session guards", () => {
  it("redirects when there is no authenticated user", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);
    await expect(requireStaff()).rejects.toThrow("NEXT_REDIRECT;/login");
  });

  it("returns the current staff member", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: "user-1" } as never);
    vi.mocked(getAuthUser).mockResolvedValue(user);
    await expect(requireStaff()).resolves.toEqual(user);
    await expect(requireAdmin()).resolves.toEqual(user);
    await expect(getStaff()).resolves.toEqual(user);
  });

  it("blocks technicians from admin routes", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: "user-1" } as never);
    vi.mocked(getAuthUser).mockResolvedValue({ ...user, role: "user" });
    await expect(requireAdmin()).rejects.toThrow("NEXT_REDIRECT;/");
  });

  it("returns null for getStaff when signed out", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);
    await expect(getStaff()).resolves.toBeNull();
  });
});
