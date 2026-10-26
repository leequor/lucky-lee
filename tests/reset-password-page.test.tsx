import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  isSupabaseConfigured: vi.fn(),
  getCurrentUser: vi.fn(),
}));

vi.mock("@/lib/supabase/env", () => ({
  isSupabaseConfigured: mocks.isSupabaseConfigured,
}));
vi.mock("@/lib/auth/session", () => ({
  getCurrentUser: mocks.getCurrentUser,
}));
vi.mock("@/app/actions/auth", () => ({
  resetPasswordAction: vi.fn(),
}));

import ResetPasswordPage from "@/app/(auth)/reset-password/page";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ResetPasswordPage", () => {
  it("explains how to configure Supabase when it is missing", async () => {
    mocks.isSupabaseConfigured.mockReturnValue(false);

    render(await ResetPasswordPage());

    expect(screen.getByText("Supabase is not connected yet")).toBeInTheDocument();
    expect(screen.getByText(".env.local")).toBeInTheDocument();
    expect(mocks.getCurrentUser).not.toHaveBeenCalled();
  });

  it("explains an expired link when there is no session", async () => {
    mocks.isSupabaseConfigured.mockReturnValue(true);
    mocks.getCurrentUser.mockResolvedValue(null);

    render(await ResetPasswordPage());

    expect(screen.getByText("This link has expired")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /request a new reset link/i })).toHaveAttribute(
      "href",
      "/forgot-password",
    );
  });

  it("shows the reset form for a valid recovery session", async () => {
    mocks.isSupabaseConfigured.mockReturnValue(true);
    mocks.getCurrentUser.mockResolvedValue({ email: "user@example.com" });

    render(await ResetPasswordPage());

    expect(screen.getByText(/Choose a new password for user@example.com/)).toBeInTheDocument();
    expect(screen.getByLabelText("New password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm new password")).toBeInTheDocument();
  });
});
