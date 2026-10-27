#!/usr/bin/env node
import { existsSync } from "node:fs";
import process from "node:process";

import { createClient } from "@supabase/supabase-js";

for (const file of [".env.local", ".env"]) {
  if (existsSync(file)) {
    process.loadEnvFile(file);
    break;
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !serviceRoleKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { count, error: countError } = await supabase
  .from("customers")
  .select("id", { count: "exact", head: true });

if (countError) {
  console.error(`Unable to read customers: ${countError.message}`);
  process.exit(1);
}

if ((count ?? 0) > 0) {
  console.log("Repair data already present. Skipping seed.");
  process.exit(0);
}

const { data: profiles, error: profileError } = await supabase
  .from("profiles")
  .select("id,email");

if (profileError) {
  console.error(`Unable to read profiles: ${profileError.message}`);
  process.exit(1);
}

const staff = new Map((profiles ?? []).map((profile) => [profile.email, profile.id]));
const owner = staff.get("alex@luckypatcher.test") ?? profiles?.[0]?.id ?? null;
const manager = staff.get("admin@luckypatcher.test") ?? owner;
const tech = staff.get("user@luckypatcher.test") ?? manager;

const daysAgo = (days) => new Date(Date.now() - days * 86400000).toISOString();
const daysAhead = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const customers = [
  { full_name: "Maya Chen", email: "maya.chen@example.com", phone: "415-555-0142", company: "Northline Studio" },
  { full_name: "Daniel Ortiz", email: "daniel.ortiz@example.com", phone: "415-555-0188", company: null },
  { full_name: "Priya Raman", email: "priya.raman@example.com", phone: "510-555-0119", company: "Raman Dental" },
  { full_name: "Theo Brooks", email: "theo.brooks@example.com", phone: "415-555-0127", company: null },
  { full_name: "Sofia Alvarez", email: "sofia.alvarez@example.com", phone: "650-555-0193", company: null },
  { full_name: "Marcus Lee", email: "marcus.lee@example.com", phone: "415-555-0175", company: "Fieldnote Co." },
  { full_name: "Elena Petrova", email: "elena.petrova@example.com", phone: "408-555-0134", company: null },
  { full_name: "Noah Williams", email: "noah.williams@example.com", phone: "415-555-0166", company: null },
  { full_name: "Aisha Khan", email: "aisha.khan@example.com", phone: "510-555-0148", company: null },
  { full_name: "Ben Carter", email: "ben.carter@example.com", phone: "415-555-0199", company: "Carter Audio" },
];

const { data: insertedCustomers, error: customerError } = await supabase
  .from("customers")
  .insert(customers)
  .select("id,email");

if (customerError) {
  console.error(`Unable to seed customers: ${customerError.message}`);
  process.exit(1);
}

const customerId = new Map(insertedCustomers.map((customer) => [customer.email, customer.id]));

const deviceRows = [
  { email: "maya.chen@example.com", category: "phone", brand: "Apple", model: "iPhone 15 Pro", serial: "F2LX9A1P3K", color: "Natural titanium" },
  { email: "daniel.ortiz@example.com", category: "laptop", brand: "Apple", model: "MacBook Air M2", serial: "C02Z41YJMD6M", color: "Midnight" },
  { email: "priya.raman@example.com", category: "tablet", brand: "Apple", model: "iPad Pro 11", serial: "DMPX2K8QFK", color: "Space grey" },
  { email: "theo.brooks@example.com", category: "console", brand: "Sony", model: "PlayStation 5", serial: "PS5-2048-A", color: "White" },
  { email: "sofia.alvarez@example.com", category: "phone", brand: "Google", model: "Pixel 8", serial: "8B1A2C3D", color: "Obsidian" },
  { email: "marcus.lee@example.com", category: "laptop", brand: "Dell", model: "XPS 13 Plus", serial: "DXPS-7712", color: "Platinum" },
  { email: "elena.petrova@example.com", category: "camera", brand: "Canon", model: "EOS R6", serial: "CNR6-4401", color: "Black" },
  { email: "noah.williams@example.com", category: "phone", brand: "Apple", model: "iPhone 13", serial: "G7K2P9LQ1", color: "Blue" },
  { email: "aisha.khan@example.com", category: "phone", brand: "Samsung", model: "Galaxy S24", serial: "SM-S921-77", color: "Violet" },
  { email: "ben.carter@example.com", category: "laptop", brand: "Apple", model: "MacBook Pro 14", serial: "C02XK2YJMD6M", color: "Space black" },
];

const { data: insertedDevices, error: deviceError } = await supabase
  .from("devices")
  .insert(
    deviceRows.map((device) => ({
      customer_id: customerId.get(device.email),
      category: device.category,
      brand: device.brand,
      model: device.model,
      serial: device.serial,
      color: device.color,
    })),
  )
  .select("id,model,customer_id");

if (deviceError) {
  console.error(`Unable to seed devices: ${deviceError.message}`);
  process.exit(1);
}

const deviceByModel = new Map(insertedDevices.map((device) => [device.model, device.id]));

const partRows = [
  { sku: "SCR-IP15-OEM", name: "iPhone 15 OLED assembly", category: "screen", stock: 4, reorder_level: 3, cost_cents: 12900, price_cents: 24900, supplier: "MobileParts Co." },
  { sku: "BAT-IP15", name: "iPhone 15 battery", category: "battery", stock: 7, reorder_level: 4, cost_cents: 3200, price_cents: 7900, supplier: "MobileParts Co." },
  { sku: "BAT-MBA-M2", name: "MacBook Air M2 battery", category: "battery", stock: 2, reorder_level: 3, cost_cents: 5900, price_cents: 14900, supplier: "Northstar Cells" },
  { sku: "SSD-NVME-1TB", name: "1 TB NVMe SSD", category: "storage", stock: 1, reorder_level: 3, cost_cents: 6100, price_cents: 12900, supplier: "Northstar Cells" },
  { sku: "PORT-USBC", name: "USB-C charge port", category: "charging", stock: 3, reorder_level: 5, cost_cents: 1200, price_cents: 4500, supplier: "MobileParts Co." },
  { sku: "FAN-PS5", name: "PlayStation 5 fan assembly", category: "cooling", stock: 2, reorder_level: 2, cost_cents: 2800, price_cents: 6900, supplier: "ConsoleWorks" },
  { sku: "THERM-PS5", name: "PS5 thermal paste kit", category: "cooling", stock: 6, reorder_level: 2, cost_cents: 700, price_cents: 2400, supplier: "ConsoleWorks" },
  { sku: "CAM-P8", name: "Pixel 8 rear camera module", category: "camera", stock: 1, reorder_level: 2, cost_cents: 4300, price_cents: 9900, supplier: "MobileParts Co." },
  { sku: "KEY-MBP", name: "MacBook Pro keyboard deck", category: "keyboard", stock: 2, reorder_level: 2, cost_cents: 8400, price_cents: 18900, supplier: "Northstar Cells" },
  { sku: "SCR-XPS-OLED", name: "Dell XPS 13 OLED panel", category: "screen", stock: 0, reorder_level: 1, cost_cents: 15400, price_cents: 29900, supplier: "Panel House" },
  { sku: "ADH-IP15", name: "iPhone 15 adhesive gasket", category: "supplies", stock: 12, reorder_level: 6, cost_cents: 300, price_cents: 900, supplier: "MobileParts Co." },
  { sku: "SCREW-KIT", name: "Precision screw kit", category: "supplies", stock: 3, reorder_level: 8, cost_cents: 400, price_cents: 1200, supplier: "Bench Supply" },
];

const { data: insertedParts, error: partError } = await supabase
  .from("parts")
  .insert(partRows)
  .select("id,sku,price_cents");

if (partError) {
  console.error(`Unable to seed parts: ${partError.message}`);
  process.exit(1);
}

const partBySku = new Map(insertedParts.map((part) => [part.sku, part]));

const tickets = [
  {
    number: "PW-1041",
    code: "TRACK1041",
    customer: "maya.chen@example.com",
    device: "iPhone 15 Pro",
    status: "in_repair",
    priority: "high",
    issue: "Screen cracked after a drop; touch works intermittently near the top edge.",
    diagnosis: "OLED assembly damaged. Frame is straight; replacement screen and adhesive required.",
    assignee: manager,
    labour: 4500,
    estimate: 32000,
    created: 1,
    due: 2,
    parts: [["SCR-IP15-OEM", 1], ["ADH-IP15", 1]],
  },
  {
    number: "PW-1042",
    code: "TRACK1042",
    customer: "daniel.ortiz@example.com",
    device: "MacBook Air M2",
    status: "waiting_parts",
    priority: "normal",
    issue: "Battery drains in under two hours and the bottom case is swelling.",
    diagnosis: "Battery health at 63%. Replacement battery ordered from Northstar Cells.",
    assignee: tech,
    labour: 3500,
    estimate: 18000,
    created: 2,
    due: 3,
    parts: [["BAT-MBA-M2", 1]],
  },
  {
    number: "PW-1043",
    code: "TRACK1043",
    customer: "priya.raman@example.com",
    device: "iPad Pro 11",
    status: "diagnosing",
    priority: "high",
    issue: "Will not charge past 12%. Tried two cables and a different charger.",
    diagnosis: null,
    assignee: manager,
    labour: 3000,
    estimate: 12000,
    created: 1,
    due: 1,
    parts: [],
  },
  {
    number: "PW-1044",
    code: "TRACK1044",
    customer: "theo.brooks@example.com",
    device: "PlayStation 5",
    status: "intake",
    priority: "normal",
    issue: "Fans get very loud after ten minutes and the console shuts down.",
    diagnosis: null,
    assignee: null,
    labour: 4000,
    estimate: 9000,
    created: 0,
    due: 4,
    parts: [],
  },
  {
    number: "PW-1045",
    code: "TRACK1045",
    customer: "sofia.alvarez@example.com",
    device: "Pixel 8",
    status: "in_repair",
    priority: "high",
    issue: "Rear camera is black in every app. Front camera is fine.",
    diagnosis: "Rear camera module failure. Module replaced and calibration test running.",
    assignee: tech,
    labour: 3500,
    estimate: 13500,
    created: 2,
    due: 1,
    parts: [["CAM-P8", 1]],
  },
  {
    number: "PW-1046",
    code: "TRACK1046",
    customer: "marcus.lee@example.com",
    device: "XPS 13 Plus",
    status: "waiting_parts",
    priority: "normal",
    issue: "Screen flickers at 60 Hz and the left side has a purple band.",
    diagnosis: "OLED panel failure. Panel House shipment expected Thursday.",
    assignee: manager,
    labour: 5000,
    estimate: 34900,
    created: 3,
    due: 5,
    parts: [],
  },
  {
    number: "PW-1047",
    code: "TRACK1047",
    customer: "elena.petrova@example.com",
    device: "EOS R6",
    status: "ready",
    priority: "low",
    issue: "Sensor has visible dust spots at f/8 and above.",
    diagnosis: "Sensor cleaned and mirrorless calibration checked. Ready for pickup.",
    assignee: tech,
    labour: 6500,
    estimate: 6500,
    created: 4,
    due: 0,
    parts: [],
    invoice: { status: "sent" },
  },
  {
    number: "PW-1048",
    code: "TRACK1048",
    customer: "noah.williams@example.com",
    device: "iPhone 13",
    status: "ready",
    priority: "normal",
    issue: "Battery service warning and random shutdowns below 30%.",
    diagnosis: "Battery replaced. Charge cycle test passed.",
    assignee: manager,
    labour: 2500,
    estimate: 10500,
    created: 5,
    due: 0,
    parts: [["BAT-IP15", 1]],
    invoice: { status: "sent" },
  },
  {
    number: "PW-1049",
    code: "TRACK1049",
    customer: "aisha.khan@example.com",
    device: "Galaxy S24",
    status: "picked_up",
    priority: "normal",
    issue: "USB-C cable falls out and charging only works at an angle.",
    diagnosis: "Charge port replaced. Fast charging verified at 25 W.",
    assignee: tech,
    labour: 2500,
    estimate: 7000,
    created: 7,
    due: 0,
    parts: [["PORT-USBC", 1], ["SCREW-KIT", 1]],
    invoice: { status: "paid", paidDaysAgo: 3 },
  },
  {
    number: "PW-1050",
    code: "TRACK1050",
    customer: "ben.carter@example.com",
    device: "MacBook Pro 14",
    status: "picked_up",
    priority: "high",
    issue: "Several keys stopped responding after a coffee spill.",
    diagnosis: "Keyboard deck replaced. Logic board cleaned and tested.",
    assignee: manager,
    labour: 6500,
    estimate: 25400,
    created: 9,
    due: 0,
    parts: [["KEY-MBP", 1]],
    invoice: { status: "paid", paidDaysAgo: 5 },
  },
  {
    number: "PW-1051",
    code: "TRACK1051",
    customer: "maya.chen@example.com",
    device: "iPhone 15 Pro",
    status: "cancelled",
    priority: "low",
    issue: "Customer asked for a camera lens inspection after the screen repair.",
    diagnosis: "Lens is clean. Customer declined further work.",
    assignee: manager,
    labour: 0,
    estimate: 0,
    created: 6,
    due: 0,
    parts: [],
  },
  {
    number: "PW-1052",
    code: "TRACK1052",
    customer: "daniel.ortiz@example.com",
    device: "MacBook Air M2",
    status: "diagnosing",
    priority: "normal",
    issue: "Needs a larger drive for editing work; currently runs out of space.",
    diagnosis: null,
    assignee: tech,
    labour: 4000,
    estimate: 16900,
    created: 1,
    due: 4,
    parts: [],
  },
];

const seedTicket = async (ticket) => {
  const parts = ticket.parts.map(([sku, quantity]) => {
    const part = partBySku.get(sku);
    return { part_id: part.id, quantity, unit_price_cents: part.price_cents };
  });
  const partsTotal = parts.reduce(
    (total, part) => total + part.quantity * part.unit_price_cents,
    0,
  );
  const subtotal = ticket.labour + partsTotal;
  const tax = Math.round(subtotal * 0.12);
  const total = subtotal + tax;
  const createdAt = daysAgo(ticket.created);
  const completedAt = ["ready", "picked_up", "cancelled"].includes(ticket.status)
    ? daysAgo(Math.max(0, ticket.created - 1))
    : null;

  const { data: inserted, error } = await supabase
    .from("tickets")
    .insert({
      ticket_number: ticket.number,
      public_code: ticket.code,
      customer_id: customerId.get(ticket.customer),
      device_id: deviceByModel.get(ticket.device),
      status: ticket.status,
      priority: ticket.priority,
      issue: ticket.issue,
      diagnosis: ticket.diagnosis,
      assigned_to: ticket.assignee,
      labour_cents: ticket.labour,
      estimate_cents: ticket.estimate,
      final_cents: ticket.invoice ? total : null,
      due_at: ticket.due ? daysAhead(ticket.due) : null,
      completed_at: completedAt,
      created_by: owner,
      created_at: createdAt,
      updated_at: daysAgo(0),
    })
    .select("id")
    .single();

  if (error) {
    console.error(`Unable to seed ${ticket.number}: ${error.message}`);
    process.exit(1);
  }

  if (parts.length > 0) {
    const { error: partLinkError } = await supabase.from("ticket_parts").insert(
      parts.map((part) => ({ ...part, ticket_id: inserted.id })),
    );
    if (partLinkError) {
      console.error(`Unable to link parts for ${ticket.number}: ${partLinkError.message}`);
      process.exit(1);
    }
  }

  const events = [
    {
      ticket_id: inserted.id,
      actor_id: owner,
      kind: "status",
      status: "intake",
      body: "Ticket created and logged at intake.",
      is_customer_visible: true,
      created_at: createdAt,
    },
  ];

  if (ticket.status !== "intake") {
    events.push({
      ticket_id: inserted.id,
      actor_id: ticket.assignee ?? owner,
      kind: "status",
      status: ticket.status,
      body: `Status moved to ${ticket.status.replaceAll("_", " ")}.`,
      is_customer_visible: true,
      created_at: daysAgo(Math.max(0, ticket.created - 1)),
    });
  }

  if (ticket.diagnosis) {
    events.push({
      ticket_id: inserted.id,
      actor_id: ticket.assignee ?? owner,
      kind: "note",
      body: ticket.diagnosis,
      is_customer_visible: true,
      created_at: daysAgo(Math.max(0, ticket.created - 1)),
    });
  }

  const { error: eventError } = await supabase.from("ticket_events").insert(events);
  if (eventError) {
    console.error(`Unable to seed events for ${ticket.number}: ${eventError.message}`);
    process.exit(1);
  }

  if (ticket.invoice) {
    const paid = ticket.invoice.status === "paid";
    const { error: invoiceError } = await supabase.from("invoices").insert({
      ticket_id: inserted.id,
      invoice_number: `INV-${ticket.number.replace("PW-", "24")}`,
      labour_cents: ticket.labour,
      parts_cents: partsTotal,
      subtotal_cents: subtotal,
      tax_cents: tax,
      total_cents: total,
      status: ticket.invoice.status,
      issued_at: daysAgo(1),
      paid_at: paid ? daysAgo(ticket.invoice.paidDaysAgo ?? 1) : null,
    });
    if (invoiceError) {
      console.error(`Unable to seed invoice for ${ticket.number}: ${invoiceError.message}`);
      process.exit(1);
    }
  }
};

for (const ticket of tickets) {
  await seedTicket(ticket);
}

const { error: syncError } = await supabase.rpc("sync_repair_sequences");
if (syncError) {
  console.error(`Unable to sync repair sequences: ${syncError.message}`);
  process.exit(1);
}

console.log(`Seeded ${customers.length} customers, ${deviceRows.length} devices, ${partRows.length} parts, ${tickets.length} tickets.`);
