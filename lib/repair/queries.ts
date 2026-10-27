import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import { isOpenStatus, openStatuses } from "./format";
import {
  TICKET_STATUSES,
  type CustomerDetail,
  type CustomerSummary,
  type DashboardData,
  type Invoice,
  type InvoiceRow,
  type Part,
  type StaffProfile,
  type TicketDetail,
  type TicketEvent,
  type TicketPart,
  type TicketRow,
  type TicketStatus,
  type TrackedTicket,
} from "./types";

const TICKET_ROW_SELECT = `
  id,
  ticket_number,
  public_code,
  status,
  priority,
  issue,
  diagnosis,
  assigned_to,
  labour_cents,
  estimate_cents,
  final_cents,
  due_at,
  completed_at,
  created_by,
  created_at,
  updated_at,
  customer_id,
  device_id,
  customer:customers(id,full_name,phone,email),
  device:devices(id,category,brand,model),
  assignee:profiles!tickets_assigned_to_fkey(id,full_name,email)
`;

function fail(message: string): never {
  throw new Error(message);
}

function permissionDenied(error: { message?: string; code?: string }) {
  return error.code === "42501" || /permission denied/i.test(error.message ?? "");
}

function emptyDashboard(): DashboardData {
  return {
    counts: Object.fromEntries(TICKET_STATUSES.map((status) => [status, 0])) as Record<
      TicketStatus,
      number
    >,
    openCount: 0,
    readyCount: 0,
    revenueMtd: 0,
    lowStock: [],
    queue: [],
    readyTickets: [],
    teamLoad: [],
  };
}

function startOfMonth() {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createSupabaseServerClient();

  const [ticketResult, invoiceResult, partResult, teamResult] = await Promise.all([
    supabase
      .from("tickets")
      .select(TICKET_ROW_SELECT)
      .order("created_at", { ascending: false })
      .limit(200),
    supabase.from("invoices").select("id,status,total_cents,paid_at"),
    supabase.from("parts").select("*").order("stock", { ascending: true }),
    supabase.from("profiles").select("id,email,full_name,role").order("full_name"),
  ]);

  if (ticketResult.error) {
    if (permissionDenied(ticketResult.error)) return emptyDashboard();
    fail(ticketResult.error.message);
  }
  if (invoiceResult.error) {
    if (permissionDenied(invoiceResult.error)) return emptyDashboard();
    fail(invoiceResult.error.message);
  }
  if (partResult.error) {
    if (permissionDenied(partResult.error)) return emptyDashboard();
    fail(partResult.error.message);
  }
  if (teamResult.error) {
    if (permissionDenied(teamResult.error)) return emptyDashboard();
    fail(teamResult.error.message);
  }

  const tickets = (ticketResult.data ?? []) as unknown as TicketRow[];
  const invoices = (invoiceResult.data ?? []) as Pick<
    Invoice,
    "id" | "status" | "total_cents" | "paid_at"
  >[];
  const parts = (partResult.data ?? []) as Part[];
  const team = (teamResult.data ?? []) as StaffProfile[];

  const counts = Object.fromEntries(TICKET_STATUSES.map((status) => [status, 0])) as Record<
    TicketStatus,
    number
  >;
  for (const ticket of tickets) {
    counts[ticket.status] = (counts[ticket.status] ?? 0) + 1;
  }

  const monthStart = startOfMonth();
  const revenueMtd = invoices
    .filter(
      (invoice) =>
        invoice.status === "paid" &&
        invoice.paid_at &&
        new Date(invoice.paid_at) >= monthStart,
    )
    .reduce((total, invoice) => total + invoice.total_cents, 0);

  const lowStock = parts.filter((part) => part.stock <= part.reorder_level);
  const openCount = openStatuses().reduce((total, status) => total + counts[status], 0);

  const teamLoad = team.map((member) => {
    const assigned = tickets.filter((ticket) => ticket.assigned_to === member.id);
    return {
      id: member.id,
      email: member.email,
      full_name: member.full_name,
      role: member.role,
      open: assigned.filter((ticket) => isOpenStatus(ticket.status)).length,
      active: assigned.filter((ticket) => ticket.status === "in_repair").length,
    };
  });

  return {
    counts,
    openCount,
    readyCount: counts.ready,
    revenueMtd,
    lowStock,
    queue: tickets.filter((ticket) => isOpenStatus(ticket.status)).slice(0, 8),
    readyTickets: tickets.filter((ticket) => ticket.status === "ready").slice(0, 4),
    teamLoad,
  };
}

export async function getTickets(filters: {
  search?: string;
  status?: string;
  priority?: string;
  assigned?: string;
}): Promise<TicketRow[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("tickets")
    .select(TICKET_ROW_SELECT)
    .order("created_at", { ascending: false })
    .limit(250);

  if (filters.status && filters.status !== "all") query = query.eq("status", filters.status);
  if (filters.priority && filters.priority !== "all") {
    query = query.eq("priority", filters.priority);
  }
  if (filters.assigned && filters.assigned !== "all") {
    query = query.eq("assigned_to", filters.assigned);
  }

  const { data, error } = await query;
  if (error) fail(error.message);

  const rows = (data ?? []) as unknown as TicketRow[];
  const search = filters.search?.trim().toLowerCase();
  if (!search) return rows;

  return rows.filter((ticket) =>
    [
      ticket.ticket_number,
      ticket.public_code,
      ticket.issue,
      ticket.customer.full_name,
      ticket.customer.phone,
      ticket.customer.email,
      ticket.device.brand,
      ticket.device.model,
      ticket.assignee?.full_name,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(search)),
  );
}

export async function getTicketDetail(id: string): Promise<TicketDetail | null> {
  const supabase = await createSupabaseServerClient();

  const { data: ticket, error } = await supabase
    .from("tickets")
    .select(
      `
      *,
      customer:customers(*),
      device:devices(*),
      assignee:profiles!tickets_assigned_to_fkey(id,full_name,email),
      invoice:invoices(*)
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) fail(error.message);
  if (!ticket) return null;

  const [eventResult, partResult] = await Promise.all([
    supabase
      .from("ticket_events")
      .select(
        "id,ticket_id,actor_id,kind,status,body,is_customer_visible,created_at,actor:profiles!ticket_events_actor_id_fkey(id,full_name,email)",
      )
      .eq("ticket_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("ticket_parts")
      .select("quantity,unit_price_cents,part:parts(id,sku,name,category,stock,price_cents)")
      .eq("ticket_id", id),
  ]);

  if (eventResult.error) fail(eventResult.error.message);
  if (partResult.error) fail(partResult.error.message);

  const record = ticket as unknown as Omit<TicketDetail, "events" | "parts"> & {
    invoice: Invoice | Invoice[] | null;
  };

  return {
    ...record,
    invoice: Array.isArray(record.invoice) ? record.invoice[0] ?? null : record.invoice,
    events: (eventResult.data ?? []) as unknown as TicketEvent[],
    parts: (partResult.data ?? []) as unknown as TicketPart[],
  };
}

export async function getCustomers(search?: string): Promise<CustomerSummary[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("customers")
    .select("*, devices(id,category,brand,model), tickets(id,status)")
    .order("created_at", { ascending: false })
    .limit(250);

  if (error) fail(error.message);

  const term = search?.trim().toLowerCase();
  return ((data ?? []) as unknown as Array<
    CustomerSummary & { tickets: Array<{ id: string; status: TicketStatus }> }
  >)
    .map((customer) => {
      const tickets = customer.tickets ?? [];
      return {
        ...customer,
        device_count: customer.devices?.length ?? 0,
        ticket_count: tickets.length,
        open_count: tickets.filter((ticket) => isOpenStatus(ticket.status)).length,
      };
    })
    .filter((customer) => {
      if (!term) return true;
      return [customer.full_name, customer.email, customer.phone, customer.company]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });
}

export async function getCustomerDetail(id: string): Promise<CustomerDetail | null> {
  const supabase = await createSupabaseServerClient();

  const [customerResult, ticketResult] = await Promise.all([
    supabase.from("customers").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("tickets")
      .select(TICKET_ROW_SELECT)
      .eq("customer_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (customerResult.error) fail(customerResult.error.message);
  if (ticketResult.error) fail(ticketResult.error.message);
  if (!customerResult.data) return null;

  const devicesResult = await supabase
    .from("devices")
    .select("*")
    .eq("customer_id", id)
    .order("created_at", { ascending: false });

  if (devicesResult.error) fail(devicesResult.error.message);

  return {
    ...(customerResult.data as CustomerDetail),
    devices: devicesResult.data ?? [],
    tickets: (ticketResult.data ?? []) as unknown as TicketRow[],
  };
}

export async function getInventory(search?: string): Promise<Part[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("parts")
    .select("*")
    .order("stock", { ascending: true })
    .order("name");

  if (error) fail(error.message);
  const term = search?.trim().toLowerCase();
  const parts = (data ?? []) as Part[];
  if (!term) return parts;

  return parts.filter((part) =>
    [part.name, part.sku, part.category, part.supplier]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(term)),
  );
}

export async function getInvoices(): Promise<InvoiceRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("invoices")
    .select(
      "*, ticket:tickets(ticket_number,status,customer:customers(id,full_name),device:devices(id,brand,model))",
    )
    .order("issued_at", { ascending: false })
    .limit(250);

  if (error) fail(error.message);
  return (data ?? []) as unknown as InvoiceRow[];
}

export async function getStaffProfiles(): Promise<StaffProfile[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id,email,full_name,role,created_at")
    .order("full_name");

  if (error) fail(error.message);
  return (data ?? []) as StaffProfile[];
}

export type CustomerOption = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string;
  devices: Array<{
    id: string;
    category: string;
    brand: string;
    model: string;
  }>;
};

export async function getCustomerOptions(): Promise<CustomerOption[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("customers")
    .select("id,full_name,email,phone,devices(id,category,brand,model)")
    .order("full_name");

  if (error) fail(error.message);
  return (data ?? []) as CustomerOption[];
}

export const getTrackedTicket = cache(
  async (code: string, contact: string): Promise<TrackedTicket | null> => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("track_ticket", {
      p_code: code,
      p_contact: contact,
    });

    if (error) fail(error.message);
    return (data as TrackedTicket | null) ?? null;
  },
);
