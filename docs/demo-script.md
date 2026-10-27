# Demo Script and Rehearsal Log

**Goal:** show Patchwork as a working repair-shop system: intake, repair workflow, inventory,
invoice/payment, staff roles, and public tracking. About 12 minutes including questions.

## Speaker assignments

| Segment | Speaker |
| --- | --- |
| Welcome and board | Alexander R. Campita |
| Repair desk and 3D bench | Alexander R. Campita |
| Intake | Rian D. Sabrido |
| Workflow, parts, and invoice | Rian D. Sabrido |
| Database, RLS, and tracking security | Ivanhoe V. Rabaca |
| Test results | Jaymark A. De Guzman |
| Design notes and close | Ian Kenneth P. Rafanan + Alexander |

## Before the presentation

- [ ] `npm run seed:demo` and `npm run seed:repair` completed.
- [ ] `npm run dev` is running, or <https://lucky-lee.vercel.app> is open as backup.
- [ ] `/status` shows both checks ready.
- [ ] Browser tabs ready: `/`, `/tickets`, `/tickets/new`, `/customers`, `/inventory`, `/invoices`,
      `/team`, `/track`, `/status`.
- [ ] Backup screenshots in `docs/screenshots/` are open.
- [ ] Demo password is in the password manager.
- [ ] Notifications off; browser zoom 100%.

## Run of show

### 0:00–1:30 — Welcome and the board

**Alexander**

> “We built Patchwork, a repair-shop operations system. It is not a progress dashboard: it runs
> intake, the repair bench, parts inventory, invoicing, staff roles, and a public repair tracker.”

Show the issue board / merged PR, then the live dashboard.

### 1:30–3:00 — Repair desk and 3D bench

**Alexander**

1. Open `/`.
2. Point out open jobs, ready-for-pickup, revenue this month, and low stock.
3. Click **Display**, **Battery**, **Logic board**, **Camera** on the exploded bench.
4. Point out the live queue, bench load, and reorder alerts.
5. Open **Public tracker** in a new tab and leave it for later.

**Say:** “The 3D phone is the actual product model: display, battery, board, camera. It is not a
decorative hero.”

### 3:00–5:30 — Intake

**Rian**

1. Open `/tickets/new`.
2. Use an existing customer with a device.
3. Enter a real fault, set priority to High, estimate $125, labour $25, assign a technician.
4. Create the ticket.
5. On the ticket page, point out the generated `PW-####` number and public code.

### 5:30–8:00 — Workflow, parts, invoice, payment

**Rian**

1. Move status to **Diagnosing**, add a status note.
2. Add a bench note visible to the customer.
3. Add a part; point out the stock decrement on `/inventory`.
4. Show the parts total and generate the invoice (labour + parts + 12% tax).
5. Mark paid and collected; point out the status change and paid ledger.

### 8:00–9:30 — Customers, devices, inventory

**Rian / Ivanhoe**

1. Open a customer with repair history.
2. Show devices, ticket history, and contact details.
3. Add a device.
4. Open `/inventory` and use the ± stock controls.
5. Show the low-stock/reorder state.

### 9:30–10:30 — Security and public tracking

**Ivanhoe**

1. Show `/team` roles: Owner, Manager, Technician.
2. Explain RLS: anonymous users cannot read repair tables.
3. Open `/track`, enter `TRACK1041` + `maya.chen@example.com`.
4. Show only status/device/timeline; no address or payment details.
5. Open `/status` and show both checks ready.

### 10:30–11:30 — Tests and close

**Jaymark + Ian**

1. Show `npm run typecheck`, `npm run lint`, `npm run test:coverage`, and the build result.
2. Show Playwright E2E and local Supabase RLS evidence.
3. Point out the design system: carbon ground, orange signal, 3D bench, mobile drawer.
4. Close with the system outcome: a real repair workflow, not a static mockup.

## Backup plan

| If this fails | Do this |
| --- | --- |
| Supabase is unavailable | Use backup screenshots and explain the `/status` failure mode. |
| Vercel is unreachable | Run locally with `npm run dev` and local Supabase. |
| A mutation fails | Show the ticket timeline and the last successful database state. |
| Live data is dirty | Re-run `npm run seed:repair` on an empty database or use the backup screenshots. |
