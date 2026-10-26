# Design Notes

This folder holds the Sprint 1 design artifacts. The implemented app is the source of truth;
the mockups are the visual reference for the developer and the presentation.

## Files

### Wireframes

| File | Screen | Notes |
| --- | --- | --- |
| `wireframes/login.svg` | Login | Original structure: two-column auth shell, email/password, forgot-password link. |
| `wireframes/register.svg` | Register | Original structure: display name, email, password, sign-in link. |
| `wireframes/reset-password.svg` | Set a new password | Original structure: two password fields and expired-link state. |

The wireframes are historical planning artifacts. The shipped layout follows the same structure but
uses the high-vis design system.

### Final mockups

| File | Screen | Notes |
| --- | --- | --- |
| `mockups/login.png` | Login | Black statement panel, paper form, yellow primary action. |
| `mockups/register.png` | Register | Adds the optional display name field. |
| `mockups/forgot-password.png` | Reset request | Single email field and generic success state. |
| `mockups/reset-password.png` | Set a new password | Preview of the valid recovery-session state. |
| `mockups/landing-preview.png` | Landing | Protected dashboard with black account panel, checklist, shortcuts, system band. |
| `mockups/status.png` | System status | App and Supabase health rows with ready tags. |

## Developer notes

### Auth shell

- Use `components/auth/auth-shell.tsx`; do not rebuild it per page.
- Desktop: black statement panel left, paper form panel right.
- Mobile: statement and facts stack above the form. The form stays the focus below 640 px.
- No cards, shadows, gradients, or background grids.

### Login

- Email and password labels stay visible.
- The forgot-password link sits on the password label row, not below the field.
- On error, use the flat alert above the fields and keep the entered email.
- The submit button uses `pendingText="Signing in..."` and is disabled while pending.

### Register

- Display name is optional and marked with a small "Optional" hint.
- Password hint: "At least 6 characters".
- Development signups receive superadmin so the team can test every screen.
- Duplicate email is a form-level error with a clear message.

### Reset password

- Three states:
  1. **No session / expired link:** show the "This link has expired" view and request button.
  2. **Valid recovery session:** show the two-password form.
  3. **Missing Supabase config:** show the configuration view.
- Do not show a reset form when there is no recovery session.
- Confirmation mismatch error belongs on the confirm field.

### Landing page

- The black account panel is the only large dark surface in the body.
- Keep the account panel visible without scrolling on a 1440 × 900 screen.
- Checklist status uses text plus yellow/black fills, never color alone.
- Logout is a form submit in the navbar.
- Role tag is text, not just color.

### Responsive rules

- 360 px: single column, 20 px gutter, mobile nav target 44 px.
- 768 px: single column with wider form; landing sections stack.
- 1440 px: split auth shell; landing hero is 1.45fr / 0.55fr.

## Color and type references

Full tokens are in [docs/design-system.md](../docs/design-system.md). Short version:

- Paper `#F3F3EE`, surface `#FFFFFF`, ink `#0A0A0A`, muted `#57594F`.
- Signal yellow `#FFE500`; yellow tint `#FFFBE0`.
- Error red `#C62828`; error surface `#FDECEA`.
- Display/body: Bricolage Grotesque. Labels: Space Mono.

## Screenshots

`docs/screenshots/` contains the backup set captured from the running app. The same images are
copied to `design/mockups/` as the final visual reference.
