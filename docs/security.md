# Security Notes

A short explanation of what protects the app, what is a demo convenience, and what must change before a public production launch.

## 1. Authentication

- Supabase Auth owns the user record, password hashing, and recovery emails.
- The app never stores a password in its own tables.
- Sessions are kept in cookies by `@supabase/ssr`; the proxy refreshes them on navigation.
- Protected pages call `getCurrentUser()` on the server and redirect to `/login` when there is no valid session.
- Public registration is disabled. `/register` is an invitation-only explanation; staff accounts are created from `/team` by an owner or manager through a server action that uses the service-role key.

## 2. Staff access and RLS

Every staff account is created through the `/team` action, not through public signup. The action validates the email, temporary password, and role, creates a confirmed Supabase user, and writes the profile.

| Boundary | Policy |
| --- | --- |
| `profiles` select | Any authenticated staff member can read the directory. |
| `profiles` update | Owner/manager can update profiles. A trigger blocks non-owners from changing owner roles and blocks demoting the last owner. |
| `customers`, `devices`, `tickets`, `ticket_events`, `ticket_parts` | Authenticated staff can work the shop. |
| `parts`, `invoices` select | Any authenticated staff member can read. |
| `parts`, `invoices` write | Owner/manager only. Technicians use `add_ticket_part`; billing RPCs are manager/owner-only. |
| `track_ticket` | Anonymous RPC; requires a tracking code plus the matching email or phone. |

`public.is_admin()` is a `security definer` function with a fixed `search_path`. It avoids recursive RLS checks and is executable by authenticated users only.

The role guard is in `supabase/migrations/202610270005_role_guards.sql`; the billing RPC guard is in `202610270007_billing_rpc_guards.sql`; the tracker contact guard is in `202610270006_track_phone_guard.sql`. They are enforced for direct API calls as well as the UI.

## 3. Roles

| Role | Database value | Can do |
| --- | --- | --- |
| Owner | `superadmin` | Everything, including owner roles and staff accounts. |
| Manager | `admin` | Tickets, customers, inventory, invoices, and non-owner staff roles. |
| Technician | `user` | Day-to-day tickets and customer work; read-only inventory and invoices. |

Enforcement exists at three levels:

1. The team UI hides owner-only controls from managers and all management controls from technicians.
2. Server actions require staff, manager, or owner as appropriate before calling the database.
3. RLS policies and the profile role trigger reject direct API attempts that bypass the UI.

Technicians can still add parts to a ticket and update ticket status. The security-definer billing RPCs are guarded by a database trigger, so a technician cannot create or collect an invoice by calling the API directly. Marking a ticket **Picked up** requires a paid invoice; the status action rejects it otherwise.

## 4. Public tracking

- `/track` accepts the tracking code plus the email or phone on file. No customer account is needed.
- `track_ticket(code, contact)` returns only the ticket number, status, issue, device, first name, and customer-visible timeline events.
- It never returns the address, payment details, internal notes, or staff-only fields.
- A contact with no digits does not match a customer with no phone stored.
- There is no rate limiting on the public RPC yet. Add edge rate limiting before a public launch.

## 5. Password reset

- The app uses Supabase's built-in recovery flow.
- No custom reset-token table is created. Supabase stores and expires the token.
- The recommended email template uses `{{ .TokenHash }}` and `/auth/confirm`, so the link works across browsers and a used/expired token is rejected.
- The app shows the same generic success message whether or not an email exists, which avoids account enumeration.

## 6. Secrets

| Secret | Where it may live |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser bundle and server. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser bundle and server. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server/script only. Never commit it. |
| `DEMO_PASSWORD` | Local `.env.local` only. |
| Supabase database password | Password manager / Supabase dashboard only. |

`.env` and `.env.local` are in `.gitignore`. `.env.example` contains placeholders only. The service-role key bypasses RLS, so it must never be imported into a client component or exposed through a `NEXT_PUBLIC_` variable.

## 7. Demo accounts

The seed script uses the Admin API with the service-role key and creates three confirmed users: owner, manager, and technician. The password is read from `DEMO_PASSWORD` and is not printed or committed. Rotate the demo password after any public demonstration and remove the demo accounts before a real launch.

## 8. Production checklist

- [x] Invite-only staff accounts.
- [x] Server-side role provisioning.
- [x] RLS for repair tables and manager/owner write policies.
- [x] Owner role guard and last-owner protection.
- [x] Public tracking allow-list and contact guard.
- [ ] Configure custom SMTP and the token-hash reset template.
- [ ] Set the Supabase Site URL and redirect allow-list to the production domain.
- [ ] Add rate limiting to `/track` and auth endpoints.
- [ ] Rotate demo credentials and remove demo users.
- [ ] Enable Supabase audit logs if available on the plan.
- [ ] Run a secret scan on the final repository and the deployed bundle.

## 9. Reporting a leak

1. Stop using the exposed key.
2. Rotate it in Supabase.
3. Remove it from git history if it was committed (rewrite history or use the provider's secret-scanning guidance).
4. Open a security issue with the scope of exposure and the rotation date.
5. Re-run the tests and the health check.
