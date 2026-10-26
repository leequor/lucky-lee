# Design System

The app uses a high-vis industrial label system: black structural panels, off-white paper, safety
yellow marks, oversized grotesque type, and mono metadata. It is built to look like a tool the team
operates, not a generic SaaS landing page.

## Brand idea

- **Black and paper** carry the hierarchy. Yellow marks action, status, and the current item.
- **No gradients, glass, blobs, shadows, or decorative illustrations.**
- **Hard edges:** every control and tag is square. Radius is 0.
- **Bricolage Grotesque** sets headlines and UI. **Space Mono** handles labels, counts, paths, and
  state.
- **One accent:** safety yellow. Error red is semantic only.

## Color palette

| Token | Hex | Use |
| --- | --- | --- |
| `paper` | `#F3F3EE` | Page background. |
| `surface` | `#FFFFFF` | Inputs and quiet inset surfaces. |
| `ink` | `#0A0A0A` | Text, black panels, primary structure. |
| `muted` | `#57594F` | Secondary text and metadata. |
| `line` | `#C7C9BE` | Reference divider color. Borders use `ink/20`. |
| `wash` | `#E8E9E0` | Neutral inset surface. |
| `signal-50` | `#FFFBE0` | Yellow-tinted success/info surface. |
| `signal-500` | `#FFE500` | Accent fill, focus ring, active/ready marks. |
| `signal-700` | `#5C5200` | Yellow-adjacent text if a tint needs text. |
| `danger-50` | `#FDECEA` | Error surface. |
| `danger-500` | `#C62828` | Error border and fill. |
| `danger-600` | `#A71D1D` | Error text. |

Yellow is a **fill**, not body text on paper. Use black text on yellow.

## Typography

| Role | Family | Notes |
| --- | --- | --- |
| Display / body | Bricolage Grotesque | Tight tracking on display sizes. |
| Labels / metadata | Space Mono | 10 px uppercase, 0.12–0.16em tracking. |
| IDs / paths | Space Mono | Truncate long values, keep selectable. |

### Scale

| Token | Size | Use |
| --- | --- | --- |
| Auth statement | 48–99 px, `clamp()` | Black left panel. |
| Landing welcome | 48–93 px, `clamp()` | Signed-in hero. |
| Page title | 42–70 px, `clamp()` | Status and 404. |
| Section title | 29–40 px | Checklist, shortcuts. |
| Body | 13–15 px, 1.5–1.7 line-height | Copy and descriptions. |
| Metadata | 10–11 px | Labels, tags, endpoints. |

## Spacing and shape

- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 56 px.
- Page gutter: 20 px mobile, 32 px desktop.
- Content widths: 1400 px app shell, 1080 px utility pages, 420 px auth form.
- Radius: 0. No pills, no rounded cards.
- Borders: 1 px `ink/20`; accent rules are 4 px yellow.
- Shadow: none. Hierarchy comes from black panels, rules, spacing, and type weight.

## Core components

### Buttons

- **Primary:** yellow fill, black text, black border. Hover inverts to black fill, yellow text.
- **Secondary:** transparent, 1 px ink/35 border, ink text. Hover fills black.
- **Ghost:** text only, underline on hover.
- Sizes: 32 px small, 40 px default, 44 px auth/mobile nav.
- Focus: 2 px black outline plus a 5 px yellow outer ring.
- Loading: disabled button with a 2 px square pulse and pending copy.

### Inputs and fields

- Height 44 px, square corners, 1 px ink/30 border, white fill.
- Focus: black border plus an inset 2 px black underline.
- Error: red border, red text below the field.
- Label always above the field. Label and hint use mono uppercase.
- Placeholder uses `muted`, never a lighter tint.
- `aria-invalid` and `aria-describedby` on every error.

### Alerts

- Flat strip with a 4 px left border. No filled rounded box.
- **Success:** black left border, yellow-tinted surface.
- **Error:** red left border, red-tinted surface.
- **Info:** muted left border, white fill.
- `role="alert"` for errors, `role="status"` otherwise.

### Navigation

- 64 px sticky bar, black background, yellow logo tile.
- Wordmark left; system status link, email, role tag, square avatar, logout right.
- Mobile hides email and system link. Logout remains visible with a 44 px target.

### Tags

- Square, 1 px border, mono 10 px uppercase.
- Superadmin / ready: yellow fill, black text.
- Admin: black fill, paper text.
- User / open: transparent, ink border, ink text.
- On black panels, use the dark tone: yellow or paper fills.

### Rows

- Checklist, account details, and status use full-width rows separated by 1 px rules.
- No card inside a card. Numbers and state tags align to the right.
- Long IDs truncate; emails wrap.

## Layout

### Auth shell

- Desktop: black statement panel 1.15fr, paper form panel 0.85fr.
- Left: yellow logo tile, sprint label, oversized statement, three facts pinned to the bottom.
- Right: form centered in a 420 px measure.
- Mobile: black statement and facts stack above the form.

### Landing

- Black sticky navbar.
- Asymmetric hero: welcome statement left, black account panel right.
- Checklist left, presentation shortcuts right.
- System facts render as a black three-cell band.
- Footer is a mono rule line.

### Status

- Black header band.
- Utility layout: title and explanation left, health rows right.
- Health rows use text labels and `Ready` / `Wait` / `Warn` / `Fail` tags.
- Raw endpoints sit below the rows as mono links.

## Motion

- One 280 ms reveal on auth content. No scroll hijacks, no infinite loops.
- All motion collapses under `prefers-reduced-motion: reduce`.
- Hover and active states change color or translate by 1 px only.

## Accessibility

- Body text contrast AA; metadata remains at `muted` or darker.
- Yellow is never used for small text on paper.
- Focus ring is always visible: black outline plus yellow outer ring.
- Form labels are never placeholders.
- State is never communicated by color alone.
- Primary controls and mobile nav targets are at least 44 px.
- Layout checked at 360, 768, and 1440 px.

## Avoid

- Cream + clover green + coral + Fraunces.
- Orange operator console variant.
- Gradient blobs, glass panels, background grids, rounded cards.
- Pills, emoji icons, decorative sparkles.
- More than one accent color.
- Fake metrics or vague marketing copy.
