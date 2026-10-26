# Design Notes

This folder holds the Sprint 1 design artifacts. The implemented app is the source of truth;
the mockups are captured from it and serve as the visual reference for the presentation.

## Files

### Wireframes

| File | Screen | Notes |
| --- | --- | --- |
| `wireframes/login.svg` | Login | Original structure: email/password card, forgot-password link. |
| `wireframes/register.svg` | Register | Original structure: display name, email, password, sign-in link. |
| `wireframes/reset-password.svg` | Set a new password | Original structure: two password fields and expired-link state. |

The wireframes are historical planning artifacts. The shipped layout keeps the same form
structure inside the quiet product interface.

### Final mockups

| File | Screen | Notes |
| --- | --- | --- |
| `mockups/login.png` | Login | Centred 420 px card on the off-white ground. |
| `mockups/register.png` | Register | Adds the optional display name field. |
| `mockups/forgot-password.png` | Reset request | Single email field and generic success state. |
| `mockups/reset-password.png` | Set a new password | Preview of the valid recovery-session state. |
| `mockups/landing-preview.png` | Landing | Account panel, sprint checklist, environment summary. |
| `mockups/status.png` | System status | App and Supabase health rows with the runbook. |

## Developer notes

### Auth shell

- Use `components/auth/auth-shell.tsx`; do not rebuild it per page.
- Mark and status link on one row, form centred, quiet footer at the bottom.
- No split-screen statement panel, no cards inside cards.
- On mobile the card keeps a 24 px gutter and full-width fields.

### Login

- Email and password labels stay visible.
- The forgot-password link sits on the password label row.
- On error, use the flat alert above the fields and keep the entered email.
- The submit button uses `pendingText="Signing in..."` and is disabled while pending.

### Register

- Display name is optional and marked with a small "Optional" hint.
- Password hint: "At least 6 characters".
- Development signups receive superadmin so the team can test every screen.
- Duplicate email is a form-level error with a clear message.

### Reset password

- Three states:
  1. **No session / expired link:** show the "This link has expired" view with the request button.
  2. **Valid recovery session:** show the two-password form.
  3. **Missing Supabase config:** show the configuration view.
- Do not show a reset form when there is no recovery session.
- Confirmation mismatch error belongs on the confirm field.

### Landing page

- Title row names the page and who is signed in; the role tag is repeated from the navbar.
- Account panel uses one left edge and a two-column label/value grid.
- Checklist carries the only blue element in the product: the progress bar.
- Status tags use the dot plus the word, never colour alone.
- Logout is a form submit in the navbar.

### Responsive rules

- 390 px: single column, 24 px gutter, full-width cards, role and status action wrap under the title.
- 768 px: same single column with wider panels.
- 1440 px: 1080 px canvas, two-column account grid, three-cell environment strip.

## Color and type references

Full tokens are in [docs/design-system.md](../docs/design-system.md). Short version:

- Ground `#F7F7F7`, panel `#FFFFFF`, ink `#0A0A0A`, muted `#6B6B6B`, line `#E6E6E6`.
- Accent blue `#1D5FBF` for the sprint progress only.
- Ready green `#2E7D32` on `#DCFAE5`; error red `#C4242A` on `#FFEDEA`.
- Text: Geist. IDs and code: Geist Mono.

## Screenshots

`docs/screenshots/` contains the backup set captured from the running app. The same images are
copied to `design/mockups/` as the final visual reference.
