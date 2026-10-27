# Design System

The app uses the **Lucky Vault** interface: a midnight-jade ground, warm-white type, one jade
accent, and a gold core in the product mark. It is still a working tool, but the account screen
now has a signature 3D element instead of a plain panel.

## Brand idea

- **Four leaves, one account.** The clover is the product mark. A real-time 3D leaf field is the
  one decorative element, and it is built from the same four loops as the mark.
- **One ground, one ink, one accent.** Chrome is near-black green; jade marks progress, live state,
  and the primary brand moments. Gold appears only in the mark core.
- **Surfaces are flat.** Panels separate by one tone step and a 1 px line. No shadows at rest, no
  glass, no blurred navigation.
- **Soft geometry.** Panels use 16 px corners, controls 10 px, and action buttons are full-radius.
- **Geist** sets all text. **Geist Mono** is reserved for IDs and code.
- **No decorative noise.** The only pattern is a faint SVG dot field inside the 3D scene panel.

## Color palette

| Token | Hex | Use |
| --- | --- | --- |
| `paper` | `#060B09` | Page ground. |
| `surface` | `#0D1512` | Panels, inputs, navigation. |
| `ink` | `#F1F4F0` | Text and primary action fill. |
| `muted` | `#A0AEA6` | Secondary text, labels, metadata. |
| `line` | `#1C2A24` | Panel borders and row rules. |
| `wash` | `#131E19` | Secondary button fill, quiet insets. |
| `accent` | `#4CE3A6` | Progress, live state, role highlight. |
| `gold` | `#E6C77B` | Clover core and small scene nodes only. |
| `positive` | `#4CE3A6` | Ready dot and status text. |
| `positive-soft` | `#0D2A20` | Ready tag fill. |
| `negative` | `#F07A70` | Error borders, dots, text. |
| `negative-soft` | `#2B1517` | Error alert fill. |
| `warn` | `#E9BC70` | Preview banner text. |
| `warn-soft` | `#2A2114` | Preview banner fill. |

Colour is data, status, or the one primary action. It never decorates chrome.

## Typography

| Role | Family | Size / weight |
| --- | --- | --- |
| App title | Geist | 24 px phone, 32 px desktop / 600, tracking -0.045em |
| Auth title | Geist | 27 px phone, 30 px desktop / 600 |
| Public utility title | Geist | 34 px phone, 44 px desktop / 600 |
| Section heading | Geist | 17 px / 500 |
| Body | Geist | 13–14 px / 400, line-height 1.5–1.7 |
| Field label | Geist | 14 px / 500 |
| Metadata and hints | Geist | 11–13 px / 400 |
| IDs and code | Geist Mono | 12–13 px, truncate long values |

Sentence case everywhere. No uppercase labels, no letter-spaced capitals. Numbers that align use
`font-variant-numeric: tabular-nums` (`.figure`).

## Spacing and shape

- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48 px.
- Page gutter: 20 px phone, 24 px desktop.
- Content width: 1120 px canvas, 440 px auth form.
- Radius: panels 16 px, controls 10 px, action buttons and status tags full.
- Borders: 1 px `line`. No 2 px accent bars, no double rules.
- Shadow: none at rest. Focus uses a 2 px jade outline.
- The 3D panel uses a flat `#08110D` field with a 28 px SVG dot pattern.

## Core components

### Buttons

- **Primary:** `ink` fill, `paper` text, full radius. Hover turns white.
- **Secondary:** `wash` fill, 1 px `line` border, ink text. Hover border `#335245`.
- **Ghost:** text only; hover fills `wash`.
- Sizes: 32 px small, 36 px default, 44 px large/auth.
- Disabled: 45% opacity, no pointer events.
- Pending: label swaps to the pending copy with a static mark.

### Inputs

- Height 44 px, 10 px radius, 1 px `line`, `paper` fill inside the card.
- Focus: border turns jade and the field returns to `paper`.
- Error: red border, red 12 px message with `role="alert"`.
- Label 14 px above the field; hint 12 px muted on the label row.
- Autofill is forced back to the dark surface so Chrome cannot paint a white field.

### Alerts

- 16 px radius, flat tinted fill, 1 px state border, no left bar.
- **Success:** `positive-soft` / `positive-ink`.
- **Error:** `negative-soft` / `negative-ink`.
- **Info:** `wash` / ink.
- `role="alert"` for errors, `role="status"` otherwise.

### Status tags

- Full radius, 12 px medium, with a 6 px dot for state.
- **Ready:** `positive-soft` fill, `positive-ink` text, jade dot.
- **Open / neutral:** `wash` fill, `muted` text, grey dot.
- **Error:** `negative-soft` fill, `negative-ink` text.
- State is always spelled out; colour is never the only signal.

### Navigation

- 64 px solid ground, 1 px bottom rule, no blur.
- Clover mark in a 36 px wash tile, wordmark at 15 px/600.
- Right cluster: status pill, email, role tag, round avatar, secondary Log out.
- Below 768 px the email, role, and status link hide; the avatar and Log out stay.

## The 3D scene

`components/visual/lucky-scene.tsx` is a dependency-free canvas renderer.

- Four torus loops form the clover; a gold stem and core complete the mark.
- Depth-sorted segments use alpha for distance, so the shape reads in 3D without WebGL.
- Orbiting dust is deterministic, not random per frame.
- Pointer movement tilts the field; touch does not block page scrolling.
- It pauses when the tab is hidden, caps device pixel ratio at 2, and renders a still frame when
  `prefers-reduced-motion` is set.
- The canvas is `aria-hidden`; all meaning is in the surrounding text.

## Layout

### Auth shell

- Split screen at 1024 px and wider: a brand statement, the live 3D scene, and three security
  facts on the left; the form card on the right.
- Phone and tablet: logo and status row, a 128 px 3D banner, then the form card, then a quiet
  footer.
- Form card: 440 px measure, 16 px radius, one column of fields, recovery link on the password
  label row.

### Landing

- Solid navigation bar, then a 1120 px canvas.
- Hero: title, sign-in identity, readiness figure, role tag, status action, and a live 3D panel.
- `Sprint 1 checklist`: heading row with `x of 5 ready`, an 8 px jade progress bar, then rows
  with title, one-line note, and a status tag.
- `Your account`: identity, role, email state, provider, member date, account ID, account health.
- `Access and environment`: three cells divided by 1 px lines, one short fact each.
- Footer rule with product, sprint, and session state.

### Status page

- Public utility page with the same shell and a 3D connection panel on desktop.
- Health rows keep the app and Supabase checks first; the runbook follows.

## Motion

- Entrance: a 14 px rise and fade, staggered by 90 ms across hero, checklist, and environment.
- Canvas: continuous slow rotation plus pointer tilt; reduced motion gets one still frame.
- Buttons: colour and 1 px press movement only.
- All animation is disabled under `prefers-reduced-motion`.

## Rejected looks

Do not bring these back:

- cream + clover green + coral + Fraunces
- black + safety yellow + Bricolage + Space Mono
- light grey + white cards + blue progress-only accent (the previous quiet UI)
