import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("not found");
  }),
}));

vi.mock("@/app/actions/repair", () => ({
  addTicketNoteAction: vi.fn(),
  addTicketPartAction: vi.fn(),
  createInvoiceAction: vi.fn(),
  markInvoicePaidAction: vi.fn(),
  updateTicketDetailsAction: vi.fn(),
  updateTicketStatusAction: vi.fn(),
}));

vi.mock("@/lib/repair/queries", () => ({
  getTicketDetail: vi.fn(),
  getStaffProfiles: vi.fn(),
  getInventory: vi.fn(),
}));

vi.mock("@/lib/repair/session", () => ({
  getStaff: vi.fn(),
}));

import TicketDetailPage from "@/app/(workspace)/tickets/[id]/page";
import { getInventory, getStaffProfiles, getTicketDetail } from "@/lib/repair/queries";
import { getStaff } from "@/lib/repair/session";

const ticket = {
  id: "ticket-1",
  ticket_number: "PW-1041",
  public_code: "TRACK1041",
  customer_id: "c1",
  device_id: "d1",
  status: "in_repair",
  priority: "high",
  issue: "Screen cracked after a drop.",
  diagnosis: "OLED assembly damaged. Replacement required.",
  assigned_to: "s1",
  labour_cents: 4500,
  estimate_cents: 32000,
  final_cents: null,
  due_at: "2026-10-29",
  completed_at: null,
  created_by: "s1",
  created_at: "2026-10-27T10:00:00.000Z",
  updated_at: "2026-10-27T10:00:00.000Z",
  customer: {
    id: "c1",
    full_name: "Maya Chen",
    email: "maya@example.com",
    phone: "415-555-0142",
    company: "Northline Studio",
    notes: null,
    created_at: "2026-10-01T10:00:00.000Z",
    updated_at: "2026-10-01T10:00:00.000Z",
  },
  device: {
    id: "d1",
    customer_id: "c1",
    category: "phone",
    brand: "Apple",
    model: "iPhone 15 Pro",
    serial: "F2LX9A1P3K",
    color: "Natural titanium",
    notes: null,
    created_at: "2026-10-01T10:00:00.000Z",
    updated_at: "2026-10-01T10:00:00.000Z",
  },
  assignee: { id: "s1", full_name: "Demo Admin", email: "admin@example.com" },
  invoice: null,
  events: [
    {
      id: "event-1",
      ticket_id: "ticket-1",
      actor_id: "s1",
      kind: "status",
      status: "in_repair",
      body: "Status moved to in repair.",
      is_customer_visible: true,
      created_at: "2026-10-27T10:00:00.000Z",
      actor: { id: "s1", full_name: "Demo Admin", email: "admin@example.com" },
    },
  ],
  parts: [
    {
      quantity: 1,
      unit_price_cents: 24900,
      part: { id: "part-1", sku: "SCR-IP15", name: "iPhone 15 OLED assembly", category: "screen", stock: 4, price_cents: 24900 },
    },
  ],
};

describe("TicketDetailPage", () => {
  it("renders the repair brief, timeline, parts, and totals", async () => {
    vi.mocked(getTicketDetail).mockResolvedValue(ticket as never);
    vi.mocked(getStaffProfiles).mockResolvedValue([
      { id: "s1", email: "admin@example.com", full_name: "Demo Admin", role: "admin", created_at: null },
    ]);
    vi.mocked(getInventory).mockResolvedValue([
      {
        id: "part-1",
        sku: "SCR-IP15",
        name: "iPhone 15 OLED assembly",
        category: "screen",
        stock: 4,
        reorder_level: 2,
        cost_cents: 12900,
        price_cents: 24900,
        supplier: null,
        created_at: "2026-10-01T10:00:00.000Z",
        updated_at: "2026-10-01T10:00:00.000Z",
      },
    ]);
    vi.mocked(getStaff).mockResolvedValue({
      id: "s1",
      email: "alex@example.com",
      role: "superadmin",
      fullName: "Alex",
      createdAt: null,
    });

    render(
      await TicketDetailPage({
        params: Promise.resolve({ id: "ticket-1" }),
        searchParams: Promise.resolve({ notice: "Ticket updated." }),
      }),
    );

    expect(screen.getByRole("heading", { name: "PW-1041" })).toBeInTheDocument();
    expect(screen.getAllByText("Maya Chen").length).toBeGreaterThan(0);
    expect(screen.getAllByText("iPhone 15 OLED assembly").length).toBeGreaterThan(0);
    expect(screen.getByText("Status moved to in repair.")).toBeInTheDocument();
    expect(screen.getByText("Ticket updated.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Generate invoice" })).toBeInTheDocument();
    expect(screen.getByText("$329.28")).toBeInTheDocument();
  });

  it("tells technicians a manager will generate the invoice", async () => {
    vi.mocked(getTicketDetail).mockResolvedValue(ticket as never);
    vi.mocked(getStaffProfiles).mockResolvedValue([]);
    vi.mocked(getInventory).mockResolvedValue([]);
    vi.mocked(getStaff).mockResolvedValue({
      id: "s3",
      email: "user@example.com",
      role: "user",
      fullName: "Demo User",
      createdAt: null,
    });

    render(
      await TicketDetailPage({
        params: Promise.resolve({ id: "ticket-1" }),
        searchParams: Promise.resolve({}),
      }),
    );

    expect(screen.queryByRole("button", { name: "Generate invoice" })).not.toBeInTheDocument();
    expect(screen.getByText(/A manager generates the invoice/)).toBeInTheDocument();
  });

  it("tells technicians an unpaid invoice is awaiting a manager", async () => {
    vi.mocked(getTicketDetail).mockResolvedValue({
      ...ticket,
      invoice: {
        id: "invoice-1",
        ticket_id: "ticket-1",
        invoice_number: "INV-1",
        labour_cents: 4500,
        parts_cents: 24900,
        subtotal_cents: 29400,
        tax_cents: 3528,
        total_cents: 32928,
        status: "sent",
        issued_at: "2026-10-27T10:00:00.000Z",
        paid_at: null,
        notes: null,
      },
    } as never);
    vi.mocked(getStaffProfiles).mockResolvedValue([]);
    vi.mocked(getInventory).mockResolvedValue([]);
    vi.mocked(getStaff).mockResolvedValue({
      id: "s3",
      email: "user@example.com",
      role: "user",
      fullName: "Demo User",
      createdAt: null,
    });

    render(
      await TicketDetailPage({
        params: Promise.resolve({ id: "ticket-1" }),
        searchParams: Promise.resolve({}),
      }),
    );

    expect(screen.queryByRole("button", { name: /Mark paid/ })).not.toBeInTheDocument();
    expect(screen.getByText("Awaiting manager collection.")).toBeInTheDocument();
  });
});
