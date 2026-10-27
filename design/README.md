# Design Notes

The implemented app is the source of truth. This folder holds the visual reference for Patchwork:
the repair desk, the 3D bench, and the public tracker.

## Final mockups

| File | Screen | Notes |
| --- | --- | --- |
| `mockups/login.png` | Login | Split shell with the 3D repair bench and invite-only staff note. |
| `mockups/register.png` | Staff access | Invite-only explanation. |
| `mockups/forgot-password.png` | Reset request | One email field and the generic success state. |
| `mockups/reset-password.png` | Set a new password | Valid recovery-session preview. |
| `mockups/landing-preview.png` | Repair desk | Real signed-in dashboard with the 3D bench. |
| `mockups/status.png` | System status | App and Supabase health checks with the bench panel. |

Backup copies live only here; the docs link to this folder.

Regenerate from a running production build:

```bash
npm run capture:mockups
```

## Wireframes

Early layout studies live in `wireframes/`: `login.svg`, `register.svg`, and `reset-password.svg`.

## Developer notes

### Workspace shell

- `components/workspace/workspace-shell.tsx` owns the sidebar, mobile drawer, search, and user block.
- Desktop sidebar is 248 px; mobile drawer is 280 px with a plain overlay.
- Navigation closes when a link is used on mobile.
- Page titles come from the pathname; the shell does not repeat an h1.

### Dashboard

- `app/(workspace)/page.tsx` loads `getDashboardData()`.
- The 3D bench is `components/patchwork/repair-bench.tsx`; it is client-only and dynamically loads
  the React Three Fiber scene.
- The scene is a three-layer teardown: display, chassis internals, and back panel, with a live
  repair screen and a reflective studio stage.
- The four layer buttons only change the scene. Repair state is always shown in text.
- Use `PrimaryLink` for New ticket and `SecondaryLink` for the public tracker.

### Tickets

- Intake uses a two-mode form: existing customer/device or new customer + device.
- Ticket detail has separate server-action forms for status, details, notes, parts, and invoice.
- Status changes and customer-visible notes appear in the timeline.
- Parts move stock only through the `add_ticket_part` RPC.
- Invoices are generated through `create_ticket_invoice`; payment goes through
  `mark_invoice_paid` and marks the ticket collected.

### Customers and inventory

- A customer owns devices; a ticket links to both.
- Inventory adjustment is one unit per click; stock cannot go below zero.
- Low stock means `stock <= reorder_level`.

### Team

- Owners and managers create confirmed staff accounts. Owners manage owner roles; managers manage non-owner roles.
- Technicians work tickets and customers; inventory and invoice collection are read-only.
- New staff receive a temporary password; ask them to change it from **Forgot password**.

### Public tracker

- `/track` is outside the workspace shell and needs no account.
- The `track_ticket` RPC requires the tracking code plus email or phone.
- Only customer-visible events are returned, and only first name + device + status are exposed.

### Responsive rules

- 390 px: single column, 20 px gutter, drawer navigation, stacked dashboard.
- 768 px: single-column workspace with wider panels; the top bar keeps search.
- 1440 px: 248 px sidebar, split dashboard hero, two-column detail pages.

## Color and type references

Full tokens are in [docs/design-system.md](../docs/design-system.md). Short version:

- Ground `#08090B`, panel `#111317`, ink `#F2EFE7`, muted `#969DA6`, line `#252A32`.
- Signal orange `#FF6B35` for actions, bench selection, and live state.
- Ready green `#5BE0A0`; low stock amber `#F0B54A`; error red `#FF6B6B`.
- Text: Geist. Codes: Geist Mono.

