# Design System

The app reads as an operator's field manual: paper-flat surfaces, hard rules, compact mono labels,
one signal accent. It should feel built for a team that runs the system, not decorated for a pitch.

## Brand idea

- **Paper and ink** carry the interface. No gradients, glass, floating cards, or decorative blobs.
- **Signal orange** marks action, open state, and focus. One accent, used sparingly.
- **Hard edges and thin rules** create hierarchy. Shadows are not used for elevation.
- **Archivo** sets the voice. **IBM Plex Mono** handles metadata, counts, paths, and status.
- **The grid is asymmetric**, but mobile collapses to one column with the same reading order.

## Color palette

| Token | Hex | Use |
| --- | --- | --- |
| `paper` | `#F2F2EC` | Page background. |
| `surface` | `#FAFAF5` | Inputs and quiet inset surfaces. |
| `ink` | `#12130F` | Primary text, primary buttons, ready tags. |
| `muted` | `#616458` | Secondary text and metadata. |
| `line` | `#CFD0C4` | Reference divider color. Borders use `ink/15`. |
| `wash` | `#E7E8DE` | Neutral success surface. |
| `signal-50` | `#FFF2EC` | Open/warning surface. |
| `signal-500` | `#F4511E` | Focus ring, accent rule, small marks. |
| `signal-600` | `#D9410F` | Error and warning borders. |
| `signal-700` | `#A8320B` | Signal text and dark hover fill. |

No second accent. Ready is ink. Open/warning/error is signal. Do not use color as the only state
signal: every state also has a text label.

## Typography

| Role | Family | Notes |
| --- | --- | --- |
| Display / body | Archivo | Tight tracking on display sizes. No serif. |
| Labels / metadata | IBM Plex Mono | 10 px uppercase, 0.12–0.16em tracking. |
| IDs / paths | IBM Plex Mono | Truncate long values, keep them selectable. |

### Scale

| Token | Size | Use |
| --- | --- | --- |
| Auth statement | 48–99 px, `clamp()` | Left auth panel. |
| Landing welcome | 48–93 px, `clamp()` | Signed-in hero. |
| Page title | 42–70 px, `clamp()` | Status and 404. |
| Section title | 29–40 px | Checklist, shortcuts. |
| Body | 13–15 px, 1.5–1.7 line-height | Copy and descriptions. |
| Metadata | 10–11 px | Labels, tags, endpoints. |

## Spacing and shape

- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 56 px.
- Page gutter: 20 px mobile, 32 px desktop.
- Content widths: 1400 px app shell, 1080 px utility pages, 420 px auth form.
- Radius: 2 px for controls and tags. No pills, no 16–32 px cards.
- Borders: 1 px `ink/15`; accent rules are 3 px signal.
- Shadow: none. Hierarchy comes from rules, spacing, and type weight.

## Core components

### Buttons

- **Primary:** ink fill, paper text, signal-700 hover, 2 px radius.
- **Secondary:** transparent, 1 px ink/30 border, ink text. Hover fills ink.
- **Ghost:** text only, underline on hover.
- Sizes: 32 px small, 40 px default, 44 px auth.
- Focus: global 2 px signal outline with 3 px offset.
- Loading: disabled button with a 2 px square pulse and pending copy.

### Inputs and fields

- Height 44 px, 2 px radius, 1 px ink/25 border, `surface` fill.
- Focus: ink border plus 1 px ink ring.
- Error: signal border, signal text below the field.
- Label always above the field. Label and hint use mono uppercase.
- Placeholder uses `muted`, not a lighter tint.
- `aria-invalid` and `aria-describedby` on every error.

### Alerts

- Flat strip with a 3 px left border. No filled rounded box.
- **Success:** ink left border, `wash` surface.
- **Error:** signal left border, `signal-50` surface.
- **Info:** muted left border, `surface` fill.
- `role="alert"` for errors, `role="status"` otherwise.

### Navigation

- 64 px sticky bar, paper background, 1 px bottom rule.
- Wordmark left; system status link, email, role tag, square avatar, logout right.
- Mobile hides email and system link. Logout remains visible.

### Tags

- 2 px radius, 1 px border, mono 10 px uppercase.
- Superadmin: ink fill, paper text.
- Admin: signal-50 fill, signal-700 text.
- User: transparent, ink/25 border, muted text.

### Rows

- Checklist, account details, and status use full-width rows separated by 1 px rules.
- No card inside a card. Numbers and state tags align to the right.
- Long IDs truncate; emails wrap.

## Layout

### Auth shell

- Desktop: two columns, 1.15fr statement / 0.85fr form, divided by a 1 px rule.
- Left: logo, sprint label, oversized statement, three facts pinned to the bottom.
- Right: form centered in a 420 px measure.
- Mobile: statement and facts stack above the form in one column.

### Landing

- Asymmetric hero: welcome statement left, account panel right.
- Checklist left, presentation shortcuts right. On mobile the shortcut list follows the checklist.
- System facts render as a three-cell strip, not cards.
- Footer is a mono rule line.

### Status

- Utility layout: title and explanation left, health rows right.
- Health rows use text labels and `Ready` / `Wait` / `Warn` / `Fail` tags.
- Raw endpoints sit below the rows as mono links.

## Motion

- One 280 ms reveal on auth content. No scroll hijacks, no infinite loops.
- All motion collapses under `prefers-reduced-motion: reduce`.
- Hover and active states change color or translate by 1 px only.

## Accessibility

- Body text contrast AA; metadata remains at `muted` or darker.
- Focus ring is always visible and uses the single signal accent.
- Form labels are never placeholders.
- State is never communicated by color alone.
- Touch targets are at least 44 px for primary controls.
- Layout checked at 360, 768, and 1440 px.

## Avoid

- Warm cream + green + serif (the previous direction).
- Gradient blobs, glass panels, background grids, oversized rounded cards.
- Pills, emoji icons, decorative sparkles.
- More than one accent color.
- Fake metrics or vague marketing copy.
