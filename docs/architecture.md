# Architecture

## Overview

Lucky Patcher is a single Next.js App Router application. Supabase provides authentication,
Postgres, and row level security. There is no separate Express server in the final working copy;
the earlier backend prototype is preserved in the copied branches, and its validation and error
handling ideas were ported into the tested TypeScript service layer.

```text
Browser
  │
  ├─ Next.js App Router (server components + client forms)
  │     ├─ Server actions → Supabase Auth / profiles
  │     ├─ /api/health → app health
  │     └─ /api/health/supabase → REST health
  │
  └─ @supabase/ssr cookies ←→ Supabase Auth
                                  │
                                  └─ Postgres: public.profiles + RLS
```

## Request flow

### Registration

1. `/register` renders the client form.
2. The form calls `registerAction` on the server.
3. `registerWithPassword` validates, normalizes the email, and calls
   `supabase.auth.signUp`.
4. The database trigger inserts a `profiles` row.
5. If email confirmation is off, the action redirects to `/`; otherwise it returns a
   "check your email" message.

### Login

1. `/login` submits `loginAction`.
2. `loginWithPassword` calls `supabase.auth.signInWithPassword`.
3. `@supabase/ssr` writes the session cookies.
4. The action redirects to `/`.
5. `/` reads the user on the server and renders the landing page.

### Logout

1. `logoutAction` calls `supabase.auth.signOut()`.
2. Session cookies are cleared.
3. The action redirects to `/login`.

### Password recovery

1. `/forgot-password` calls `forgotPasswordAction`.
2. The server calls `supabase.auth.resetPasswordForEmail` with a redirect to
   `/auth/callback?next=/reset-password`.
3. The recommended email template sends the user to `/auth/confirm?token_hash=...&type=recovery`.
4. `/auth/confirm` calls `verifyOtp`, creates the session, and redirects to `/reset-password`.
5. The reset form calls `resetPasswordAction` → `updateUser({ password })`.
6. The action signs out and redirects to `/login?message=...`.

The older `/auth/callback` code exchange is also supported for PKCE email links.

## Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Signed in | Protected landing page. Redirects to `/login` without a session. |
| `/login` | Public | Email/password sign-in. |
| `/register` | Public | Create an account. |
| `/forgot-password` | Public | Request a reset link. |
| `/reset-password` | Recovery session | Set a new password, or show an expired-link message. |
| `/status` | Public | Human-readable health checks. |
| `/design-preview` | Local flag | Landing page preview for screenshots. 404 unless enabled. |
| `/auth/callback` | Public | Exchange a PKCE code for a session. |
| `/auth/confirm` | Public | Verify a token hash from a custom email template. |
| `/api/health` | Public | App health JSON. |
| `/api/health/supabase` | Public | Supabase REST health JSON. |

## Data model

```sql
public.profiles
  id          uuid primary key → auth.users(id)
  email       text not null
  full_name   text
  role        app_role not null default 'user'
  created_at  timestamptz not null default now()
  updated_at  timestamptz not null default now()
```

`app_role` values: `superadmin`, `admin`, `user`.

RLS:

- Users read their own row.
- Admins and superadmins read all rows.
- Admins and superadmins update rows.
- No client policy allows a user to change their own role.

## Environment handling

- `lib/supabase/env.ts` reads and validates the public URL/key.
- The URL must be HTTPS, or HTTP on localhost.
- Missing configuration produces a friendly message instead of a crash.
- Server-only keys are never imported by client code.
- The proxy skips session refresh when Supabase is not configured, so public pages still load.

## Security boundaries

| Boundary | Control |
| --- | --- |
| Browser → server | Server actions validate every field; no client-only trust. |
| Server → Supabase | Anon key + user session for normal work; service role only in the seed script. |
| Database | RLS on `profiles`; security-definer `is_admin()` helper. |
| Email links | Token hash or PKCE code exchange; expired/used links are rejected. |
| Secrets | `.env.local` is ignored; no service-role value in `NEXT_PUBLIC_*`. |

## Design decisions

1. **Next.js App Router instead of the Express prototype.** One command, one deployment unit, and
   server components can read the session without an extra API hop.
2. **Supabase Auth instead of a custom password table.** Hashing, email delivery, token expiry,
   and single-use enforcement are handled by the provider.
3. **Built-in password reset instead of issue #32's custom table.** The issue explicitly allowed
   this. It removes a class of token-handling bugs.
4. **Profiles table plus RLS.** It gives the app a place for role data without exposing auth
   internals.
5. **Development-only design preview.** `/design-preview` is gated by an environment flag and is
   not an auth bypass.

## Future work

- Admin user-management screen.
- Profile editing with a safe column-level update policy.
- Email confirmation on by default in production.
- Rate limiting and CAPTCHA on auth endpoints.
- Playwright E2E tests against a seeded Supabase project.
- Deployment pipeline and custom domain.
