# Sprint 1 Test Report

## Summary

| Item | Result |
| --- | --- |
| Date | 2026-10-26 |
| Tester | Automated run with local Supabase and Chrome |
| App version | `main` working copy |
| Unit and component test files | 19 |
| Unit and component tests | 139 passed |
| Coverage | 90.88% statements, 82.52% branches, 87.05% functions |
| RLS integration tests | 7 passed against local Supabase |
| Browser E2E tests | 17 passed in Chrome |
| TypeScript | Passed |
| ESLint | Passed |
| Production build | Passed |
| Hosted Supabase integration | Not run; no hosted project credentials were provided |
| Human mockup comparison | Pending |

**Overall:** the automated unit, component, database, and browser layers pass. The app now has a real end-to-end regression for registration, login, logout, duplicate email, and a single-use password reset link. The remaining gap is a run against the team's hosted Supabase project with real email delivery.

## Commands run

```bash
npm run typecheck
npm run lint
npm run test:coverage
npm run build
npm run test:integration
npm run test:e2e
```

The integration and E2E suites used a local Supabase stack and the local `.env.local`. The production build used the same local public values.

## Automated results

| Suite | Tests | Result |
| --- | --- | --- |
| `tests/validation.test.ts` | 13 | Passed |
| `tests/auth-errors.test.ts` | 9 | Passed |
| `tests/auth-service.test.ts` | 17 | Passed |
| `tests/auth-actions.test.ts` | 12 | Passed |
| `tests/auth-routes.test.ts` | 12 | Passed |
| `tests/health.test.ts` | 4 | Passed |
| `tests/health-routes.test.ts` | 4 | Passed |
| `tests/utils.test.ts` | 10 | Passed |
| `tests/config.test.ts` | 7 | Passed |
| `tests/supabase-env.test.ts` | 8 | Passed |
| `tests/supabase-middleware.test.ts` | 4 | Passed |
| `tests/supabase-server.test.ts` | 4 | Passed |
| `tests/supabase-client.test.ts` | 2 | Passed |
| `tests/session.test.ts` | 11 | Passed |
| `tests/landing-view.test.tsx` | 2 | Passed |
| `tests/home-page.test.tsx` | 2 | Passed |
| `tests/reset-password-page.test.tsx` | 3 | Passed |
| `tests/auth-forms.test.tsx` | 10 | Passed |
| `tests/status-panel.test.tsx` | 5 | Passed |
| `tests/integration/rls.test.ts` | 7 | Passed |
| `e2e/auth.spec.ts` | 7 | Passed |
| `e2e/a11y.spec.ts` | 5 | Passed |
| `e2e/responsive.spec.ts` | 4 | Passed |
| `e2e/status.spec.ts` | 1 | Passed |

Coverage is measured across `app/`, `components/`, and `lib/`. The gate fails below 60% statements, branches, functions, or lines.

## What the automated suite covers

- Email normalization, validation, password rules, and mismatch handling.
- Registration, duplicate email, obfuscated duplicate, login, logout, reset request, and password update service calls.
- Server actions: redirects, email-confirmation branch, field-error passthrough, reset sign-out, and configuration failure.
- Auth routes: callback code exchange, provider errors, missing codes, token-hash verification, expired links, and safe `next` handling.
- Protected landing redirect and signed-in landing render.
- Session role resolution from app metadata, user metadata, and the `profiles` row, including fallbacks.
- Supabase URL validation: HTTPS, localhost HTTP, credentials, paths, queries, and hashes.
- Health helper states and both health route status codes and cache headers.
- Form rendering, server action error states, alert tones, status panel states, and responsive smoke.
- RLS: trigger-created profiles, own-row reads, admin reads and updates, blocked self-promotion, anon denial, and service-role access.
- Browser E2E: logged-out redirect, register, duplicate email, wrong password, login/logout, generic reset request, single-use recovery link, old-password rejection, new-password login, health endpoints, widths 360/768/1440, and critical axe violations.

## Test case status

| Group | Cases | Automated coverage | Hosted Supabase still needed |
| --- | --- | --- | --- |
| Registration | TC-REG-01 to TC-REG-05 | Unit, component, server action, and E2E | Real confirmation email |
| Login and logout | TC-LOG-01 to TC-LOG-04 | Unit, server action, and E2E session | Hosted cookie/session check |
| Password reset | TC-RST-01 to TC-RST-06 | Unit, route, and E2E single-use link | Real email delivery and timed expiry |
| Landing page | TC-LAND-01 to TC-LAND-03 | Page, component, E2E responsive | Human mockup comparison |
| Health and security | TC-HLT-01 to TC-SEC-02 | Health routes, E2E, RLS integration, CI secret scan | Hosted RLS and deployed bundle scan |

## Bugs found and fixed during the run

| ID | Severity | Description | Status |
| --- | --- | --- | --- |
| BUG-01 | S4 | The landing page test used a single-element query for a role label that intentionally appears twice. | Fixed in the test. |
| BUG-02 | S4 | The Vitest config emitted an ESM/CommonJS warning. | Fixed by renaming it to `vitest.config.mts`. |
| BUG-03 | S2 | The initial migration used unsupported `CREATE TYPE IF NOT EXISTS`, which would fail on Supabase. | Fixed with an idempotent `DO` block. |
| BUG-04 | S3 | The auth `next` path accepted backslash escapes that URL parsing could turn into an external origin. | Fixed with stricter validation and regression tests. |
| BUG-05 | S3 | A failed login clears the email field, so the user must retype it. The E2E test refills it before the retry. | Open; UX improvement. |

No S1 or S2 product bugs remain open.

## Known limitations

1. **The hosted Supabase project was not tested.** All integration and E2E checks ran against the local stack. Real email delivery, hosted redirect allow-list, and hosted RLS still need one run with the team's URL, anon key, and demo password.
2. **Email delivery is not exercised.** The reset E2E generates a recovery token through the Supabase admin API and verifies the single-use link. It does not read a mailbox.
3. **Visual comparison is partial.** Responsive checks prove no horizontal scroll at 360, 768, and 1440 px, and axe reports no critical violations. A human must still compare the screens with `design/mockups/`.
4. **Failed login clears the email field.** Recorded as BUG-05.
5. **Dev-only dependency advisories:** `npm audit --omit=dev` reports zero production vulnerabilities. `npm audit` reports three moderate advisories in the Tailwind 3/PostCSS build chain; clearing them requires a Tailwind 4 migration outside Sprint 1.

## Demo readiness

- [x] Unit and component checks pass.
- [x] Local Supabase RLS checks pass.
- [x] Browser E2E checks pass.
- [x] Health endpoints are covered.
- [x] Test cases and the testing guide are documented.
- [ ] Hosted Supabase walkthrough with the team's project.
- [ ] Final human rehearsal on the presentation machine.

## Recommendation

Run the hosted checklist once with `DEMO_PASSWORD` and the real Supabase project, then record the result here before Nov 9. If any hosted test fails, open a bug issue with the steps and a screenshot.
