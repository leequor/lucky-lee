# Sprint 1 Test Report

## Summary

| Item | Result |
| --- | --- |
| Date | 2026-10-26 |
| Tester | Automated run + agent review |
| App version | `agent/finish-all-issues` working branch |
| Automated test files | 6 |
| Automated tests | 50 passed |
| TypeScript | Passed |
| ESLint | Passed |
| Production build | Passed |
| Visual backup screenshots | 6 captured from the production build; human mockup comparison pending |
| Live Supabase integration | Not run in this environment; no project credentials were provided |

**Overall:** the automated logic and UI checks pass. The remaining live checks are Supabase
project checks that need the team's real URL, anon key, and demo password.

## Commands run

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

The build used placeholder public values:

```text
NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=test-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Automated results

| Suite | Tests | Result |
| --- | --- | --- |
| `tests/validation.test.ts` | 13 | Passed |
| `tests/auth-errors.test.ts` | 9 | Passed |
| `tests/auth-service.test.ts` | 17 | Passed |
| `tests/health.test.ts` | 4 | Passed |
| `tests/utils.test.ts` | 5 | Passed |
| `tests/landing-view.test.tsx` | 2 | Passed |
| **Total** | **50** | **Passed** |

## What the automated suite covers

- Email normalization and validation.
- Password length and confirmation rules.
- Registration with normalized email and development role metadata.
- Duplicate-email handling, including Supabase's obfuscated empty-identities response.
- Login success, wrong password, and empty-field validation.
- Forgot-password validation and generic success behavior.
- Password update success, mismatch, and missing-session/expired-link handling.
- Logout.
- Supabase health check states: configured, not configured, unavailable, and network failure.
- Post-login redirect paths, including external, protocol-relative, backslash, and control-character attempts.
- Landing page email, role badge, logout control, checklist, and presentation shortcuts.

## Test case status

The detailed cases are in [test-cases.md](test-cases.md).

| Group | Cases | Automated coverage | Live Supabase still needed |
| --- | --- | --- | --- |
| Registration | TC-REG-01 to TC-REG-05 | 5 / 5 logic paths | Create user and duplicate email |
| Login and logout | TC-LOG-01 to TC-LOG-04 | 4 / 4 logic paths | Real session and logout |
| Password reset | TC-RST-01 to TC-RST-06 | 6 / 6 logic paths | Email delivery, one-time link, old password rejection |
| Landing page | TC-LAND-01 to TC-LAND-03 | TC-LAND-02 automated | Redirect and responsive visual check |
| Health and security | TC-HLT-01 to TC-SEC-02 | Health helper and routes | Real Supabase RLS and browser bundle scan |

## Bugs found and fixed during the run and final review

| ID | Severity | Description | Status |
| --- | --- | --- | --- |
| BUG-01 | S4 | The landing page test used a single-element query for a role label that intentionally appears twice. | Fixed in the test; suite is green. |
| BUG-02 | S4 | The Vitest config emitted an ESM/CommonJS warning. | Fixed by renaming it to `vitest.config.mts`. |
| BUG-03 | S2 | The initial migration used unsupported `CREATE TYPE IF NOT EXISTS`, which would fail on Supabase. | Fixed with an idempotent `DO` block. |
| BUG-04 | S3 | The auth `next` path accepted backslash escapes that URL parsing could turn into an external origin. | Fixed with stricter validation and five regression tests. |

No S1 product bugs were found. The final review caught one S2 migration bug and one S3
redirect-validation issue; both are fixed and recorded above.

## Known limitations

1. **Live Supabase credentials were not available.** The real email delivery, reset-link expiry,
   and RLS checks must be run by the team against the project. The exact steps are in
   [test-cases.md](test-cases.md) and [supabase-setup.md](supabase-setup.md).
2. **Email confirmation setting affects the registration result.** If confirmations are enabled,
   the app correctly shows a "check your email" message instead of redirecting.
3. **The password-reset email template should use the token-hash URL** documented in
   [supabase-setup.md](supabase-setup.md). The default implicit-flow link is less reliable across
   browsers.
4. **Visual checks are captured as screenshots**; a human should still compare them with the
   mockups on the presentation laptop. The status screenshot uses a local mock Supabase endpoint,
   so it proves the UI state but not live connectivity.
5. **Dev-only dependency advisories:** `npm audit --omit=dev` reports zero production
   vulnerabilities. `npm audit` reports three moderate advisories in the Tailwind 3/PostCSS build
   chain; clearing them requires a Tailwind 4 migration outside Sprint 1.

## Demo readiness

- [x] Automated checks pass.
- [x] Health endpoints exist and are covered.
- [x] Test cases are documented.
- [x] Demo script and backup screenshots are prepared.
- [ ] Live Supabase walkthrough with the team's project.
- [ ] Final human rehearsal on the presentation machine.

## Recommendation

Run the live checklist once with `DEMO_PASSWORD` and the real Supabase project, then record the
result in this report before Nov 9. If any live test fails, open a bug issue with the steps and a
screenshot.
