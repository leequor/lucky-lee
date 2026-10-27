import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/repair/queries", () => ({
  getDashboardData: vi.fn(),
}));

vi.mock("@/components/patchwork/repair-bench", () => ({
  RepairBench: () => <div>3D repair bench</div>,
}));

import DashboardPage from "@/app/(workspace)/page";
import { getDashboardData } from "@/lib/repair/queries";
import type { DashboardData } from "@/lib/repair/types";

const ticket = {
  id: "ticket-1",
  ticket_number: "PW-1041",
  public_code: "TRACK1041",
  status: "in_repair" as const,
  priority: "high" as const,
  issue: "Screen cracked after a drop.",
  customer: { id: "c1", full_name: "Maya Chen", phone: "415-555-0142", email: "maya@example.com" },
  device: { id: "d1", category: "phone" as const, brand: "Apple", model: "iPhone 15 Pro" },
  assignee: { id: "s1", full_name: "Demo Admin", email: "admin@example.com" },
  created_at: "2026-10-27T10:00:00.000Z",
  updated_at: "2026-10-27T10:00:00.000Z",
};

const data = {
  counts: {
    intake: 1,
    diagnosing: 2,
    waiting_parts: 1,
    in_repair: 2,
    ready: 2,
    picked_up: 2,
    cancelled: 1,
  },
  openCount: 6,
  readyCount: 2,
  revenueMtd: 37632,
  lowStock: [
    {
      id: "part-1",
      sku: "SCR-XPS",
      name: "Dell XPS OLED panel",
      stock: 0,
      reorder_level: 1,
    },
  ],
  queue: [ticket],
  readyTickets: [{ ...ticket, id: "ticket-2", ticket_number: "PW-1047", status: "ready" }],
  teamLoad: [
    { id: "s1", email: "alex@example.com", full_name: "Alex Campita", role: "superadmin", open: 2, active: 1 },
    { id: "s2", email: "tech@example.com", full_name: "Demo User", role: "user", open: 3, active: 2 },
  ],
} as unknown as DashboardData;

describe("DashboardPage", () => {
  it("renders live shop metrics and the queue", async () => {
    vi.mocked(getDashboardData).mockResolvedValue(data);
    render(await DashboardPage());

    expect(screen.getByRole("heading", { name: "Repair desk" })).toBeInTheDocument();
    expect(screen.getByText("3D repair bench")).toBeInTheDocument();
    expect(screen.getAllByText("PW-1041").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Maya Chen").length).toBeGreaterThan(0);
    expect(screen.getByText("Open jobs")).toBeInTheDocument();
    expect(screen.getByText("Dell XPS OLED panel")).toBeInTheDocument();
    expect(screen.getByText("Alex Campita")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Open tracker/ })).toHaveAttribute("href", "/track");
  });

  it("shows empty states when the queue is clear", async () => {
    vi.mocked(getDashboardData).mockResolvedValue({
      ...data,
      queue: [],
      readyTickets: [],
      lowStock: [],
      openCount: 0,
      readyCount: 0,
      teamLoad: [],
    });
    render(await DashboardPage());

    expect(screen.getByText("The bench is clear")).toBeInTheDocument();
    expect(screen.getByText("Nothing waiting for pickup.")).toBeInTheDocument();
    expect(screen.getByText("Stock levels are healthy.")).toBeInTheDocument();
    expect(screen.getByText("No staff profiles yet.")).toBeInTheDocument();
  });
});
