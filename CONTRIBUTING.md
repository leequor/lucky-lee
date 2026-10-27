# Contributing

Patchwork is a Next.js 16 + Supabase repair-shop app. Keep each change small enough for one reviewer to understand.

## Workflow

1. Pick an issue and move it to **In Progress**.
2. Branch from `main`; do not work directly on `main`.
3. Make the change and run the local checks below.
4. Open a pull request with `Closes #<issue>` in the description.
5. Get one teammate approval and a green CI run.
6. Merge, then delete the branch. The repository also auto-deletes merged head branches.

The repository ruleset protects `main`: pull requests are required, one approval is required, and the CI checks must pass.

## Local checks

```bash
npm run typecheck
npm run lint
npm run check:docs
npm test
npm run test:coverage
npm run build
```

The coverage gate is enforced in CI. The integration and browser suites need a local Supabase stack:

```bash
supabase start
npm run seed:demo
npm run seed:repair
npm run test:integration
npm run test:e2e
```

See [docs/testing.md](docs/testing.md) for the full setup and the CI layout.

## Database changes

- Never edit a migration that has already been applied. Add a new file in `supabase/migrations/` with the next timestamp.
- Apply locally and remotely with `npm run db:push`.
- Keep row level security in mind. Staff read the repair tables; managers and owners write inventory and invoices; only owners change owner roles. The database guard triggers in `202610270005_role_guards.sql` are part of that boundary.
- Run the RLS integration suite when policies or RPCs change.
- Never put the service-role key in browser code or in a `NEXT_PUBLIC_*` variable.

## Code map

| Area | Where |
| --- | --- |
| Routes and server actions | `app/` |
| Auth, workspace, and 3D components | `components/` |
| Data access, validation, formatting | `lib/` |
| Schema and RLS | `supabase/` |
| Seed and capture scripts | `scripts/` |
| Unit/component tests | `tests/` |
| Browser tests | `e2e/` |
| Mockups and design notes | `design/` |
| Current architecture and runbooks | `docs/` |

Server actions validate every field and return user-facing errors; do not rely on client-side validation alone. The 3D bench is client-only and must keep a text equivalent for every state.

## Pull requests

- Explain the user-visible change and the reason for it.
- Attach a screenshot or short recording for UI changes.
- Include test evidence and call out anything not automated.
- Update the README or `docs/` when behavior, setup, or permissions change.
- Keep secrets, real customer data, and service-role keys out of code, screenshots, PRs, and chat.

## Definition of done

The team Definition of Done is in [docs/working-agreement.md](docs/working-agreement.md).
