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
structure inside the Lucky Vault interface.

### Final mockups

| File | Screen | Notes |
| --- | --- | --- |
| `mockups/login.png` | Login | Split shell with the live 3D leaf field. |
| `mockups/register.png` | Register | Adds the optional display name field. |
| `mockups/forgot-password.png` | Reset request | Single email field and generic success state. |
| `mockups/reset-password.png` | Set a new password | Preview of the valid recovery-session state. |
| `mockups/landing-preview.png` | Landing | Hero, live 3D panel, sprint checklist, account card. |
| `mockups/status.png` | System status | App and Supabase health rows with the runbook. |

Regenerate the set from a running app with the Playwright capture script in `scripts/`.

## Developer notes

### Auth shell

- Use `components/auth/auth-shell.tsx`; do not rebuild it per page.
- Desktop: brand statement, 3D scene, and three security facts on the left; form on the right.
- Phone/tablet: logo row, 128 px 3D banner, centered form card, quiet footer.
- The form card is 440 px, 16 px radius, one column.

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

- Hero answers "are we ready?": title, identity, readiness figure, role tag, status action.
- The 3D panel is decorative; all state is repeated in text elsewhere.
- Checklist carries the jade progress bar.
- Status tags use the dot plus the word, never colour alone.
- Logout is a form submit in the navbar.

### Responsive rules

- 390 px: single column, 20 px gutter, stacked hero, full-width cards, 24 px app title.
- 768 px: single column with wider panels; nav keeps the email and role.
- 1440 px: 1120 px canvas, split hero, two-column checklist/account row, three-cell environment
  strip.

## Color and type references

Full tokens are in [docs/design-system.md](../docs/design-system.md). Short version:

- Ground `#060B09`, panel `#0D1512`, ink `#F1F4F0`, muted `#A0AEA6`, line `#1C2A24`.
- Accent jade `#4CE3A6` for progress, live state, and the role highlight.
- Gold `#E6C77B` only in the clover core.
- Ready jade `#4CE3A6` on `#0D2A20`; error `#F07A70` on `#2B1517`.
- Text: Geist. IDs and code: Geist Mono.

## The 3D scene

`components/visual/lucky-scene.tsx` draws four depth-sorted torus loops, a gold stem, a gold core,
and deterministic orbiting dust. It tilts with the pointer, pauses when the tab is hidden, and
renders one still frame for reduced-motion visitors. It has no runtime dependencies.

## Screenshots

`docs/screenshots/` contains the backup set captured from the running app. The same images are
copied to `design/mockups/` as the final visual reference.
