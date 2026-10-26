# Supabase Setup

This guide gets the database, authentication, and demo accounts working from a clean machine.

## 1. Choose or create the project

Use the team's existing Supabase project if access is available. Otherwise create a new project
at <https://supabase.com/dashboard>.

You need three values from **Project Settings → API**:

- Project URL
- Anon/public key
- Service-role key (server-only)

The service-role key is for the demo seed script and server-side administration. Never put it in a
`NEXT_PUBLIC_` variable, a client component, or a committed file.

## 2. Create `.env.local`

```bash
cp .env.example .env.local
```

Fill it in:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR-SERVICE-ROLE-KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DEMO_PASSWORD=choose-a-local-demo-password
NEXT_PUBLIC_DESIGN_PREVIEW=false
```

Then check the public configuration without printing the values:

```bash
npm run check:env
```

## 3. Run the migration

The migration creates:

- `public.app_role` (`superadmin`, `admin`, `user`)
- `public.profiles`
- the `updated_at` trigger
- the `auth.users` → `profiles` trigger
- the `is_admin()` helper and RLS policies

### Option A — SQL editor

Open **SQL Editor** in the Supabase dashboard and paste the contents of
`supabase/migrations/202610260001_initial_schema.sql`. Run it once.

### Option B — Supabase CLI

```bash
npx supabase login
npx supabase link --project-ref YOUR-PROJECT-REF
npx supabase db push
```

The migration filename starts with a timestamp, so the CLI applies it in order. Future migrations
should use the same `YYYYMMDDHHMM_description.sql` pattern.

> If you changed an earlier migration after it was applied, create a new migration instead of
> editing history.

## 4. Configure auth redirects

In **Authentication → URL Configuration**:

- **Site URL:** `http://localhost:3000` for local work, or the deployed URL.
- **Redirect URLs:** add both:
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/auth/confirm`

Add the production equivalents when deploying.

## 5. Replace the reset email template

The app supports two link styles:

- `/auth/callback` exchanges a PKCE code.
- `/auth/confirm` verifies a token hash. This is the recommended cross-browser flow.

In **Authentication → Email Templates → Reset Password**, use:

```html
<h2>Reset your Lucky Patcher password</h2>
<p>Use the link below to choose a new password. The link expires and can only be used once.</p>
<p>
  <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password">
    Choose a new password
  </a>
</p>
<p>If you did not request this, you can ignore this email.</p>
```

For the **Confirm signup** template, use the same pattern with `type=signup`:

```html
<p>
  <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup&next=/">
    Confirm your email
  </a>
</p>
```

The app's `/auth/confirm` route validates the token hash, creates the session, and rejects
expired or already-used links with a clear message.

### Why there is no custom reset-token table

Issue #32 allowed the team to skip a custom token table if Supabase's built-in reset was used.
That is the decision here. Supabase owns token generation, hashing, expiry, and single-use
enforcement, which is safer than a hand-rolled table. The reason is recorded in
[issue-status.md](issue-status.md).

## 6. Seed the demo accounts

With `SUPABASE_SERVICE_ROLE_KEY` and `DEMO_PASSWORD` in `.env.local`:

```bash
npm run seed:demo
```

The script creates or updates:

| Email | Role |
| --- | --- |
| `alex@luckypatcher.test` | `superadmin` |
| `admin@luckypatcher.test` | `admin` |
| `user@luckypatcher.test` | `user` |

It also upserts the matching `profiles` rows. The password is never printed. If the script cannot
find the `profiles` table, run the migration first.

## 7. Verify the connection

```bash
npm run dev
```

Open:

- <http://localhost:3000/api/health> — the app.
- <http://localhost:3000/api/health/supabase> — the project.
- <http://localhost:3000/status> — a human-readable view of both.

A healthy Supabase response looks like:

```json
{
  "service": "supabase",
  "status": "connected",
  "latencyMs": 120
}
```

`not_configured` means `.env.local` is missing values. `unavailable` means the URL/key is set but
the project did not respond.

## 8. Test the flows

1. Open `/register` and create a new account.
2. Check Supabase **Authentication → Users** and the `profiles` table.
3. Log in, confirm the landing page shows your email, then log out.
4. Request a reset link, open it, set a new password, and log in with the new password.
5. Open the same reset link again and confirm it is rejected.
6. Open `/status` and confirm both rows are green.

## 9. Role and RLS notes

- The migration enables RLS on `profiles`.
- Users can read only their own profile.
- Admin and superadmin can read all profiles.
- There is no client-side "update my own role" policy.
- New sign-ups in development get `superadmin` from the server action metadata. This is a
  development convenience. Before production, change signup to default to `user` and provision
  roles server-side (see [security.md](security.md)).

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Supabase is not configured` | Copy `.env.example` to `.env.local`, fill the public values, restart `npm run dev`. |
| `relation "profiles" does not exist` | Run the migration in the SQL editor or with `supabase db push`. |
| Reset link goes to the wrong host | Set `NEXT_PUBLIC_SITE_URL` and the Supabase Site URL to the same value. |
| `Invalid redirect URL` | Add `/auth/callback` and `/auth/confirm` to the redirect allow-list. |
| Reset link says expired | It was used already or the email is older than the configured expiry. Request a new one. |
| Seed script says permission denied | Use the service-role key, not the anon key, and keep it in `.env.local`. |
| RLS hides rows unexpectedly | Check the signed-in user's role in `profiles` and the `is_admin()` function. |
