# Deploy on Vercel

Production path: Supabase for auth/Postgres, Vercel for the Next.js app.

## 1. Create the hosted Supabase project

1. Open <https://supabase.com/dashboard> and create a project.
2. Save the database password in a password manager.
3. Open **SQL Editor** and run the full contents of
   `supabase/migrations/202610260001_initial_schema.sql`.
4. Open **Project Settings → API** and copy:
   - Project URL
   - `anon` / publishable key
   - `service_role` key (only for seeding; never ship to the browser)

Do not commit these values.

## 2. Deploy the app

1. Open <https://vercel.com/new>.
2. Import `leequor/lucky-lee`.
3. Framework preset: **Next.js**. Leave build settings unchanged.
4. Add environment variables:

| Name | Value | Environments |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/publishable key | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | Final Vercel URL, no trailing slash | Production |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key for seed scripts and staff creation | Production, Preview |

`NEXT_PUBLIC_SITE_URL` is optional because the app falls back to Vercel's
`VERCEL_PROJECT_PRODUCTION_URL`. Set it explicitly once the final domain is known.

`SUPABASE_SERVICE_ROLE_KEY` is server-only. The app uses it for seed scripts and for owner/manager
staff creation from `/team`. Never expose it through a `NEXT_PUBLIC_*` variable or client bundle.

5. Click **Deploy**.
6. Copy the production URL, for example `https://lucky-lee.vercel.app`.

## 3. Configure Supabase redirects

In Supabase **Authentication → URL Configuration**:

- **Site URL:** `https://<your-vercel-domain>`
- **Redirect URLs:**
  - `https://<your-vercel-domain>/auth/callback`
  - `https://<your-vercel-domain>/auth/confirm`

Without these, confirmation and reset emails return to localhost.

## 4. Optional demo accounts

From a local clone with a temporary `.env.local`:

```text
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
DEMO_PASSWORD=<strong-demo-password>
```

Then:

```bash
npm run seed:demo
npm run seed:repair
```

Delete `.env.local` after seeding. Rotate the demo password after the presentation.

## 5. Verify

1. Open `https://<your-vercel-domain>/status`.
2. Both checks should be green.
3. Register a throwaway account, log out, log back in.
4. Request a password reset and open the email link.
5. Confirm the reset link works once and is rejected the second time.

## Email delivery

Hosted Supabase has rate-limited built-in email. For a reliable demo, configure
**Authentication → SMTP Settings** with a real SMTP provider, and set the reset template
described in [`supabase-setup.md`](supabase-setup.md).

## Rollback

Vercel keeps every deployment. Use **Deployments → previous deployment → Promote to
Production** to roll back without touching git.
