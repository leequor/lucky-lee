export const APP_NAME = "Lucky Patcher";
export const APP_TAGLINE = "A calmer control room for the work that matters.";
export const APP_DESCRIPTION =
  "Lucky Patcher is the Sprint 1 team dashboard for account access, roles, and release readiness.";

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function getAuthCallbackUrl(next = "/reset-password") {
  return `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(next)}`;
}
