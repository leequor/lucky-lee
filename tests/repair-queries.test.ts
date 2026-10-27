import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(),
}));

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getCustomerDetail,
  getCustomers,
  getDashboardData,
  getInventory,
  getInvoices,
  getStaffProfiles,
  getTicketDetail,
  getTickets,
  getTrackedTicket,
} from "@/lib/repair/queries";

const baseTicket = {
  id: "ticket-1",
  ticket_number: "PW-1041",
  public_code: "TRACK1041",
  customer_id: "c1",
  device_id: "d1",
  status: "in_repair",
  priority: "high",
  issue: "Screen cracked after a drop.",
  diagnosis: "OLED assembly damaged.",
  assigned_to: "s1",
  labour_cents: 4500,
  estimate_cents: 32000,
  final_cents: null,
  due_at: "2026-10-29",
  completed_at: null,
  created_by: "s1",
  created_at: "2026-10-27T10:00:00.000Z",
  updated_at: "2026-10-27T10:00:00.000Z",
  customer: { id: "c1", full_name: "Maya Chen", phone: "415-555-0142", email: "maya@example.com" },
  device: { id: "d1", category: "phone", brand: "Apple", model: "iPhone 15 Pro" },
  assignee: { id: "s1", full_name: "Demo Admin", email: "admin@example.com" },
};

const detailedTicket = {
  ...baseTicket,
  customer: {
    ...baseTicket.customer,
    company: "Northline Studio",
    notes: null,
    created_at: "2026-10-01T10:00:00.000Z",
    updated_at: "2026-10-01T10:00:00.000Z",
  },
  device: {
    ...baseTicket.device,
    customer_id: "c1",
    serial: "F2LX9A1P3K",
    color: "Natural titanium",
    notes: null,
    created_at: "2026-10-01T10:00:00.000Z",
    updated_at: "2026-10-01T10:00:00.000Z",
  },
  invoice: null,
};

const part = {
  id: "part-1",
  sku: "SCR-IP15",
  name: "iPhone 15 OLED assembly",
  category: "screen",
  stock: 4,
  reorder_level: 3,
  cost_cents: 12900,
  price_cents: 24900,
  supplier: "MobileParts",
  created_at: "2026-10-01T10:00:00.000Z",
  updated_at: "2026-10-01T10:00:00.000Z",
};

const staff = {
  id: "s1",
  email: "admin@example.com",
  full_name: "Demo Admin",
  role: "admin",
  created_at: "2026-10-01T10:00:00.000Z",
};

const tables: Record<string, unknown[]> = {
  tickets: [baseTicket],
  invoices: [
    {
      id: "invoice-1",
      ticket_id: "ticket-1",
      invoice_number: "INV-241041",
      labour_cents: 4500,
      parts_cents: 24900,
      subtotal_cents: 29400,
      tax_cents: 3528,
      total_cents: 32928,
      status: "paid",
      issued_at: "2026-10-27T10:00:00.000Z",
      paid_at: "2026-10-27T11:00:00.000Z",
      notes: null,
      ticket: {
        ticket_number: "PW-1041",
        status: "in_repair",
        customer: { id: "c1", full_name: "Maya Chen" },
        device: { id: "d1", brand: "Apple", model: "iPhone 15 Pro" },
      },
    },
  ],
  parts: [part],
  profiles: [staff],
  customers: [
    {
      id: "c1",
      full_name: "Maya Chen",
      email: "maya@example.com",
      phone: "415-555-0142",
      company: "Northline Studio",
      notes: null,
      created_at: "2026-10-01T10:00:00.000Z",
      updated_at: "2026-10-01T10:00:00.000Z",
      devices: [{ id: "d1", category: "phone", brand: "Apple", model: "iPhone 15 Pro" }],
      tickets: [{ id: "ticket-1", status: "in_repair" }],
    },
  ],
  devices: [
    {
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
  ],
  ticket_events: [
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
  ticket_parts: [
    { quantity: 1, unit_price_cents: 24900, part },
  ],
};

const tracked = {
  ticket_number: "PW-1041",
  status: "in_repair",
  issue: "Screen cracked after a drop.",
  created_at: "2026-10-27T10:00:00.000Z",
  updated_at: "2026-10-27T10:00:00.000Z",
  completed_at: null,
  customer_name: "Maya",
  device: { category: "phone", brand: "Apple", model: "iPhone 15 Pro" },
  events: [],
};

class Query {
  table: string;

  constructor(table: string) {
    this.table = table;
  }

  select() {
    return this;
  }
  order() {
    return this;
  }
  limit() {
    return this;
  }
  eq() {
    return this;
  }
  ilike() {
    return this;
  }
  maybeSingle() {
    return Promise.resolve({
      data: this.table === "tickets" ? detailedTicket : tables[this.table]?.[0] ?? null,
      error: null,
    });
  }
  single() {
    return this.maybeSingle();
  }
  then(resolve: (value: { data: unknown[]; error: null }) => unknown) {
    return Promise.resolve({ data: tables[this.table] ?? [], error: null }).then(resolve);
  }
}

const client = {
  from: vi.fn((table: string) => new Query(table)),
  rpc: vi.fn(() => Promise.resolve({ data: tracked, error: null })),
};

describe("repair queries", () => {
  it("aggregates the dashboard", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(client as never);
    const dashboard = await getDashboardData();
    expect(dashboard.openCount).toBe(1);
    expect(dashboard.counts.in_repair).toBe(1);
    expect(dashboard.revenueMtd).toBe(32928);
    expect(dashboard.lowStock).toHaveLength(0);
    expect(dashboard.queue).toHaveLength(1);
    expect(dashboard.teamLoad[0].open).toBe(1);
  });

  it("lists and searches tickets", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(client as never);
    expect(await getTickets({})).toHaveLength(1);
    expect(await getTickets({ search: "maya" })).toHaveLength(1);
    expect(await getTickets({ search: "zzz" })).toHaveLength(0);
  });

  it("reads a ticket detail with events and parts", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(client as never);
    const ticket = await getTicketDetail("ticket-1");
    expect(ticket?.ticket_number).toBe("PW-1041");
    expect(ticket?.events).toHaveLength(1);
    expect(ticket?.parts).toHaveLength(1);
  });

  it("reads customers, a customer detail, inventory, invoices, and staff", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(client as never);
    expect(await getCustomers()).toHaveLength(1);
    expect(await getCustomers("northline")).toHaveLength(1);
    expect(await getCustomers("zzz")).toHaveLength(0);

    const customer = await getCustomerDetail("c1");
    expect(customer?.devices).toHaveLength(1);
    expect(customer?.tickets).toHaveLength(1);

    expect(await getInventory()).toHaveLength(1);
    expect(await getInventory("iphone")).toHaveLength(1);
    expect(await getInventory("zzz")).toHaveLength(0);

    expect(await getInvoices()).toHaveLength(1);
    expect(await getStaffProfiles()).toHaveLength(1);
  });

  it("tracks a ticket through the public RPC", async () => {
    vi.mocked(createSupabaseServerClient).mockResolvedValue(client as never);
    expect(await getTrackedTicket("TRACK1041")).toMatchObject({
      ticket_number: "PW-1041",
    });
    expect(client.rpc).toHaveBeenCalledWith("track_ticket", {
      p_code: "TRACK1041",
    });
  });

  it("returns an empty dashboard for an unauthenticated prefetch", async () => {
    const denied = {
      select() {
        return this;
      },
      order() {
        return this;
      },
      limit() {
        return this;
      },
      then(resolve: (value: { data: null; error: { code: string; message: string } }) => unknown) {
        return Promise.resolve({
          data: null,
          error: { code: "42501", message: "permission denied for table tickets" },
        }).then(resolve);
      },
    };
    vi.mocked(createSupabaseServerClient).mockResolvedValue({
      from: () => denied,
      rpc: vi.fn(),
    } as never);

    const dashboard = await getDashboardData();
    expect(dashboard.openCount).toBe(0);
    expect(dashboard.queue).toEqual([]);
    expect(dashboard.teamLoad).toEqual([]);
  });
});
