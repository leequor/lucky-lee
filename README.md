# Patchwork

Repair-shop operations system for intake, repair tickets, customers, devices, parts, invoices, staff, and public repair tracking.

Built with Next.js 16, React 19, Tailwind CSS, Supabase Auth/Postgres/RLS, and a dependency-free 3D repair bench.

**Live:** <https://lucky-lee.vercel.app>

## What it does

- **Repair desk** — live counts, open queue, bench load, ready-for-pickup list, low stock, and paid revenue.
- **Tickets** — intake, diagnosis, priority, technician assignment, status workflow, notes, parts used, invoice, payment, and collection.
- **Customers & devices** — contact profiles, device history, and every repair attached to the person.
- **Inventory** — parts, SKU, stock, reorder levels, cost, price, supplier, and automatic stock movement when a part is attached to a repair.
- **Invoices** — labour + parts + 12% tax, unpaid/paid ledger, and payment marks the ticket collected.
- **Team** — owner, manager, technician roles; staff directory and role management; owner/manager can create confirmed staff accounts.
- **Public tracker** — customers check repair progress with the ticket's public code plus the email or phone on file. No account needed.
- **3D repair bench** — interactive exploded iPhone scene in the dashboard, auth shell, tracker, and status page.

## Stack

- **Next.js 16** App Router, React 19, TypeScript
- **Tailwind CSS** with the Patchwork tokens in [`tailwind.config.ts`](tailwind.config.ts)
- **Supabase Auth + Postgres** with row level security and security-definer RPCs
- **Three.js / React Three Fiber / drei** for the repair bench
- **Vitest + Testing Library** for unit/component tests
- **Playwright** for browser, responsive, and accessibility checks
- **GitHub Actions** for typecheck, lint, coverage, build, local Supabase RLS/E2E, and secret scanning

## Quick start

Requirements: Node.js 20.19+ and npm.

```bash
npm install
cp .env.example .env.local
```

Fill in the Supabase values, then apply the schema:

```bash
npx supabase link --project-ref <your-ref>
npx supabase db push
npm run seed:demo
npm run seed:repair
npm run dev
```

`npm run dev` is the single local run command. Open <http://localhost:3000>.

The app requires a session for the workspace and redirects to `/login` otherwise. The public tracker is at `/track`; the health check is at `/status`.

### Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser + server | Public anon key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Seed scripts and owner/manager staff creation. Never expose to the browser. |
| `NEXT_PUBLIC_SITE_URL` | Browser + server | Redirect URL used in auth emails. |
| `DEMO_PASSWORD` | Local only | Password for the three seeded demo accounts. |
| `NEXT_PUBLIC_DESIGN_PREVIEW` | Local only | Enables the `/design-preview/reset-password` screenshot route. |

`.env` and `.env.local` are ignored by git. No real keys or passwords belong in the repository.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the local Next.js server. |
| `npm run check:env` | Verify required Supabase environment variables without printing secrets. |
| `npm run seed:demo` | Create/update the three demo staff accounts. |
| `npm run seed:repair` | Seed customers, devices, parts, tickets, timelines, and invoices. |
| `npm run capture:mockups` | Capture the six design mockups from a running production build. |
| `npm test` | Run the Vitest suite. |
| `npm run test:coverage` | Run the unit suite with the coverage gate. |
| `npm run test:integration` | Run RLS and public-tracking checks against local Supabase. |
| `npm run test:e2e` | Run Playwright browser tests in Chrome. |
| `npm run typecheck` | Generate Next.js route types and run TypeScript. |
| `npm run lint` | Run ESLint. |
| `npm run build` | Create a production build. |
| `npm run db:push` | Push migrations with the Supabase CLI. |

## Demo accounts

The seed script creates these accounts. The password comes from `DEMO_PASSWORD` in `.env.local`.

| Email | Role |
| --- | --- |
| `alex@luckypatcher.test` | Owner |
| `admin@luckypatcher.test` | Manager |
| `user@luckypatcher.test` | Technician |

Public tracking uses the seeded ticket **PW-1041** with code **TRACK1041** and contact `maya.chen@example.com`.

## Data model

```
customers ──< devices ──< tickets ──< ticket_parts >── parts
                              │
                              ├──< ticket_events
                              └──  invoice
profiles ── assigned_to / created_by / actor
```

- `tickets` get a generated `PW-####` number and an unguessable public code.
- `ticket_parts` is the join between a repair and the parts it consumed.
- `invoices` store labour, parts, subtotal, tax, total, and payment state.
- `track_ticket(code, contact)` is a security-definer RPC that returns only customer-safe progress data.
- Staff access is protected by Supabase RLS; anonymous users can only read through the tracking RPC.

## Project structure

```text
app/
  (auth)/                 Invite-only login, recovery, reset
  (workspace)/            Protected repair desk
    page.tsx              Dashboard
    tickets/              List, intake, detail
    customers/            List, new, detail
    inventory/            Parts and stock
    invoices/             Invoice ledger
    team/                 Staff and roles
  track/                  Public repair tracker
  actions/auth.ts         Auth server actions
  actions/repair.ts       Repair workflow server actions
components/
  patchwork/              3D repair bench + canvas scene
  workspace/              App shell, UI, forms, cards
  auth/                   Auth shell, card, forms
  ui/                     Button, input, alert, logo
lib/
  repair/                 Types, queries, formatting, validation, session guards
  auth/                   Auth service, session, validation, errors
  supabase/               Browser/server clients
supabase/
  migrations/             Profiles, repair schema, invoice/sequence fixes
scripts/                  Seed, env check, screenshot capture
tests/                    Vitest suites
e2e/                      Playwright specs
```

## Team workflow

1. Pick an issue and move it to **In Progress**.
2. Create a branch from `main`; never work directly on `main`.
3. Open a PR and write `Closes #<issue number>`.
4. A teammate reviews it. One approval is required.
5. Merge after approval. The issue closes automatically.

## Rules

- Never commit keys, passwords, service-role keys, or `.env` files.
- Nobody approves their own PR.
- Every PR links to an issue and includes test evidence.
- Keep changes small enough for a teammate to review.

## Deployment

Production uses Supabase Auth/Postgres and Vercel. See [`docs/deployment.md`](docs/deployment.md) for environment variables, redirect URLs, migrations, seeding, and verification.

## Tests and evidence

- [Testing guide](docs/testing.md)
- [Test plan](docs/test-plan.md)
- [Test cases](docs/test-cases.md)
- [Test report](docs/test-report.md)
- [Security notes](docs/security.md)

```bash
npm run typecheck
npm run lint
npm run test:coverage
npm run build
npm run test:integration
npm run test:e2e
```

The integration and browser suites need a local Supabase stack. See [`docs/testing.md`](docs/testing.md).

## Design

- [Design system](docs/design-system.md)
- [Final mockups](design/mockups)
- [Design notes for the developer](design/README.md)

## Health endpoints

| Endpoint | Meaning |
| --- | --- |
| `GET /api/health` | The Next.js app is running. |
| `GET /api/health/supabase` | The configured Supabase Auth health endpoint responds. |

The `/status` page calls both endpoints in the browser and shows the result with latency.
