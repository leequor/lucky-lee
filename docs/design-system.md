# Design System

The app should feel like a calm control room: warm paper, deep clover green, one bright coral
accent, generous spacing, and a clear hierarchy. The interface is friendly, but it does not hide
the important state.

## Brand idea

- **Clover green** is the anchor: trust, luck, and a quiet "we have this handled" feeling.
- **Cream paper** keeps the app warm and readable during a long demo.
- **Coral** is reserved for errors and urgent actions, so it never loses meaning.
- **Fraunces** gives headings a little personality. **Manrope** keeps forms and body copy clear.

## Color palette

| Token | Hex | Use |
| --- | --- | --- |
| `cream` | `#F7F3EA` | Page background. |
| `paper` | `#FFFDF8` | Cards, forms, raised surfaces. |
| `ink` | `#1C2321` | Primary text. |
| `muted` | `#64706B` | Secondary text and helper copy. |
| `clover-900` | `#052E16` | Dark hero panels and primary emphasis. |
| `clover-800` | `#14532D` | Logo mark and deep green surfaces. |
| `clover-700` | `#166534` | Primary buttons and links. |
| `clover-100` | `#DCFCE7` | Soft success and highlight surfaces. |
| `clover-50` | `#F0FDF4` | Quiet success panels. |
| `coral-600` | `#EA580C` | Error text and destructive emphasis. |
| `coral-500` | `#F97316` | Error borders and focus states. |
| `coral-100` | `#FFEDD5` | Soft error surfaces. |
| `mist` | `#E7E5DF` | Neutral chips and dividers. |

Use at most one coral surface per screen. Green is the primary action color.

## Typography

| Role | Family | Notes |
| --- | --- | --- |
| Display | Fraunces | Hero headlines, page titles, large numbers. |
| Body / UI | Manrope | Labels, inputs, buttons, body copy, tables. |
| Code / IDs | System monospace | Account IDs and technical references. |

### Scale

| Token | Size | Use |
| --- | --- | --- |
| Hero | 52–54 px desktop / 36 px mobile | Landing welcome. |
| H1 | 32 px | Auth card title. |
| H2 | 24 px | Section title. |
| Body | 15–16 px | Main copy. |
| Small | 13–14 px | Helper text, secondary labels. |
| Eyebrow | 11–12 px, uppercase, 0.16–0.22em tracking | Section labels. |

## Spacing and shape

- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64 px.
- Auth card padding: 24 px mobile, 32 px desktop.
- Page gutter: 20 px mobile, 32 px desktop.
- Radii: 12 px for inputs, 16 px for small cards, 24–36 px for large cards, full radius for
  buttons and badges.
- Shadow: `shadow-card` for the main card, `shadow-soft` for smaller surfaces. Do not stack
  multiple heavy shadows.

## Core components

### Buttons

- **Primary:** clover-700 background, white text, full pill. Hover clover-800.
- **Secondary:** white/80 background, ink border, ink text. Hover white.
- **Ghost:** transparent, muted text. Hover ink/5.
- Sizes: 36 px (small), 44 px (default), 48 px (large/auth).
- Disabled: 60% opacity, no pointer events.
- Focus: 2 px clover ring with a 2 px cream offset.
- Loading: spinner + pending copy, button disabled.

### Inputs and fields

- Height 48 px, 16 px radius, 1 px ink/10 border.
- White/75 background; white on focus.
- Focus: clover-600 border and a 4 px clover-600/10 ring.
- Error: coral-500 border and coral-500/10 ring.
- Label is always visible above the field.
- Helper text sits below the field; error text replaces the helper when both are present.
- Use `aria-invalid` and `aria-describedby` for every error.

### Alerts

- **Success:** clover-50 surface, clover-800 text, clover-600/20 border.
- **Error:** coral-100 surface, coral-600 text, coral-500/25 border.
- **Info:** white/70 surface, ink/70 text, ink/10 border.
- Alerts use `role="alert"` for errors and `role="status"` otherwise.

### Navbar

- 80 px height, cream/80 with blur, 1 px bottom border.
- Logo left; email, role badge, avatar, and logout right.
- On mobile, hide the email text but keep the avatar and logout.
- The landing page navbar is sticky and sits above the grid pattern.

### Role badge

- Superadmin: clover-900 background, clover-50 text.
- Admin: clover-100 background, clover-800 text.
- User: mist background, ink/70 text.
- Small uppercase tracking; never rely on color alone.

### Cards

- Main auth card: paper/90, 32 px radius, 1 px ink/10 border, `shadow-card`.
- Landing hero: clover-900, white text, large radii, subtle concentric circles.
- Checklist rows: white/45, 16 px radius, 1 px ink/5 border.
- Hover for links: border clover-700/20 and white background.

## Layout

### Auth shell

- Desktop: two columns, left brand story (1.05fr) and right form card (0.95fr).
- Mobile: compact logo row, then the form card.
- Background: cream with a fading 48 px grid and soft green/coral blobs.
- The form is always the visual focus on small screens.

### Landing page

- Navbar, then a 1.28fr/0.72fr hero grid.
- Left: welcome, email, role, auth state, member since, primary actions.
- Right: account card with role badge and privacy note.
- Below: sprint checklist and presentation shortcuts.
- Footer: year, signed-in state, status link.

## Motion

- Use one entrance animation (`fade-up`, 0.55 s) on auth cards and status panels.
- Do not animate form errors or page navigation.
- Respect reduced motion by keeping the animation subtle; no essential information is carried by
  motion.

## Accessibility

- Minimum body contrast: ink on cream, white on clover-900.
- Every input has a visible label.
- Errors are text, not color alone.
- Focus rings are visible on every interactive element.
- Buttons have descriptive labels ("Log out", "Send reset link", not "Go").
- The page works at 200% zoom and 360 px width.
- Do not use placeholder text as the only label.

## Files

- Wireframes: `design/wireframes/`
- Final mockups: `design/mockups/`
- Developer notes: `design/README.md`
- Tokens: `tailwind.config.ts` and `app/globals.css`
- Components: `components/ui/` and `components/auth/`
