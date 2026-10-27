# Design System

Patchwork uses a **workshop** interface: carbon ground, warm-white type, signal orange for the
bench and primary actions, and a real-time 3D exploded-device scene. It is an operations tool
first; the 3D bench is the product's identity, not decoration around a marketing page.

## Brand idea

- **The bench is the product.** The exploded iPhone shows the four layers a repair shop actually
  works with: display, battery, logic board, camera.
- **One ground, one ink, one accent.** Chrome is carbon and steel; orange marks the active bench
  layer, primary actions, and live state.
- **Surfaces are flat.** Panels separate by a tone step and a 1 px line. No glass, no blurred
  navigation, no shadows at rest.
- **Measured geometry.** Panels use 16 px corners, controls 10 px, action buttons and status tags
  are full-radius.
- **Geist** sets all text. **Geist Mono** is reserved for ticket codes, tracking codes, IDs, and
  amounts that need alignment.

## Color palette

| Token | Hex | Use |
| --- | --- | --- |
| `paper` | `#08090B` | Page ground. |
| `surface` | `#111317` | Panels, navigation, cards. |
| `raised` | `#171A20` | Nested surfaces and quiet insets. |
| `ink` | `#F2EFE7` | Primary text and inverted buttons. |
| `muted` | `#969DA6` | Secondary text, labels, metadata. |
| `line` | `#252A32` | Panel borders and row rules. |
| `wash` | `#1A1E25` | Secondary button fill, selected navigation. |
| `accent` | `#FF6B35` | Bench highlights, primary actions, live state. |
| `gold` | `#E7B45A` | Scene nodes and fine hardware detail only. |
| `positive` | `#5BE0A0` | Ready and paid state. |
| `negative` | `#FF6B6B` | Errors and urgent state. |
| `warn` | `#F0B54A` | Waiting on parts and low stock. |

## Typography

| Role | Family | Size / weight |
| --- | --- | --- |
| App title | Geist | 28–32 px / 600, tracking -0.045em |
| Public hero | Geist | 44 px phone, 62 px desktop / 600 |
| Section heading | Geist | 14–17 px / 500 |
| Body | Geist | 13–14 px / 400, line-height 1.5–1.6 |
| Field label | Geist | 13–14 px / 500 |
| Metadata | Geist | 10–11 px / 400 |
| Ticket / invoice codes | Geist Mono | 11–13 px |

Sentence case everywhere. Numbers in tables and totals use `font-variant-numeric: tabular-nums`
(`.figure`).

## Spacing and shape

- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40 px.
- Page gutter: 20 px phone, 24 px desktop.
- Content width: 1320 px workspace canvas, 440 px auth form.
- Radius: panels 16 px, controls 10 px, actions and pills full.
- Borders: 1 px `line`; the mobile drawer is the only overlay with a shadow.
- Focus: 2 px orange outline, 3 px offset.

## Core components

### Buttons

- **Primary:** orange fill, near-black text, full radius. Hover `#FF8358`.
- **Inverted:** `ink` fill, `paper` text. Used for secondary page actions.
- **Secondary:** `wash` fill, 1 px `line` border.
- **Ghost:** text only; hover fills `wash`.
- Sizes: 32 px small, 36 px default, 44 px large/auth.
- Pending state keeps the label plus a static dot; no looping pulse.

### Inputs

- Height 40–44 px, 10 px radius, `paper` fill inside panels.
- Focus: orange border.
- Error: red border and a 12 px message with `role="alert"`.
- Labels stay visible. Hints sit on the label row or below the field.
- Autofill is forced back to the carbon surface.

### Status language

- **Intake** neutral, **Diagnosing** blue, **Waiting on parts** amber, **In repair** orange,
  **Ready** green, **Picked up** grey, **Cancelled** red.
- Every status is a dot plus a word; colour is never the only signal.
- Priority is text plus a dot: Low, Normal, High, Urgent.
- Invoice state is Draft, Unpaid, Paid, or Void.

### Workspace shell

- 248 px desktop sidebar; solid surface, 1 px rule, no blur.
- Wordmark at top, orange **New ticket** action, then Overview, Tickets, Customers, Inventory,
  Invoices, Team.
- Bottom: public tracker link and the signed-in staff block with logout.
- Top bar: mobile menu, page name, search tickets/customers, quick New action.
- Mobile: sidebar becomes a drawer; the top bar keeps the mark and actions.

### Public tracker

- Same brand and 3D bench, but no workspace chrome.
- Form takes the 10-character tracking code. No email or phone is needed.
- The result shows device, issue, current stage, and only customer-visible timeline events.
- Never shows address, payment details, internal notes, or staff-only fields.

## The 3D bench

`components/patchwork/repair-bench.tsx` and `repair-scene.tsx`.

- A studio teardown in three floating layers: the display, the chassis with its internals, and the
  back panel. No external model or texture downloads.
- The display is a live repair screen: 62% progress ring, ticket PW-1041, four repair stages, the
  technician, and the ETA.
- The chassis exposes a graphite battery, a green logic board with shield cans, a copper coil, gold
  traces, camera module, taptic engine, screws, and pull tabs.
- Titanium frames use a clearcoat finish; the screen glass and back panel catch soft studio
  lightformers. A dim reflective stage, orange light pool, guide lines, and floating dust finish the
  shot.
- Bloom is limited to the screen ring and orange accents; a vignette keeps the corners dark.
- The four layer buttons select a part; the selected part lifts out of the chassis with a warm work
  light. The display lifts toward the camera.
- A fitted perspective camera keeps all three layers in frame on wide, narrow, and compact cards.
- Pointer movement tilts the rig; idle motion stops under `prefers-reduced-motion`.
- Compact mode drops the back panel and layer controls for auth and status panels; narrow cards drop
  the back panel too.
- Canvas is decorative; every state is repeated in text.

## Layout

### Dashboard

- Title row: repair desk, date, public tracker, new ticket.
- Split hero: 3D bench + live shop metrics.
- Live queue and bench load side by side; low stock in the right column.
- Four status cells at the bottom.

### Ticket detail

- Header: ticket number, status, priority, tracking code, copy.
- Left: repair brief, parts, timeline, notes.
- Right: bench controls (status, assignment, estimate, labour, diagnosis), customer/device card,
  invoice card.

### Tables

- Quiet rules, no zebra striping.
- Ticket numbers and money are tabular.
- Mobile rows become stacked cards; the important status stays beside the customer.

## Motion

- Entrance: 14 px rise and fade, 90 ms stagger across dashboard cards.
- Canvas: slow tilt and a lift on the selected layer.
- Feedback: colour and 1 px press movement only.
- Reduced motion removes travel and keeps content.

## Rejected looks

Do not bring these back:

- cream + clover green + coral + Fraunces
- black + safety yellow + Bricolage + Space Mono
- light grey + white cards + blue progress-only accent
