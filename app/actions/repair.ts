"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

import { requireAdmin, requireStaff } from "@/lib/repair/session";
import {
  isDeviceCategory,
  isTicketPriority,
  isTicketStatus,
  parseMoneyToCents,
  readOptionalString,
  readString,
  validateEmailAddress,
  validatePhone,
} from "@/lib/repair/validation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function messageUrl(path: string, key: "error" | "notice", message: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${key}=${encodeURIComponent(message)}`;
}

function failTo(path: string, message: string): never {
  redirect(messageUrl(path, "error", message));
}

async function client() {
  return createSupabaseServerClient();
}

export async function createCustomerAction(formData: FormData) {
  await requireStaff();
  const fullName = readString(formData, "fullName");
  const phone = readString(formData, "phone");
  const email = readString(formData, "email");
  const company = readOptionalString(formData, "company");
  const notes = readOptionalString(formData, "notes");

  if (!fullName) failTo("/customers/new", "Customer name is required.");
  const phoneError = validatePhone(phone);
  if (phoneError) failTo("/customers/new", phoneError);
  if (email) {
    const emailError = validateEmailAddress(email);
    if (emailError) failTo("/customers/new", emailError);
  }

  const supabase = await client();
  const { data, error } = await supabase
    .from("customers")
    .insert({
      full_name: fullName,
      phone,
      email: email || null,
      company,
      notes,
    })
    .select("id")
    .single();

  if (error) failTo("/customers/new", error.message);

  revalidatePath("/customers");
  redirect(`/customers/${data.id}?notice=${encodeURIComponent("Customer added.")}`);
}

export async function addDeviceAction(formData: FormData) {
  await requireStaff();
  const customerId = readString(formData, "customer_id");
  const category = readString(formData, "category");
  const brand = readString(formData, "brand");
  const model = readString(formData, "model");
  const serial = readOptionalString(formData, "serial");
  const color = readOptionalString(formData, "color");

  if (!customerId) failTo("/customers", "Customer is required.");
  if (!isDeviceCategory(category)) failTo(`/customers/${customerId}`, "Choose a device type.");
  if (!brand || !model) failTo(`/customers/${customerId}`, "Brand and model are required.");

  const supabase = await client();
  const { error } = await supabase.from("devices").insert({
    customer_id: customerId,
    category,
    brand,
    model,
    serial,
    color,
  });

  if (error) failTo(`/customers/${customerId}`, error.message);

  revalidatePath(`/customers/${customerId}`);
  revalidatePath("/customers");
  redirect(messageUrl(`/customers/${customerId}`, "notice", "Device added."));
}

export async function createTicketAction(formData: FormData) {
  const staff = await requireStaff();
  const mode = readString(formData, "customer_mode") || "existing";
  const issue = readString(formData, "issue");
  const priority = readString(formData, "priority") || "normal";
  const estimate = parseMoneyToCents(readString(formData, "estimate"));
  const labour = parseMoneyToCents(readString(formData, "labour"));
  const dueAt = readOptionalString(formData, "due_at");
  const assignedTo = readOptionalString(formData, "assigned_to");

  if (!issue) failTo("/tickets/new", "Describe the problem before creating the ticket.");
  if (!isTicketPriority(priority)) failTo("/tickets/new", "Choose a valid priority.");
  if (estimate === null) failTo("/tickets/new", "Estimate must be a positive amount.");
  if (labour === null) failTo("/tickets/new", "Labour must be a positive amount.");

  const supabase = await client();
  let customerId = readString(formData, "customer_id");
  let deviceId = readString(formData, "device_id");

  if (mode === "new") {
    const fullName = readString(formData, "new_customer_name");
    const phone = readString(formData, "new_customer_phone");
    const email = readString(formData, "new_customer_email");
    const category = readString(formData, "new_device_category");
    const brand = readString(formData, "new_device_brand");
    const model = readString(formData, "new_device_model");
    const serial = readOptionalString(formData, "new_device_serial");

    if (!fullName) failTo("/tickets/new?mode=new", "Customer name is required.");
    const phoneError = validatePhone(phone);
    if (phoneError) failTo("/tickets/new?mode=new", phoneError);
    if (email) {
      const emailError = validateEmailAddress(email);
      if (emailError) failTo("/tickets/new?mode=new", emailError);
    }
    if (!isDeviceCategory(category)) failTo("/tickets/new?mode=new", "Choose a device type.");
    if (!brand || !model) failTo("/tickets/new?mode=new", "Device brand and model are required.");

    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .insert({ full_name: fullName, phone, email: email || null })
      .select("id")
      .single();
    if (customerError) failTo("/tickets/new?mode=new", customerError.message);
    customerId = customer.id;

    const { data: device, error: deviceError } = await supabase
      .from("devices")
      .insert({ customer_id: customerId, category, brand, model, serial })
      .select("id")
      .single();
    if (deviceError) failTo("/tickets/new?mode=new", deviceError.message);
    deviceId = device.id;
  } else {
    if (!customerId || !deviceId) {
      failTo("/tickets/new", "Choose a customer and device.");
    }

    const { data: device } = await supabase
      .from("devices")
      .select("customer_id")
      .eq("id", deviceId)
      .maybeSingle();

    if (!device || device.customer_id !== customerId) {
      failTo("/tickets/new", "That device does not belong to the selected customer.");
    }
  }

  const { data: ticket, error } = await supabase
    .from("tickets")
    .insert({
      customer_id: customerId,
      device_id: deviceId,
      issue,
      priority,
      estimate_cents: estimate,
      labour_cents: labour,
      due_at: dueAt || null,
      assigned_to: assignedTo || null,
      created_by: staff.id,
      status: "intake",
    })
    .select("id")
    .single();

  if (error) failTo("/tickets/new", error.message);

  await supabase.from("ticket_events").insert({
    ticket_id: ticket.id,
    actor_id: staff.id,
    kind: "status",
    status: "intake",
    body: "Ticket created and logged at intake.",
    is_customer_visible: true,
  });

  revalidatePath("/");
  revalidatePath("/tickets");
  redirect(`/tickets/${ticket.id}?notice=${encodeURIComponent("Ticket created.")}`);
}

export async function updateTicketDetailsAction(formData: FormData) {
  const staff = await requireStaff();
  const ticketId = readString(formData, "ticket_id");
  const diagnosis = readOptionalString(formData, "diagnosis");
  const priority = readString(formData, "priority");
  const assignedTo = readOptionalString(formData, "assigned_to");
  const estimate = parseMoneyToCents(readString(formData, "estimate"));
  const labour = parseMoneyToCents(readString(formData, "labour"));
  const dueAt = readOptionalString(formData, "due_at");

  if (!ticketId) failTo("/tickets", "Ticket is required.");
  if (!isTicketPriority(priority)) failTo(`/tickets/${ticketId}`, "Choose a valid priority.");
  if (estimate === null || labour === null) {
    failTo(`/tickets/${ticketId}`, "Amounts must be positive.");
  }

  const supabase = await client();
  const { error } = await supabase
    .from("tickets")
    .update({
      diagnosis,
      priority,
      assigned_to: assignedTo || null,
      estimate_cents: estimate,
      labour_cents: labour,
      due_at: dueAt || null,
    })
    .eq("id", ticketId);

  if (error) failTo(`/tickets/${ticketId}`, error.message);

  await supabase.from("ticket_events").insert({
    ticket_id: ticketId,
    actor_id: staff.id,
    kind: "note",
    body: "Ticket details updated.",
    is_customer_visible: false,
  });

  revalidatePath(`/tickets/${ticketId}`);
  revalidatePath("/tickets");
  redirect(messageUrl(`/tickets/${ticketId}`, "notice", "Ticket updated."));
}

export async function updateTicketStatusAction(formData: FormData) {
  const staff = await requireStaff();
  const ticketId = readString(formData, "ticket_id");
  const status = readString(formData, "status");
  const note = readOptionalString(formData, "note");

  if (!ticketId) failTo("/tickets", "Ticket is required.");
  if (!isTicketStatus(status)) failTo(`/tickets/${ticketId}`, "Choose a valid status.");

  const supabase = await client();
  const { error } = await supabase
    .from("tickets")
    .update({
      status,
      completed_at:
        status === "ready" || status === "picked_up" || status === "cancelled"
          ? new Date().toISOString()
          : null,
    })
    .eq("id", ticketId);

  if (error) failTo(`/tickets/${ticketId}`, error.message);

  await supabase.from("ticket_events").insert({
    ticket_id: ticketId,
    actor_id: staff.id,
    kind: "status",
    status,
    body: note || `Status moved to ${status.replaceAll("_", " ")}.`,
    is_customer_visible: true,
  });

  revalidatePath(`/tickets/${ticketId}`);
  revalidatePath("/tickets");
  revalidatePath("/");
  redirect(messageUrl(`/tickets/${ticketId}`, "notice", "Status updated."));
}

export async function addTicketNoteAction(formData: FormData) {
  const staff = await requireStaff();
  const ticketId = readString(formData, "ticket_id");
  const body = readString(formData, "body");
  const visible = formData.get("customer_visible") === "on";

  if (!ticketId) failTo("/tickets", "Ticket is required.");
  if (!body) failTo(`/tickets/${ticketId}`, "Write a note first.");

  const supabase = await client();
  const { error } = await supabase.from("ticket_events").insert({
    ticket_id: ticketId,
    actor_id: staff.id,
    kind: "note",
    body,
    is_customer_visible: visible,
  });

  if (error) failTo(`/tickets/${ticketId}`, error.message);
  revalidatePath(`/tickets/${ticketId}`);
  redirect(messageUrl(`/tickets/${ticketId}`, "notice", "Note added."));
}

export async function addTicketPartAction(formData: FormData) {
  await requireStaff();
  const ticketId = readString(formData, "ticket_id");
  const partId = readString(formData, "part_id");
  const quantity = Number(readString(formData, "quantity") || "1");

  if (!ticketId || !partId) failTo(`/tickets/${ticketId || ""}`, "Choose a part.");
  if (!Number.isInteger(quantity) || quantity < 1) {
    failTo(`/tickets/${ticketId}`, "Quantity must be at least 1.");
  }

  const supabase = await client();
  const { error } = await supabase.rpc("add_ticket_part", {
    p_ticket_id: ticketId,
    p_part_id: partId,
    p_quantity: quantity,
  });

  if (error) failTo(`/tickets/${ticketId}`, error.message);

  revalidatePath(`/tickets/${ticketId}`);
  revalidatePath("/inventory");
  redirect(messageUrl(`/tickets/${ticketId}`, "notice", "Part added to the ticket."));
}

export async function createInvoiceAction(formData: FormData) {
  await requireStaff();
  const ticketId = readString(formData, "ticket_id");
  if (!ticketId) failTo("/tickets", "Ticket is required.");

  const supabase = await client();
  const { error } = await supabase.rpc("create_ticket_invoice", { p_ticket_id: ticketId });
  if (error) failTo(`/tickets/${ticketId}`, error.message);

  revalidatePath(`/tickets/${ticketId}`);
  revalidatePath("/invoices");
  redirect(messageUrl(`/tickets/${ticketId}`, "notice", "Invoice created."));
}

export async function markInvoicePaidAction(formData: FormData) {
  await requireStaff();
  const invoiceId = readString(formData, "invoice_id");
  const returnTo = readString(formData, "return_to") || "/invoices";

  if (!invoiceId) failTo(returnTo, "Invoice is required.");

  const supabase = await client();
  const { error } = await supabase.rpc("mark_invoice_paid", { p_invoice_id: invoiceId });
  if (error) failTo(returnTo, error.message);

  revalidatePath("/invoices");
  revalidatePath("/");
  redirect(messageUrl(returnTo, "notice", "Payment recorded."));
}

export async function addPartAction(formData: FormData) {
  await requireStaff();
  const sku = readString(formData, "sku").toUpperCase();
  const name = readString(formData, "name");
  const category = readString(formData, "category") || "general";
  const supplier = readOptionalString(formData, "supplier");
  const stock = Number(readString(formData, "stock") || "0");
  const reorderLevel = Number(readString(formData, "reorder_level") || "2");
  const cost = parseMoneyToCents(readString(formData, "cost"));
  const price = parseMoneyToCents(readString(formData, "price"));

  if (!sku || !name) failTo("/inventory?new=1", "SKU and part name are required.");
  if (!Number.isInteger(stock) || stock < 0) failTo("/inventory?new=1", "Stock must be a whole number.");
  if (!Number.isInteger(reorderLevel) || reorderLevel < 0) {
    failTo("/inventory?new=1", "Reorder level must be a whole number.");
  }
  if (cost === null || price === null) failTo("/inventory?new=1", "Cost and price must be positive.");

  const supabase = await client();
  const { error } = await supabase.from("parts").insert({
    sku,
    name,
    category,
    supplier,
    stock,
    reorder_level: reorderLevel,
    cost_cents: cost,
    price_cents: price,
  });

  if (error) failTo("/inventory?new=1", error.message);

  revalidatePath("/inventory");
  redirect(messageUrl("/inventory", "notice", "Part added to inventory."));
}

export async function adjustStockAction(formData: FormData) {
  await requireStaff();
  const partId = readString(formData, "part_id");
  const delta = Number(readString(formData, "delta") || "0");
  if (!partId || !Number.isInteger(delta) || delta === 0) {
    failTo("/inventory", "Stock adjustment is invalid.");
  }

  const supabase = await client();
  const { data: part, error: readError } = await supabase
    .from("parts")
    .select("stock")
    .eq("id", partId)
    .single();

  if (readError) failTo("/inventory", readError.message);

  const nextStock = Math.max(0, part.stock + delta);
  const { error } = await supabase.from("parts").update({ stock: nextStock }).eq("id", partId);
  if (error) failTo("/inventory", error.message);

  revalidatePath("/inventory");
  redirect(messageUrl("/inventory", "notice", "Stock updated."));
}

export async function updateRoleAction(formData: FormData) {
  await requireAdmin();
  const profileId = readString(formData, "profile_id");
  const role = readString(formData, "role");
  if (!profileId || !["superadmin", "admin", "user"].includes(role)) {
    failTo("/team", "Choose a valid role.");
  }

  const supabase = await client();
  const { error } = await supabase.from("profiles").update({ role }).eq("id", profileId);
  if (error) failTo("/team", error.message);

  revalidatePath("/team");
  redirect(messageUrl("/team", "notice", "Role updated."));
}

export async function inviteStaffAction(formData: FormData) {
  await requireAdmin();
  const fullName = readString(formData, "full_name");
  const email = readString(formData, "email").toLowerCase();
  const password = readString(formData, "password");
  const role = readString(formData, "role");

  if (!fullName) failTo("/team", "Staff name is required.");
  const emailError = validateEmailAddress(email);
  if (emailError) failTo("/team", emailError);
  if (password.length < 8) failTo("/team", "Temporary password must be at least 8 characters.");
  if (!["superadmin", "admin", "user"].includes(role)) failTo("/team", "Choose a valid role.");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceRoleKey) {
    failTo("/team", "SUPABASE_SERVICE_ROLE_KEY is not configured on this deployment.");
  }

  const admin = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role },
  });

  if (error) failTo("/team", error.message);
  if (!data.user) failTo("/team", "Supabase did not return the new staff user.");

  const { error: profileError } = await admin.from("profiles").upsert({
    id: data.user.id,
    email,
    full_name: fullName,
    role,
  });

  if (profileError) failTo("/team", profileError.message);

  revalidatePath("/team");
  redirect(messageUrl("/team", "notice", `${fullName} can now sign in with the temporary password.`));
}
