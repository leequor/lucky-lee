# Security Notes

This is the short explanation for the demo. It covers what protects the app, what is a
development convenience, and what must change before production.

## 1. Authentication

- Supabase Auth owns the user record, password hashing, and recovery emails.
- The app never stores a password in its own tables.
- Sessions are kept in cookies by `@supabase/ssr`; the proxy refreshes them on navigation.
- Protected pages call `getCurrentUser()` on the server and redirect to `/login` when there is no
  valid session.

## 2. Database access

The migration in `supabase/migrations/202610260001_initial_schema.sql` enables RLS on
`public.profiles`.

| Policy | Who | What it allows |
| --- | --- | --- |
| `profiles_select_own` | Authenticated user | Read their own profile row. |
| `profiles_select_admin` | Admin / superadmin | Read all profile rows. |
| `profiles_update_admin` | Admin / superadmin | Update profile rows. |

There is intentionally no "update own profile" policy in Sprint 1. A user cannot change their own
role through the client.

`public.is_admin()` is a `security definer` function with a fixed `search_path`. It avoids
recursive RLS checks and is executable by authenticated users only.

## 3. Roles

| Role | Sprint 1 meaning |
| --- | --- |
| `user` | Standard access. |
| `admin` | Can read and update profiles. |
| `superadmin` | Development/demo administrator. |

**Development convenience:** new accounts get `superadmin` in development so the team can test
every screen. The role is stored in auth user metadata and copied into `profiles` by a trigger.
Production must not trust client-supplied role metadata; provision roles server-side or with an
admin-only workflow. This is called out in the migration comment and the production checklist.

## 4. Password reset

- The app uses Supabase's built-in recovery flow.
- No custom reset-token table is created. Supabase stores and expires the token.
- The recommended email template uses `{{ .TokenHash }}` and `/auth/confirm`, so the link works
  across browsers and a used/expired token is rejected.
- The app shows the same generic success message whether or not an email exists, which avoids
  account enumeration.

## 5. Secrets

| Secret | Where it may live |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser bundle and server. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser bundle and server. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server/script only. Never commit it. |
| `DEMO_PASSWORD` | Local `.env.local` only. |
| Supabase database password | Password manager / Supabase dashboard only. |

`.env` and `.env.local` are in `.gitignore`. `.env.example` contains placeholders only. The
service-role key bypasses RLS, so it must never be imported into a client component or exposed
through a `NEXT_PUBLIC_` variable.

## 6. Demo accounts

The seed script uses the Admin API with the service-role key and creates three confirmed users:
superadmin, admin, and regular user. The password is read from `DEMO_PASSWORD` and is not printed
or committed. Rotate the demo password after the presentation.

## 7. Production checklist

- [ ] Change the default signup role to `user` and stop trusting metadata roles.
- [ ] Add a server-side admin workflow for promoting users.
- [ ] Enable email confirmation.
- [ ] Configure custom SMTP and the token-hash reset template.
- [ ] Set the Supabase Site URL and redirect allow-list to the production domain.
- [ ] Review the RLS policies with a second person.
- [ ] Rotate demo credentials and remove demo users.
- [ ] Add rate limiting at the edge or auth provider.
- [ ] Run a secret scan on the final repository and the deployed bundle.
- [ ] Enable Supabase audit logs if available on the plan.

## 8. Reporting a leak

1. Stop using the exposed key.
2. Rotate it in Supabase.
3. Remove it from git history if it was committed (rewrite history or use the provider's secret
   scanning guidance).
4. Open a security issue with the scope of exposure and the rotation date.
5. Re-run the tests and the health check.
