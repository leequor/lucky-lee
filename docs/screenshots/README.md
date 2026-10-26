# Demo Screenshots

These screenshots are captured from the running Next.js app and are the backup for the Nov 9
presentation. They are not design mockups.

## Capture setup

- App: local production build (`npm run build` + `npm start`)
- Viewport: 1440 px wide, full page
- Fonts: loaded from the app build
- Supabase URL: local mock endpoint used only to make the status screen show a connected state
- Auth: no real Supabase session; the reset form is captured through the
  local-only `/design-preview/reset-password` route
- Browser: system Chrome through Playwright; no dev overlay or browser chrome in the image
- Date: 2026-10-26

## Files

| File | Route shown | Notes |
| --- | --- | --- |
| `login.png` | `/login` | Public sign-in screen. |
| `register.png` | `/register` | Public account creation screen. |
| `forgot-password.png` | `/forgot-password` | Reset request screen. |
| `reset-password.png` | `/design-preview/reset-password` | Sample recovery session, clearly marked as a preview. |
| `landing-preview.png` | `/design-preview` | Protected landing layout with a sample superadmin account. |
| `status.png` | `/status` | App and Supabase health checks with the local mock connected. |

The real reset flow and the signed-in landing page still need one live Supabase walkthrough. The
technical screenshots prove the layout and component states are ready.
