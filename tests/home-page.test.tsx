import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT;${path}`);
  }),
  getCurrentUser: vi.fn(),
  getAuthUser: vi.fn(),
}));

vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/lib/auth/session", () => ({
  getCurrentUser: mocks.getCurrentUser,
  getAuthUser: mocks.getAuthUser,
}));
vi.mock("@/app/actions/auth", () => ({ logoutAction: vi.fn() }));

import HomePage from "@/app/page";
import { LandingView } from "@/components/landing/landing-view";

const authUser = {
  id: "user-1",
  email: "alex@luckypatcher.test",
  role: "superadmin" as const,
  fullName: "Alex Campita",
  createdAt: "2026-10-19T11:10:00.000Z",
};

describe("HomePage", () => {
  it("redirects a logged-out visitor to login", async () => {
    mocks.getCurrentUser.mockResolvedValue(null);

    await expect(HomePage()).rejects.toThrow("NEXT_REDIRECT;/login");
    expect(mocks.getAuthUser).not.toHaveBeenCalled();
  });

  it("renders the landing view for a signed-in user", async () => {
    mocks.getCurrentUser.mockResolvedValue({ id: "user-1" });
    mocks.getAuthUser.mockResolvedValue(authUser);

    const element = await HomePage();

    expect(element.type).toBe(LandingView);
    expect(element.props.user).toEqual(authUser);
    expect(mocks.getAuthUser).toHaveBeenCalledWith({ id: "user-1" });
  });
});
