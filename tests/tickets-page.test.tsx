import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/repair/queries", () => ({
  getTickets: vi.fn(),
  getStaffProfiles: vi.fn(),
}));

import TicketsPage from "@/app/(workspace)/tickets/page";
import { getStaffProfiles, getTickets } from "@/lib/repair/queries";
import type { TicketRow } from "@/lib/repair/types";

const ticket = {
  id: "ticket-1",
  ticket_number: "PW-1041",
  public_code: "TRACK1041",
  status: "waiting_parts",
  priority: "high",
  issue: "Screen cracked after a drop.",
  customer: { id: "c1", full_name: "Maya Chen", phone: "415-555-0142", email: "maya@example.com" },
  device: { id: "d1", category: "phone", brand: "Apple", model: "iPhone 15 Pro" },
  assignee: { id: "s1", full_name: "Demo Admin", email: "admin@example.com" },
  created_at: "2026-10-27T10:00:00.000Z",
  updated_at: "2026-10-27T10:00:00.000Z",
} as unknown as TicketRow;

describe("TicketsPage", () => {
  it("renders tickets, filters, and staff options", async () => {
    vi.mocked(getTickets).mockResolvedValue([ticket]);
    vi.mocked(getStaffProfiles).mockResolvedValue([
      { id: "s1", email: "admin@example.com", full_name: "Demo Admin", role: "admin", created_at: null },
    ]);

    render(await TicketsPage({ searchParams: Promise.resolve({ q: "Maya" }) }));

    expect(screen.getByRole("heading", { name: "Tickets" })).toBeInTheDocument();
    expect(screen.getByText("PW-1041")).toBeInTheDocument();
    expect(screen.getAllByText("Maya Chen").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Waiting on parts").length).toBeGreaterThan(0);
    expect(screen.getByRole("option", { name: "Demo Admin" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Clear" })).toHaveAttribute("href", "/tickets");
  });

  it("shows the empty state when nothing matches", async () => {
    vi.mocked(getTickets).mockResolvedValue([]);
    vi.mocked(getStaffProfiles).mockResolvedValue([]);

    render(await TicketsPage({ searchParams: Promise.resolve({ status: "ready" }) }));

    expect(screen.getByText("No matching tickets")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "New ticket" })[0]).toHaveAttribute(
      "href",
      "/tickets/new",
    );
  });
});
