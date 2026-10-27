# Testing Guide

## Test layers

| Layer | Command | Needs Supabase | What it proves |
| --- | --- | --- | --- |
| Unit and component | `npm test` | No | Validation, auth service, server actions, routes, forms, session, health |
| Coverage gate | `npm run test:coverage` | No | Same suite plus 60% minimum statement, branch, function, and line coverage |
| RLS integration | `npm run test:integration` | Yes | Profile trigger, user/admin/anon policies, role update blocking |
| Browser E2E | `npm run test:e2e` | Yes | Register, login, logout, duplicate email, reset single-use link, health, responsive, accessibility |

The integration and E2E suites read `.env.local`. They skip or fail only when the local stack is missing.

## Local Supabase

```bash
npx supabase start
npx supabase db reset
```

`supabase status -o env` prints the local URL and keys. Put them in `.env.local`:

```text
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ANON_KEY>
SUPABASE_SERVICE_ROLE_KEY=<SERVICE_ROLE_KEY>
NEXT_PUBLIC_SITE_URL=http://localhost:3100
DEMO_PASSWORD=DemoPass123!
NEXT_PUBLIC_DESIGN_PREVIEW=true
```

Then seed and run:

```bash
npm run seed:demo
npm run test:integration
npm run test:e2e
```

E2E starts the app on port 3100 through Playwright. It uses installed Google Chrome locally and Playwright Chromium in CI. The suite uses the local Supabase Auth admin API to create isolated users and generate a one-time recovery token, so no real inbox is needed.

## Full local gate

```bash
npm run typecheck
npm run lint
npm run test:coverage
npm run build
npm run test:integration
npm run test:e2e
```

## CI layout

- **quality:** typecheck, lint, coverage, production build, coverage artifact.
- **e2e:** starts local Supabase, runs the RLS integration suite, then Playwright in Chromium.
- **security:** production dependency audit and TruffleHog secret scan.

## Not automated

- Real email delivery from a hosted Supabase project.
- Expiry timing on a hosted project.
- Pixel comparison against `design/mockups/`.
- Load and penetration testing.
