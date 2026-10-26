# Design Notes

This folder holds the Sprint 1 design artifacts. The implemented app is the source of truth;
the mockups are the visual reference for the developer and the presentation.

## Files

### Wireframes

| File | Screen | Notes |
| --- | --- | --- |
| `wireframes/login.svg` | Login | Two-column auth shell, email/password card, forgot-password link. |
| `wireframes/register.svg` | Register | Same shell with display name, email, password, and sign-in link. |
| `wireframes/reset-password.svg` | Set a new password | Two password fields, expired-link state noted in the margin. |

### Final mockups

| File | Screen | Notes |
| --- | --- | --- |
| `mockups/login.svg` | Login | Warm cream, deep clover panel, coral focus accents. |
| `mockups/register.svg` | Register | Adds the optional display name field. |
| `mockups/reset-password.svg` | Set a new password | Same card rhythm; confirmation field is explicit. |
| `mockups/landing.svg` | Landing | Protected dashboard with role, account card, checklist, and shortcuts. |

## Developer notes

### Auth shell

- Use the real app shell in `components/auth/auth-shell.tsx`; do not rebuild it per page.
- Left panel is hidden below `lg`; show the compact logo row instead.
- Keep the form card at `max-w-md` and center it on mobile.
- The background grid fades toward the bottom. Do not let it compete with the form.

### Login

- Email and password labels stay visible.
- The forgot-password link sits on the password label row, not below the field.
- On error, use the inline alert above the fields and keep the entered email.
- The submit button uses `pendingText="Signing in..."` and is disabled while pending.

### Register

- Display name is optional and marked with a small "Optional" hint.
- Password hint: "At least 6 characters".
- In development, show the role note in the card description so the team knows why a new
  account is a superadmin.
- Duplicate email is a card-level error with a clear message.

### Reset password

- The reset page has three states:
  1. **No session / expired link:** show the "This link has expired" card and a request button.
  2. **Valid recovery session:** show the two-password form.
  3. **Missing Supabase config:** show the configuration card.
- Do not show a reset form when there is no recovery session.
- The confirmation mismatch error belongs on the confirm field.

### Landing page

- The dark hero panel is the only very dark surface on the page.
- Keep the account card visible without scrolling on a 1440 × 900 screen.
- The sprint checklist uses a round check mark, not a colored bar, so it still reads in grayscale.
- The logout button lives in the navbar and is a form submit, not a client-side link.
- The role badge is text, not just color.

### Responsive rules

- 360 px: single column, 20 px gutter, auth card padding 24 px.
- 768 px: single column with wider card, landing cards stack to two columns.
- 1440 px: two-column auth shell; landing hero is 1.28fr / 0.72fr.

## Color and type references

The full token table is in [docs/design-system.md](../docs/design-system.md). The short version:

- Cream `#F7F3EA`, paper `#FFFDF8`, ink `#1C2321`.
- Clover `#166534` (primary), `#052E16` (deep panel), `#DCFCE7` (soft success).
- Coral `#EA580C` (error), `#FFEDD5` (soft error).
- Display: Fraunces. Body/UI: Manrope.

## Screenshots

The local app screenshots used for the demo backup are in `docs/screenshots/`. They are captured
from the running app, not redrawn, so they also catch spacing regressions.
