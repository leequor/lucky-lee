# Sprint 1 Test Plan

## 1. Objective

Verify that a new user can register, log in, reach the protected landing page, log out, and
recover a forgotten password without exposing secrets or breaking the demo.

## 2. Scope

### In scope

- Registration with email and password.
- Duplicate email handling.
- Short-password and empty-field validation.
- Login with correct and incorrect credentials.
- Logout.
- Forgot-password request.
- Setting a new password from a valid link.
- Rejecting an expired or already-used link.
- Protected landing page with the signed-in email and logout control.
- App and Supabase health checks.
- RLS and role behavior for the `profiles` table.
- Responsive layout and visual consistency with the mockups.

### Out of scope

- Admin CRUD for users.
- Payment, email templates beyond the reset/confirmation flows, and production deployment.
- Load testing, penetration testing, and third-party OAuth providers.

## 3. Test environments

| Environment | Purpose | Notes |
| --- | --- | --- |
| Local Next.js + hosted Supabase project | Integration and demo | Requires `.env.local` and the migration. |
| Local Next.js + local Supabase stack | Automated integration and E2E | `npx supabase start`, seed, then Playwright. |
| Local UI with mocked auth service | Unit and component tests | No network required. |
| Production build | Build and type safety | Run with dummy public env values in CI. |

## 4. Entry criteria

- The migration has run and `profiles` has RLS enabled.
- `.env.local` has the Supabase URL and anon key.
- At least one confirmed demo user exists.
- `npm install` has completed.

## 5. Exit criteria

- All automated checks pass.
- Every test case in [test-cases.md](test-cases.md) has been run at least once.
- No open Severity 1 or Severity 2 bugs.
- The test report has a results summary and any known limitations.

## 6. Test data

| Data | Value |
| --- | --- |
| Superadmin demo | `alex@luckypatcher.test` |
| Admin demo | `admin@luckypatcher.test` |
| User demo | `user@luckypatcher.test` |
| Password | `DEMO_PASSWORD` from `.env.local` (not committed) |
| Short password | `abc` |
| Invalid email | `not-an-email` |
| Duplicate email | Run register twice with the same address. |

## 7. Feature pass/fail criteria

### Registration

**Pass when:**

- Email and password fields are present and labeled.
- A valid new user is created in Supabase Auth and a profile row appears.
- Duplicate email shows a clear message without a stack trace.
- A password shorter than six characters is rejected before submission.
- Empty fields show inline errors.

**Fail when:** any of the above is missing, a password is stored in a non-auth table, or an
unhandled error is shown.

### Login and logout

**Pass when:**

- Correct credentials reach `/` and show the signed-in email.
- Wrong credentials show a clear error and remain on `/login`.
- Logout returns to `/login` and the protected page redirects afterward.
- No password appears in logs or the database.

**Fail when:** a wrong password reaches the landing page, logout leaves a usable session, or
passwords are stored in plain text.

### Password reset

**Pass when:**

- Forgot-password accepts an email and reports a generic success.
- The email link opens the reset page with a valid session.
- A new password can be saved and used to log in.
- An expired, reused, or malformed link shows a clear rejection and a way to request another.
- The new password is at least six characters and matches confirmation.

**Fail when:** a used link still updates a password, the app leaks whether an email exists, or a
password is sent in a URL.

### Landing page

**Pass when:**

- A logged-out request to `/` redirects to `/login`.
- A logged-in user sees their email, role, and logout control.
- The page matches the final mockup in `design/mockups/landing.svg`.
- The layout works at 360 px, 768 px, and 1440 px widths.

**Fail when:** private account data is visible without a session, the email is missing, or the
logout control does not work.

### Database and security

**Pass when:**

- RLS is enabled on `profiles`.
- A user can read only their own profile.
- An admin can read profiles through the intended policy.
- The service-role key is absent from the client bundle and the repository.
- The `/status` page reports the configured Supabase project.

**Fail when:** RLS is off, the service-role key is exposed, or an unauthenticated request can read
profiles.

## 8. Test levels

1. **Unit tests:** validation, error mapping, auth service calls with mocked Supabase, server
   actions, route handlers, session helpers, environment validation, health checks, and page
   rendering.
2. **Component tests:** forms render the correct fields, alerts, field errors, and links; status
   panel states.
3. **Database integration:** RLS policies, profile trigger, role promotion blocking, and
   service-role behavior against local Supabase.
4. **Browser E2E:** register, login, logout, duplicate email, password reset single use, health,
   responsive widths, and critical accessibility checks in Chrome.
5. **Manual integration:** run against the real Supabase project using the demo accounts,
   including real email delivery.
6. **Visual check:** compare the app with the mockups at mobile and desktop widths.

## 9. Defect policy

| Severity | Example | Action |
| --- | --- | --- |
| S1 | Anyone can read all profiles or log in without a password | Stop, fix, re-test before demo. |
| S2 | Reset link can be reused or login is broken | Fix before demo. |
| S3 | Confusing message or spacing issue | Fix if time allows; record in the report. |
| S4 | Cosmetic suggestion | Backlog. |

Every bug gets an issue with steps to repeat, expected result, actual result, environment, and a
screenshot when useful.

## 10. Schedule

| Window | Activity |
| --- | --- |
| Oct 26–Nov 3 | Automated checks and feature-level manual tests. |
| Nov 4 | Feature freeze. |
| Nov 5–6 | Full regression, bug fixes, and test report. |
| Nov 7 | Demo rehearsal and backup screenshots. |

## 11. Risks

- No live Supabase credentials in the working environment; hosted integration cases must be run
  by a teammate with project access. Local Supabase covers the automated database and browser
  paths.
- Email delivery can be delayed or rate-limited.
- A used/expired link test needs a deliberately old link or a second request.
- The demo password must be set locally and never committed.

## 12. Traceability

The case IDs and their automated coverage are listed in [test-cases.md](test-cases.md). The run
results are in [test-report.md](test-report.md).
