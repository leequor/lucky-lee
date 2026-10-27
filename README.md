# Patchwork

Repair-shop operations system for intake, repair tickets, customers, devices, parts, invoices, staff, and public repair tracking.

**Repository:** [leequor/lucky-patcher-finished](https://github.com/leequor/lucky-patcher-finished) · **Live:** <https://lucky-lee.vercel.app> — the deployment keeps the original Vercel project slug, `lucky-lee`.

Built with Next.js 16, React 19, Tailwind CSS, Supabase Auth/Postgres/RLS, and a procedural React Three Fiber teardown scene.

## Start here

| If you want to… | Read |
| --- | --- |
| Run the app locally | [Quick start](#quick-start) |
| Understand how it works | [Architecture](docs/architecture.md) |
| Deploy it | [Deployment](docs/deployment.md) |
| Understand permissions and security | [Security notes](docs/security.md) |
| Run or extend the tests | [Testing guide](docs/testing.md) |
| Work on the UI | [Design system](docs/design-system.md) · [Design notes](design/README.md) |
| Contribute a change | [CONTRIBUTING.md](CONTRIBUTING.md) |
| Browse every document | [Documentation index](docs/README.md) |

## What it does

- **Repair desk** — live counts, open queue, bench load, ready-for-pickup list, low stock, and paid revenue.
- **Tickets** — intake, diagnosis, priority, technician assignment, status workflow, notes, parts used, invoice, payment, and collection.
- **Customers & devices** — contact profiles, device history, and every repair attached to the person.
- **Inventory** — parts, SKU, stock, reorder levels, cost, price, supplier, and automatic stock movement when a part is attached to a repair.
- **Invoices** — labour + parts + 12% tax, unpaid/paid ledger, and payment marks the ticket collected.
- **Team** — owner, manager, and technician roles. Owners manage owner access; managers manage non-owner roles. Owners and managers create confirmed staff accounts.
- **Public tracker** — customers check repair progress with the tracking code from their receipt. No account, email, or phone needed.
- **3D teardown** — a three-layer display/chassis/back-panel scene with a live repair screen on the dashboard, auth shell, tracker, and status page.

## Stack

- **Next.js 16** App Router, React 19, TypeScript
- **Tailwind CSS** with the Patchwork tokens in [`tailwind.config.ts`](tailwind.config.ts)
- **Supabase Auth + Postgres** with row level security and security-definer RPCs
- **Three.js / React Three Fiber / drei** for the teardown scene
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

The app requires a session for the workspace and redirects to `/login` otherwise. The public tracker is at `/track`; the health page is at `/status`.

### Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser + server | Public anon key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Seed scripts and staff creation. Never expose to the browser. |
| `NEXT_PUBLIC_SITE_URL` | Browser + server | Redirect URL used in auth emails. |
| `DEMO_PASSWORD` | Local only | Password for the three seeded demo accounts. |
| `NEXT_PUBLIC_DESIGN_PREVIEW` | Local only | Enables the `/design-preview/reset-password` screenshot route. |

`.env` and `.env.local` are ignored by git. No real keys or passwords belong in the repository.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the local Next.js server. |
| `npm run check:env` | Verify required Supabase environment variables without printing secrets. |
| `npm run check:docs` | Verify relative links in the documentation. |
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

Public tracking uses the seeded ticket **PW-1041** with tracking code **TRACK1041**. The code is the only input.

## Data model

```text
customers ──< devices ──< tickets ──< ticket_parts >── parts
                              │
                              ├──< ticket_events
                              └──  invoice
profiles ── assigned_to / created_by / actor
```

- `tickets` get a generated `PW-####` number and an unguessable tracking code.
- `ticket_parts` is the join between a repair and the parts it consumed.
- `invoices` store labour, parts, subtotal, tax, total, and payment state.
- `track_ticket(code)` is a security-definer RPC that returns only customer-safe progress data. It accepts the random tracking code, not the sequential `PW-` number.
- Staff read the repair tables through RLS; managers and owners write inventory and invoices. Anonymous users only reach the tracking RPC.

## Repository map

```text
app/                       Next.js routes and server actions
  (auth)/                  Login, invite-only access, recovery, reset
  (workspace)/             Protected repair desk
    page.tsx               Dashboard
    tickets/               List, intake, detail
    customers/             List, new, detail
    inventory/             Parts and stock
    invoices/              Invoice ledger
    team/                  Staff and roles
  track/                   Public repair tracker
  status/                  Health page
components/                Auth, workspace UI, and the 3D teardown
lib/                       Auth, data access, formatting, validation, session guards
supabase/                  Schema migrations and local Supabase config
scripts/                   Seed, environment check, screenshot capture
tests/                     Vitest unit and component suites
e2e/                       Playwright specs
design/                    Wireframes, final mockups, design notes
docs/                      Architecture, deployment, security, testing, design system
```

## Documentation

The full index is in [`docs/README.md`](docs/README.md). The current-system documents are:

- [Architecture](docs/architecture.md)
- [Deployment](docs/deployment.md)
- [Security notes](docs/security.md)
- [Supabase setup](docs/supabase-setup.md)
- [Testing guide](docs/testing.md)
- [Test report](docs/test-report.md)
- [Design system](docs/design-system.md)

Sprint 1 process and evidence documents live alongside them and are marked as historical where relevant.

## Contributing

All changes go through a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md) for the branch/PR workflow, test gate, migration rules, and repository conventions.

## Deployment

Production uses Supabase Auth/Postgres and Vercel. See [`docs/deployment.md`](docs/deployment.md) for environment variables, redirect URLs, migrations, seeding, and verification.

The live deployment is <https://lucky-lee.vercel.app>. The Vercel project slug predates the repository rename and is intentionally unchanged.

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
