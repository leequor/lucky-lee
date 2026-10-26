import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/app/actions/auth", () => ({
  logoutAction: vi.fn(),
}));

import { LandingView } from "@/components/landing/landing-view";

const user = {
  id: "user-1",
  email: "alex@luckypatcher.test",
  role: "superadmin" as const,
  fullName: "Alex Campita",
  createdAt: "2026-10-19T11:10:00.000Z",
};

describe("LandingView", () => {
  it("shows the signed-in email and logout control", () => {
    render(<LandingView user={user} />);

    expect(screen.getAllByText("alex@luckypatcher.test").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /log out/i })).toBeInTheDocument();
    expect(screen.getAllByText("Superadmin").length).toBeGreaterThan(0);
  });

  it("renders the sprint checklist and presentation shortcuts", () => {
    render(<LandingView user={user} />);

    expect(screen.getByText("Sprint 1 checklist")).toBeInTheDocument();
    expect(screen.getByText("Keep the demo calm")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /check system status/i })).toBeInTheDocument();
  });
});
