# Design System

The app uses a quiet product interface: an off-white ground, white panels, near-black type, a
single blue accent used only on real data, and status colours only where something has a state.
It is built to look like a tool the team works in, not a marketing page.

## Brand idea

- **One ground, one ink, one accent.** Chrome is achromatic; blue marks the sprint progress and
  nothing else.
- **Surfaces are flat.** Panels separate by one tone step and a 1 px line. No shadows, no glows.
- **Soft geometry.** Panels use 8 px corners, controls 6 px. Nothing is a pill except status tags.
- **Geist** sets all text. **Geist Mono** is reserved for IDs and code.
- **No decoration.** No gradients, blobs, illustrations, index numbers, or tracked-out labels.

## Color palette

| Token | Hex | Use |
| --- | --- | --- |
| `paper` | `#F7F7F7` | Page ground. |
| `surface` | `#FFFFFF` | Panels, inputs, navigation. |
| `ink` | `#0A0A0A` | Text and primary action fill. |
| `muted` | `#6B6B6B` | Secondary text, labels, metadata. |
| `line` | `#E6E6E6` | Panel borders and row rules. |
| `wash` | `#EFEFEF` | Secondary button fill, quiet insets. |
| `accent` | `#1D5FBF` | Sprint progress bar only. |
| `positive` | `#2E7D32` | Ready dot and status text. |
| `positive-soft` | `#DCFAE5` | Ready tag fill. |
| `negative` | `#C4242A` | Error borders, dots, text. |
| `negative-soft` | `#FFEDEA` | Error alert fill. |
| `warn` | `#92400E` | Preview banner text. |
| `warn-soft` | `#FFFBEB` | Preview banner fill. |

Colour is data, status, or the one primary action. It never decorates the chrome.

## Typography

| Role | Family | Size / weight |
| --- | --- | --- |
| Page title | Geist | 24 px / 600, tracking -0.02em |
| Utility page title | Geist | 28 px / 600 |
| Section heading | Geist | 16 px / 500 |
| Body | Geist | 14 px / 400, line-height 1.5–1.7 |
| Field label | Geist | 14 px / 500 |
| Metadata and hints | Geist | 12–13 px / 400 |
| IDs and code | Geist Mono | 13 px, truncate long values |

Sentence case everywhere. No uppercase labels, no letter-spaced capitals. Numbers that align use
`font-variant-numeric: tabular-nums` (`.figure`).

## Spacing and shape

- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40 px.
- Page gutter: 24 px.
- Content width: 1080 px canvas, 420 px auth form.
- Radius: panels 8 px, controls 6 px, status tags full.
- Borders: 1 px `line`. No 4 px accent bars, no double rules.
- Shadow: none. Focus uses a 2 px black outline.

## Core components

### Buttons

- **Primary:** near-black `#141414` fill, white text, 6 px radius. Hover lightens to `#2B2B2B`.
- **Secondary:** `wash` fill, 1 px `line` border, ink text. Hover `#E6E6E6`.
- **Ghost:** text only; hover fills `wash`.
- Sizes: 32 px small, 36 px default, 40 px large/auth.
- Disabled: 45% opacity, no pointer events.
- Pending: label swaps to the pending copy with a small pulse mark.

### Inputs

- Height 40 px, 6 px radius, 1 px `line`, white fill.
- Focus: border turns ink; the global focus outline stays visible.
- Error: red border, red 12 px message with `role="alert"`.
- Label 14 px above the field; hint 12 px muted on the label row.
- Placeholder `#9A9A9A`; never the only label.

### Alerts

- 6 px radius, flat tinted fill, no left bar.
- **Success:** `positive-soft` / `positive-ink`.
- **Error:** `negative-soft` / `negative-ink`.
- **Info:** `wash` / ink.
- `role="alert"` for errors, `role="status"` otherwise.

### Status tags

- Full radius, 12 px medium, with a 6 px dot for state.
- **Ready:** `positive-soft` fill, `positive-ink` text, green dot.
- **Open / neutral:** `wash` fill, `#3D3D3D` text, grey dot.
- **Error:** `negative-soft` fill, `negative-ink` text.
- State is always spelled out; colour is never the only signal.

### Navigation

- 64 px white bar, 1 px bottom rule.
- Clover mark in a white tile, wordmark at 15 px/600.
- Right cluster: status link, email, role tag, round avatar, secondary Log out.
- Below 768 px the email, role, and status link hide; the log-out target stays.

## Layout

### Auth shell

- Full-height ground with the product mark at the top and a quiet footer.
- Form card centred in a 420 px measure on a white panel.
- No split-screen statement panel, no oversized type.
- Fields stack in one column; the forgot-password link sits on the password label row.

### Landing

- White navigation bar, then a 1080 px canvas.
- Title row: `Account overview`, who is signed in, role tag, and one secondary action.
- `Your account` panel: two-column label/value grid on desktop, stacked rows on mobile.
- `Sprint 1 checklist`: heading row with `x of 5 ready`, a 8 px blue progress bar, then rows
  with title, one-line note, and a status tag.
- `Access and environment`: three cells divided by 1 px lines, one short fact each.
- Footer rule with product, sprint, and session state.

### Status

- Same white header and 1080 px canvas.
- Heading, explanation, then the two health rows in one panel.
- Below it, `If a check fails` with three short runbook rows so the page is not half empty.

## Motion

- Transitions are colour and background only, 150 ms.
- No entrance animations, no scroll effects.
- Everything collapses under `prefers-reduced-motion: reduce`.

## Accessibility

- Body and metadata text meet AA on `paper` and `surface`.
- Focus is always visible: 2 px ink outline with 2 px offset.
- Form labels are never placeholders; errors are wired with `aria-invalid` and `aria-describedby`.
- Status tags pair a dot with words.
- Controls are at least 32 px tall; primary and mobile actions are 40–44 px.
- Layout checked at 360, 390, 768, 1440, and 1900 px.

## Avoid

- Black statement panels, safety-yellow fills, clover green, cream, coral, Fraunces.
- Gradients, glass, blobs, shadows, background grids.
- Uppercase tracked-out mono labels, index numbers (`01 / 02`), thin accent rules.
- More than one accent colour, or colour on chrome.
- Fake metrics or vague marketing copy.
