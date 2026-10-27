export const APP_NAME = "Lucky Patcher";
export const APP_TAGLINE = "A calmer control room for the work that matters.";
export const APP_DESCRIPTION =
  "Lucky Patcher is the Sprint 1 team dashboard for account access, roles, and release readiness.";

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configured) {
    return configured.replace(/\/$/, "");
  }

  const vercelUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || process.env.VERCEL_URL?.trim();

  if (vercelUrl) {
    return `https://${vercelUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
  }

  return "http://localhost:3000";
}

export function getAuthCallbackUrl(next = "/reset-password") {
  return `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(next)}`;
}
