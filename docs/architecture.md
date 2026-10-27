# Architecture

## Overview

Patchwork is a single Next.js App Router application. Supabase provides authentication, Postgres,
and row level security. The same deployment serves the staff workspace, the public repair tracker,
and the health endpoints.

```text
Browser
  |
  |-- Next.js App Router (server components + client forms)
  |     |-- /login, /forgot-password, /reset-password  -> Supabase Auth
  |     |-- /(workspace)/*                              -> staff RLS queries + server actions
  |     |-- /track                                      -> track_ticket() RPC (anon)
  |     |-- /api/health                                 -> app health
  |     `-- /api/health/supabase                        -> Supabase REST health
  |
  `-- @supabase/ssr session cookies
        |
        `-- Postgres: profiles, customers, devices, tickets,
            ticket_events, parts, ticket_parts, invoices + RLS
```

## Request flow

### Staff login

1. `/login` submits `loginAction`.
2. `loginWithPassword` calls `supabase.auth.signInWithPassword`.
3. `@supabase/ssr` writes session cookies.
4. The action redirects to `/`.
5. The `(workspace)` layout calls `requireStaff()`; without a session it redirects to `/login`.

Staff accounts are invite-only. Owners and managers create confirmed accounts from `/team` through
the service-role-only server action.

### Ticket intake

1. `/tickets/new` loads customers/devices and staff from the server.
2. `createTicketAction` validates the fault, priority, estimate, labour, due date, customer, and
   device.
3. Existing-customer mode verifies the device belongs to the customer. New-customer mode creates
   the customer and device first.
4. Postgres assigns `PW-####` and a tracking code through `set_ticket_defaults()`.
5. An `intake` event is written, then the action redirects to the ticket.

### Bench work

- `updateTicketStatusAction` moves the status and writes a customer-visible timeline event.
- `addTicketPartAction` calls `add_ticket_part()`, which checks stock, writes the join row, decrements
  inventory, and records an internal event in one database transaction.
- `updateTicketDetailsAction` updates diagnosis, priority, technician, estimate, labour, and target
  date.
- Notes are stored as `ticket_events`; the team chooses whether the customer can see them.

### Invoice and payment

1. `createTicketInvoiceAction` calls `create_ticket_invoice()`.
2. The function totals labour + parts, applies 12% tax, upserts the invoice, marks the ticket ready,
   and records an event.
3. `mark_invoice_paid()` sets the invoice paid and moves the ticket to picked up/collected. Billing RPCs are manager/owner-only at the action and through a database trigger.
   `picked_up` is rejected by the status action unless the invoice is paid.

### Public tracking

1. `/track` accepts the unguessable tracking code on its own. No email, phone, or account is needed.
2. `track_ticket(p_code)` is a security-definer RPC.
3. It returns only the ticket number, status, issue, device, first name, and customer-visible events.
4. Anonymous users have no table access; they can only call that RPC. The sequential `PW-` number is not accepted, so the tracker cannot be enumerated.

## Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Staff | Repair desk dashboard. |
| `/tickets` | Staff | Search/filter the repair queue. |
| `/tickets/new` | Staff | Intake. |
| `/tickets/[id]` | Staff | Repair brief, status, parts, timeline, invoice. |
| `/customers` | Staff | Customer directory. |
| `/customers/new` | Staff | Create a customer. |
| `/customers/[id]` | Staff | Contact, devices, repair history. |
| `/inventory` | Staff read; owner/manager write | Parts, stock, reorder levels, adjustments. |
| `/invoices` | Staff read; owner/manager collect | Invoice ledger and payment. |
| `/team` | Staff read; owner/manager manage | Staff directory; owners manage owner roles, managers manage other roles. |
| `/track` | Public | Customer repair tracking. |
| `/login` | Public | Staff sign-in. |
| `/register` | Public | Invite-only explanation. |
| `/forgot-password` | Public | Request a reset link. |
| `/reset-password` | Recovery session | Set a new password. |
| `/status` | Public | Health checks and runbook. |
| `/auth/callback` | Public | PKCE code exchange. |
| `/auth/confirm` | Public | Token-hash verification. |
| `/api/health` | Public | App health JSON. |
| `/api/health/supabase` | Public | Supabase health JSON. |

## Data model

```text
profiles
  id, email, full_name, role (superadmin | admin | user), created_at, updated_at

customers
  id, full_name, email, phone, company, notes, timestamps

devices
  id, customer_id -> customers, category, brand, model, serial, color, notes, timestamps

tickets
  id, ticket_number, public_code, customer_id, device_id,
  status (intake | diagnosing | waiting_parts | in_repair | ready | picked_up | cancelled),
  priority (low | normal | high | urgent), issue, diagnosis,
  assigned_to -> profiles, labour_cents, estimate_cents, final_cents,
  due_at, completed_at, created_by -> profiles, timestamps

ticket_events
  id, ticket_id, actor_id -> profiles, kind, status, body,
  is_customer_visible, created_at

parts
  id, sku, name, category, stock, reorder_level, cost_cents, price_cents, supplier, timestamps

ticket_parts
  ticket_id, part_id, quantity, unit_price_cents

invoices
  id, ticket_id, invoice_number, labour_cents, parts_cents, subtotal_cents,
  tax_cents, total_cents, status (draft | sent | paid | void), issued_at, paid_at
```

## Security boundaries

| Boundary | Control |
| --- | --- |
| Browser -> server | Server actions validate every field; no client-only trust. |
| Server -> Supabase | Anon key + staff session for normal work; service role only for seed and staff creation. |
| Repair tables | RLS enabled; authenticated staff read, managers and owners write inventory and invoices. |
| Public tracker | Security-definer RPC returns only customer-safe fields. |
| Profiles | Staff can read the directory; owners change owner roles, managers change other roles. |
| Stock | `add_ticket_part()` runs with row locks and rejects insufficient stock. |
| Invoices | Generated and paid through database functions, not client-supplied totals. |
| Secrets | `.env.local` ignored; service role is server-only. |

## Design decisions

1. **Next.js App Router** keeps the authenticated workspace and public tracker in one deployment.
2. **Supabase Auth** owns passwords, reset tokens, email confirmation, and session cookies.
3. **Postgres functions for money and stock** prevent double-submit and client-tampering bugs.
4. **One unguessable tracking code** avoids customer accounts while still protecting repair data. The code is the sole credential, so it must stay private.
5. **React Three Fiber** gives the dashboard a real product-specific 3D object without shipping a
   model or external asset dependency.
6. **Invite-only staff** removes the old public sign-up path from the internal workspace.

## Future work

- Email/SMS notifications for status changes.
- Supplier purchase orders and receiving.
- Barcode/QR label printing for devices and tickets.
- Multi-location inventory and transfers.
- Custom tax rates and discounts.
- Audit log export and analytics.
