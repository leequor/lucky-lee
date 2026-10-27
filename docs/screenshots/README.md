# Demo Screenshots

These screenshots are captured from the running Next.js app and are the backup for the Nov 9
presentation. They are not redrawn.

## Capture setup

- App: local production build (`npm run build` + `npm start`)
- Viewport: 1440 × 1000, full page
- Fonts: loaded from the app build
- Auth: hosted Supabase project; signed-in demo account for the landing page
- Reset form: local-only `/design-preview/reset-password` route
- Status: hosted Supabase health check, both rows ready
- Browser: system Chrome through Playwright; no dev overlay or browser chrome in the image
- Date: 2026-10-27

## Files

| File | Route shown | Notes |
| --- | --- | --- |
| `login.png` | `/login` | Public sign-in screen. |
| `register.png` | `/register` | Public account creation screen. |
| `forgot-password.png` | `/forgot-password` | Reset request screen. |
| `reset-password.png` | `/design-preview/reset-password` | Sample recovery session, marked as preview. |
| `landing-preview.png` | `/` | Real signed-in landing page with the regular demo user. |
| `status.png` | `/status` | App and hosted Supabase health checks, both ready. |

Hosted login, logout, password reset, reused-link rejection, and RLS have been verified separately.
Real email delivery to a real inbox remains the only manual email check.
