import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/tickets",
}));

vi.mock("@/app/actions/auth", () => ({
  logoutAction: vi.fn(),
}));

import { WorkspaceShell } from "@/components/workspace/workspace-shell";

const user = {
  id: "user-1",
  email: "alex@luckypatcher.test",
  role: "superadmin" as const,
  fullName: "Alex Campita",
  createdAt: "2026-10-19T11:10:00.000Z",
};

describe("WorkspaceShell", () => {
  it("renders the product, navigation, user, and logout", () => {
    render(
      <WorkspaceShell user={user}>
        <p>Page body</p>
      </WorkspaceShell>,
    );

    expect(screen.getAllByText("Patchwork").length).toBeGreaterThan(0);
    expect(screen.getByText("Page body")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Tickets/ }).length).toBeGreaterThan(0);
    expect(screen.getByText("Alex Campita")).toBeInTheDocument();
    expect(screen.getByText("Owner")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Log out" }).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Public tracker" })).toHaveAttribute("href", "/track");
  });

  it("opens and closes mobile navigation", async () => {
    const browser = userEvent.setup();
    render(
      <WorkspaceShell user={user}>
        <p>Page body</p>
      </WorkspaceShell>,
    );

    await browser.click(screen.getByRole("button", { name: "Open navigation" }));
    expect(screen.getByRole("button", { name: "Close navigation overlay" })).toBeInTheDocument();
    await browser.click(screen.getByRole("button", { name: "Close navigation overlay" }));
    expect(
      screen.queryByRole("button", { name: "Close navigation overlay" }),
    ).not.toBeInTheDocument();
  });
});
