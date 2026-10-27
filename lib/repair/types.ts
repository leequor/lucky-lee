import type { AppRole } from "@/lib/auth/types";

export const TICKET_STATUSES = [
  "intake",
  "diagnosing",
  "waiting_parts",
  "in_repair",
  "ready",
  "picked_up",
  "cancelled",
] as const;

export type TicketStatus = (typeof TICKET_STATUSES)[number];

export const TICKET_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

export const INVOICE_STATUSES = ["draft", "sent", "paid", "void"] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export const DEVICE_CATEGORIES = [
  "phone",
  "laptop",
  "tablet",
  "console",
  "camera",
  "other",
] as const;
export type DeviceCategory = (typeof DEVICE_CATEGORIES)[number];

export type StaffProfile = {
  id: string;
  email: string;
  full_name: string | null;
  role: AppRole;
  created_at?: string | null;
};

export type Customer = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string;
  company: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Device = {
  id: string;
  customer_id: string;
  category: DeviceCategory;
  brand: string;
  model: string;
  serial: string | null;
  color: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Ticket = {
  id: string;
  ticket_number: string;
  public_code: string;
  customer_id: string;
  device_id: string;
  status: TicketStatus;
  priority: TicketPriority;
  issue: string;
  diagnosis: string | null;
  assigned_to: string | null;
  labour_cents: number;
  estimate_cents: number;
  final_cents: number | null;
  due_at: string | null;
  completed_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type TicketRow = Ticket & {
  customer: Pick<Customer, "id" | "full_name" | "phone" | "email">;
  device: Pick<Device, "id" | "category" | "brand" | "model">;
  assignee: Pick<StaffProfile, "id" | "full_name" | "email"> | null;
};

export type TicketEvent = {
  id: string;
  ticket_id: string;
  actor_id: string | null;
  kind: string;
  status: TicketStatus | null;
  body: string | null;
  is_customer_visible: boolean;
  created_at: string;
  actor: Pick<StaffProfile, "id" | "full_name" | "email"> | null;
};

export type Part = {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  reorder_level: number;
  cost_cents: number;
  price_cents: number;
  supplier: string | null;
  created_at: string;
  updated_at: string;
};

export type TicketPart = {
  quantity: number;
  unit_price_cents: number;
  part: Pick<Part, "id" | "sku" | "name" | "category" | "stock" | "price_cents">;
};

export type Invoice = {
  id: string;
  ticket_id: string;
  invoice_number: string;
  labour_cents: number;
  parts_cents: number;
  subtotal_cents: number;
  tax_cents: number;
  total_cents: number;
  status: InvoiceStatus;
  issued_at: string;
  paid_at: string | null;
  notes: string | null;
};

export type TicketDetail = Ticket & {
  customer: Customer;
  device: Device;
  assignee: Pick<StaffProfile, "id" | "full_name" | "email"> | null;
  invoice: Invoice | null;
  events: TicketEvent[];
  parts: TicketPart[];
};

export type CustomerSummary = Customer & {
  device_count: number;
  ticket_count: number;
  open_count: number;
  devices: Device[];
};

export type CustomerDetail = Customer & {
  devices: Device[];
  tickets: TicketRow[];
};

export type InvoiceRow = Invoice & {
  ticket: {
    ticket_number: string;
    status: TicketStatus;
    customer: Pick<Customer, "id" | "full_name">;
    device: Pick<Device, "id" | "brand" | "model">;
  };
};

export type DashboardData = {
  counts: Record<TicketStatus, number>;
  openCount: number;
  readyCount: number;
  revenueMtd: number;
  lowStock: Part[];
  queue: TicketRow[];
  readyTickets: TicketRow[];
  teamLoad: Array<Pick<StaffProfile, "id" | "full_name" | "email" | "role"> & { open: number; active: number }>;
};

export type TrackedTicket = {
  ticket_number: string;
  status: TicketStatus;
  issue: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  customer_name: string;
  device: {
    category: DeviceCategory;
    brand: string;
    model: string;
  };
  events: Array<{
    status: TicketStatus | null;
    body: string | null;
    created_at: string;
  }>;
};

export type RepairActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export const initialRepairActionState: RepairActionState = {
  status: "idle",
};
