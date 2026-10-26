# Sprint 1 Test Cases

Test cases are grouped by feature. The **Coverage** column points to the automated test that
exercises the logic, or marks the case as a manual Supabase integration check.

## Registration

### TC-REG-01 — Empty registration form

**Steps**
1. Open `/register`.
2. Leave email, display name, and password empty.
3. Submit.

**Expected:** The form stays on the page. Email shows "Email is required." Password shows
"Password is required." No Supabase request is sent.

**Coverage:** `tests/validation.test.ts` → registration validation.

### TC-REG-02 — Invalid email

**Steps**
1. Open `/register`.
2. Enter `not-an-email`.
3. Enter a valid password.
4. Submit.

**Expected:** Email shows "Please enter a valid email address." No user is created.

**Coverage:** `tests/validation.test.ts` → email validation.

### TC-REG-03 — Short password

**Steps**
1. Open `/register`.
2. Enter a new email.
3. Enter `abc`.
4. Submit.

**Expected:** Password shows "Password must be at least 6 characters long." No Supabase request
is sent.

**Coverage:** `tests/validation.test.ts` and `tests/auth-service.test.ts`.

### TC-REG-04 — Successful registration

**Steps**
1. Open `/register`.
2. Enter a display name, a new email, and a password of at least six characters.
3. Submit.

**Expected:** The account is created in Supabase Auth. If email confirmation is disabled, the
user lands on `/`; otherwise the page says to check email. A profile row exists with the default
development role.

**Coverage:** `tests/auth-service.test.ts` → registration success and role metadata;
`e2e/auth.spec.ts` → registration and landing redirect. Hosted email confirmation is manual.

### TC-REG-05 — Duplicate email

**Steps**
1. Register with an email that already exists.
2. Submit.

**Expected:** A clear "Email already registered." message appears. No second account is created.

**Coverage:** `tests/auth-service.test.ts`, `tests/auth-errors.test.ts`, and
`e2e/auth.spec.ts` → duplicate email. Hosted Supabase check is manual.

## Login and logout

### TC-LOG-01 — Valid login

**Steps**
1. Open `/login`.
2. Enter a confirmed demo email and its password.
3. Submit.

**Expected:** The browser reaches `/`, the landing page shows the same email, and the session
cookie is present.

**Coverage:** `tests/auth-service.test.ts` → login success; `e2e/auth.spec.ts` → login and
session. Hosted Supabase check is manual.

### TC-LOG-02 — Wrong password

**Steps**
1. Open `/login`.
2. Enter a valid email and the wrong password.
3. Submit.

**Expected:** The page stays on `/login` and shows "Wrong email or password." The password is not
echoed back.

**Coverage:** `tests/auth-service.test.ts` and `tests/auth-errors.test.ts`;
`e2e/auth.spec.ts` → wrong password. Hosted Supabase check is manual.

### TC-LOG-03 — Empty login fields

**Steps**
1. Open `/login`.
2. Submit with both fields empty.

**Expected:** Inline errors appear for email and password. No request is sent.

**Coverage:** `tests/validation.test.ts` → login validation.

### TC-LOG-04 — Logout

**Steps**
1. Log in.
2. On `/`, click **Log out**.
3. Try to open `/` again.

**Expected:** Logout returns to `/login`. Opening `/` redirects back to `/login` and no private
data is rendered.

**Coverage:** `tests/auth-service.test.ts` → logout; `tests/landing-view.test.tsx` → logout
control; `e2e/auth.spec.ts` → login, logout, and protected redirect. Hosted session check is
manual.

## Password reset

### TC-RST-01 — Forgot password with an invalid email

**Steps**
1. Open `/forgot-password`.
2. Enter `not-an-email`.
3. Submit.

**Expected:** The email field shows a validation message. No reset email is requested.

**Coverage:** `tests/auth-service.test.ts` and `tests/validation.test.ts`.

### TC-RST-02 — Forgot password with a valid email

**Steps**
1. Open `/forgot-password`.
2. Enter the email for a demo account.
3. Submit.

**Expected:** A generic success message appears. The app does not reveal whether the address
exists. A Supabase reset email is sent when the account exists.

**Coverage:** `tests/auth-service.test.ts` → reset request and unknown-email behavior. Email
delivery is a manual Supabase check.

### TC-RST-03 — New password mismatch

**Steps**
1. Open a valid reset link.
2. Enter two different new passwords.
3. Submit.

**Expected:** The confirm field shows "Passwords do not match." No password update is sent.

**Coverage:** `tests/validation.test.ts` → reset validation.

### TC-RST-04 — Set a new password

**Steps**
1. Open a valid reset link.
2. Enter a new password of at least six characters in both fields.
3. Submit.
4. Log in with the new password.

**Expected:** The password is updated, the old password no longer works, and the new password
works. The user is sent to `/login` with a success message.

**Coverage:** `tests/auth-service.test.ts` → update password success; `e2e/auth.spec.ts` →
single-use recovery link, old password rejection, and new password login. Hosted Supabase check
is manual.

### TC-RST-05 — Expired or already-used link

**Steps**
1. Request a reset link.
2. Use it once to set a password.
3. Open the same link again.

**Expected:** The app rejects the link with "This reset link is invalid, expired, or has already
been used. Request a new one." and offers a new request.

**Coverage:** `tests/auth-errors.test.ts`, `tests/auth-service.test.ts` → missing session;
`e2e/auth.spec.ts` → reused link. Hosted link expiry is a manual Supabase check.

### TC-RST-06 — Empty new password

**Steps**
1. Open a valid reset link.
2. Leave both password fields empty and submit.

**Expected:** Both fields show validation errors. No update request is sent.

**Coverage:** `tests/validation.test.ts`.

## Landing page

### TC-LAND-01 — Logged-out access

**Steps**
1. Clear the session or use a private window.
2. Open `/`.

**Expected:** The browser redirects to `/login`. No profile or email is rendered.

**Coverage:** `tests/home-page.test.tsx` → redirect; `e2e/auth.spec.ts` → logged-out browser
access.

### TC-LAND-02 — Logged-in access

**Steps**
1. Log in.
2. Open `/`.

**Expected:** The page shows the signed-in email, role badge, account details, sprint checklist,
and a working **Log out** button.

**Coverage:** `tests/landing-view.test.tsx` and `e2e/auth.spec.ts` → signed-in landing page.

### TC-LAND-03 — Responsive visual check

**Steps**
1. Open the login, register, reset, and landing screens.
2. Check at 360 px, 768 px, and 1440 px widths.

**Expected:** No horizontal scroll. Forms remain readable. Buttons are reachable. The design
matches `design/mockups/`.

**Coverage:** `e2e/responsive.spec.ts` → 360, 768, and 1440 px; `e2e/a11y.spec.ts` → critical
violations. Human mockup comparison remains manual.

## Health and security

### TC-HLT-01 — App health endpoint

**Steps**
1. Start the app.
2. Open `/api/health`.

**Expected:** HTTP 200 with `{"status":"ok","service":"web",...}` and no cache.

**Coverage:** `tests/health-routes.test.ts` and `e2e/status.spec.ts`.

### TC-HLT-02 — Supabase health endpoint

**Steps**
1. Configure `.env.local`.
2. Open `/status` or `/api/health/supabase`.

**Expected:** `connected` with a latency value when the project responds. If keys are missing, a
clear `not_configured` message; if the project is down, `unavailable`.

**Coverage:** `tests/health.test.ts`, `tests/health-routes.test.ts`, and `e2e/status.spec.ts`;
hosted project check is manual. The check calls `/auth/v1/health`, which is public. The REST root
requires a service-role key on hosted projects and is not used.

### TC-SEC-01 — RLS smoke test

**Steps**
1. Sign in as the regular demo user.
2. Query `profiles` with the anon client.
3. Confirm only the user's own row is returned.
4. Sign in as the admin demo user and confirm the admin policy works.

**Expected:** No unauthorized rows are visible. The service-role key is never used in the browser.

**Coverage:** `tests/integration/rls.test.ts` against local Supabase. Hosted RLS check remains
manual using the migration in `supabase/migrations/`.

### TC-SEC-02 — Secret scan

**Steps**
1. Search the tracked files for `service_role`, `SUPABASE_SERVICE_ROLE_KEY`, and password values.
2. Inspect the built `.next/static` bundle for the service-role key.

**Expected:** Only `.env.example` placeholders and documentation references exist. The
service-role key is absent from the browser bundle.

**Coverage:** CI runs TruffleHog on every push; the deployed browser bundle scan remains manual.
