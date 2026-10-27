# Lucky Patcher

Sprint 1 account-access app for the Lucky Patcher team. It covers registration, login and
logout, password recovery, a protected landing page, Supabase profiles and roles, database
security, test evidence, and the Nov 9 presentation pack.

This is the working copy at [`leequor/lucky-lee`](https://github.com/leequor/lucky-lee). The
original repo, `leequor/Lucky-Patcher-`, is left untouched.

**Live demo:** <https://lucky-lee.vercel.app>

## Team

| Name | Role |
| --- | --- |
| Alexander R. Campita | Scrum Master / project lead |
| Ivanhoe V. Rabaca | DevSecOps |
| Ian Kenneth P. Rafanan | UI/UX |
| Rian D. Sabrido | Backend / full-stack |
| Jaymark A. De Guzman | QA |

## Stack

- **Next.js 16** with the App Router and React 19
- **Tailwind CSS** with the design tokens in [`tailwind.config.ts`](tailwind.config.ts)
- **Supabase Auth + Postgres** with `@supabase/ssr`
- **Vitest** and Testing Library for automated checks
- **GitHub Actions** for typecheck, lint, tests, and production build

## Quick start

Requirements: Node.js 20.19+ and npm.

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` using [`docs/supabase-setup.md`](docs/supabase-setup.md), then:

```bash
npm run check:env
npm run dev
```

`npm run dev` is the single local run command. Open <http://localhost:3000>. The app redirects
to `/login` until a Supabase session exists.

If Supabase is not configured, the public screens still render and the forms explain what is
missing. The database connection test is at <http://localhost:3000/status> and
`/api/health/supabase`.

### Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser + server | Public anon key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Demo seed script. Never expose it to the browser. |
| `NEXT_PUBLIC_SITE_URL` | Browser + server | Redirect URL used in auth emails. |
| `DEMO_PASSWORD` | Local only | Password for the three seeded demo accounts. |
| `NEXT_PUBLIC_DESIGN_PREVIEW` | Local only | Enables `/design-preview` for screenshots. |

`.env` and `.env.local` are ignored by git. No real keys or passwords belong in the repository.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the local Next.js server. |
| `npm run check:env` | Verify the required Supabase environment variables without printing secrets. |
| `npm run capture:mockups` | Capture the six design mockups from a running production build. |
| `npm test` | Run the Vitest suite. |
| `npm run test:watch` | Run Vitest in watch mode. |
| `npm run test:coverage` | Run the unit suite with the coverage gate. |
| `npm run test:integration` | Run RLS and profile trigger checks against local Supabase. |
| `npm run test:e2e` | Run Playwright browser tests in Chrome. |
| `npm run typecheck` | Generate Next.js route types and run TypeScript with `--noEmit`. |
| `npm run lint` | Run ESLint. |
| `npm run build` | Create a production build. |
| `npm run seed:demo` | Create or update the three demo accounts via the Supabase Admin API. |
| `npm run db:push` | Push migrations with the Supabase CLI. |

## Supabase setup

1. Read [`docs/supabase-setup.md`](docs/supabase-setup.md).
2. Run [`supabase/migrations/202610260001_initial_schema.sql`](supabase/migrations/202610260001_initial_schema.sql).
3. Add `http://localhost:3000/auth/callback` and `http://localhost:3000/auth/confirm` to the
   Supabase redirect allow-list.
4. Copy `.env.example` to `.env.local` and fill in the project values.
5. Run `npm run seed:demo` if you want the presentation accounts.
6. Open `/status` and confirm both health checks are green.

The password-reset flow uses **Supabase's built-in recovery links**. We intentionally did not
build a custom reset-token table. The reason and the recommended email template are in
[`docs/supabase-setup.md`](docs/supabase-setup.md).

## Demo accounts

The seed script creates these accounts. The password comes from `DEMO_PASSWORD` in `.env.local`.

| Email | Role |
| --- | --- |
| `alex@luckypatcher.test` | Superadmin |
| `admin@luckypatcher.test` | Admin |
| `user@luckypatcher.test` | User |

## Project structure

```text
app/
  (auth)/                 Login, register, forgot, reset pages
  actions/auth.ts         Server actions for every auth flow
  api/health/             App and Supabase health endpoints
  auth/callback/          Code exchange for Supabase email links
  auth/confirm/           Token-hash verification for custom email templates
  design-preview/         Local-only landing page preview for screenshots
  status/                 Human-readable connection check
  page.tsx                Protected landing page
components/
  auth/                   Auth shell, card, and forms
  landing/                Landing page and live status panel
  ui/                     Button, input, alert, logo, navbar, role badge
  visual/                 Dependency-free 3D canvas leaf field
lib/
  auth/                   Validation, error mapping, service calls, session helpers
  supabase/               Browser, server, and proxy clients
supabase/
  migrations/             Ordered SQL migrations
design/                   Wireframes, mockups, and design notes
docs/                     Setup, test, security, demo, and process documents
scripts/                  Env checker and demo seed script
tests/                    Vitest suites
```

## Team workflow

1. Pick an issue and move it to **In Progress**.
2. Create a branch from `main`; never work directly on `main`.
3. Open a PR and write `Closes #<issue number>`.
4. A teammate reviews it. One approval is required.
5. Merge after approval. The issue closes automatically and the card moves to Done.

Branch names use a short type prefix, for example `feat/login-page`, `fix/reset-error`, or
`docs/test-report`.

## Rules

- Never commit keys, passwords, service-role keys, or `.env` files.
- Nobody approves their own PR.
- Every PR links to an issue and includes test evidence.
- Keep changes small enough for a teammate to review.
- The Definition of Done is in [`docs/working-agreement.md`](docs/working-agreement.md).

## Deployment

Production uses Supabase Auth/Postgres and Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fleequor%2Flucky-lee&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&envDescription=Supabase%20project%20URL%20and%20anon%20key)

Exact steps, environment variables, auth redirect URLs, seeding, and verification are in
[`docs/deployment.md`](docs/deployment.md).

## Tests and evidence

- [Testing guide](docs/testing.md)
- [Test plan](docs/test-plan.md)
- [Test cases](docs/test-cases.md)
- [Test report](docs/test-report.md)
- [Security notes](docs/security.md)

Run everything locally with:

```bash
npm run typecheck
npm run lint
npm run test:coverage
npm run build
npm run test:integration
npm run test:e2e
```

The integration and browser suites need a local Supabase stack. See
[`docs/testing.md`](docs/testing.md) for the setup and the exact commands.

## Design

The shipped interface is the Lucky Vault system: a midnight-jade ground, a warm-white ink, one
jade accent, and a dependency-free 3D canvas leaf field on the auth, landing, status, and not-found
screens.

- [Design system](docs/design-system.md)
- [Wireframes](design/wireframes)
- [Final mockups](design/mockups)
- [Design notes for the developer](design/README.md)

## Presentation pack

- [Demo script and rehearsal log](docs/demo-script.md)
- [Sprint 1 issue status](docs/issue-status.md)
- Backup screenshots: `docs/screenshots/` (captured from the local app)

## Health endpoints

| Endpoint | Meaning |
| --- | --- |
| `GET /api/health` | The Next.js app is running. |
| `GET /api/health/supabase` | The configured Supabase Auth health endpoint responds. |

The `/status` page calls both endpoints in the browser and shows the result with latency.
