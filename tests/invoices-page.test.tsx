import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/app/actions/repair", () => ({
  markInvoicePaidAction: vi.fn(),
}));

vi.mock("@/lib/repair/queries", () => ({
  getInvoices: vi.fn(),
}));

vi.mock("@/lib/repair/session", () => ({
  getStaff: vi.fn(),
}));

import InvoicesPage from "@/app/(workspace)/invoices/page";
import { getInvoices } from "@/lib/repair/queries";
import { getStaff } from "@/lib/repair/session";

const baseInvoice = {
  ticket_id: "t1",
  labour_cents: 10000,
  parts_cents: 0,
  subtotal_cents: 10000,
  tax_cents: 1200,
  total_cents: 11200,
  notes: null,
  issued_at: "2026-10-01T10:00:00.000Z",
  ticket: {
    ticket_number: "PW-1041",
    status: "ready" as const,
    customer: { id: "c1", full_name: "Maya Chen" },
    device: { id: "d1", brand: "Apple", model: "iPhone 15 Pro" },
  },
};

const invoices = [
  { ...baseInvoice, id: "i1", invoice_number: "INV-1", status: "paid" as const, paid_at: "2026-10-02T10:00:00.000Z" },
  { ...baseInvoice, id: "i2", invoice_number: "INV-2", status: "sent" as const, paid_at: null },
  { ...baseInvoice, id: "i3", invoice_number: "INV-3", status: "void" as const, paid_at: null },
];

const manager = { id: "s2", email: "admin@example.com", role: "admin" as const, fullName: "Demo Admin", createdAt: null };
const technician = { id: "s3", email: "user@example.com", role: "user" as const, fullName: "Demo User", createdAt: null };

describe("InvoicesPage", () => {
  it("lets managers collect unpaid invoices", async () => {
    vi.mocked(getStaff).mockResolvedValue(manager);
    vi.mocked(getInvoices).mockResolvedValue(invoices as never);

    render(await InvoicesPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getAllByRole("button", { name: "Mark paid" })).toHaveLength(1);
    expect(screen.getByText("Paid Oct 2, 2026")).toBeInTheDocument();
    expect(screen.getAllByText("Void").length).toBeGreaterThan(0);
    expect(screen.queryByText("Manager review")).not.toBeInTheDocument();
  });

  it("shows technicians a read-only ledger", async () => {
    vi.mocked(getStaff).mockResolvedValue(technician);
    vi.mocked(getInvoices).mockResolvedValue(invoices as never);

    render(await InvoicesPage({ searchParams: Promise.resolve({ error: "No access." }) }));

    expect(screen.queryByRole("button", { name: "Mark paid" })).not.toBeInTheDocument();
    expect(screen.getByText("Manager review")).toBeInTheDocument();
    expect(screen.getByText("No access.")).toBeInTheDocument();
  });
});
