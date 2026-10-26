export type AuthErrorContext = "login" | "register" | "reset" | "general";

const MESSAGE_RULES: Array<{ pattern: RegExp; message: string }> = [
  {
    pattern: /supabase is not configured|missing.*supabase|invalid.*supabase.*url/i,
    message:
      "Supabase is not configured. Copy .env.example to .env.local and add your project keys.",
  },
  {
    pattern: /invalid login credentials|invalid credentials/i,
    message: "Wrong email or password.",
  },
  {
    pattern: /email not confirmed|confirm your email/i,
    message: "Please confirm your email address before logging in.",
  },
  {
    pattern: /user already registered|already registered|duplicate/i,
    message: "Email already registered.",
  },
  {
    pattern: /password should be at least|password.*at least.*characters/i,
    message: "Password must be at least 6 characters long.",
  },
  {
    pattern: /auth session missing|session.*missing|invalid.*token|token.*expired|otp.*expired|link.*expired|expired.*link/i,
    message:
      "This reset link is invalid, expired, or has already been used. Request a new one.",
  },
  {
    pattern: /rate limit|too many requests/i,
    message: "Too many attempts. Please wait a minute and try again.",
  },
  {
    pattern: /fetch failed|failed to fetch|network|econnrefused|enotfound/i,
    message: "Unable to reach Supabase. Check your connection and environment settings.",
  },
];

export function mapAuthError(message: string | null | undefined, context: AuthErrorContext = "general") {
  const raw = String(message ?? "").trim();

  for (const rule of MESSAGE_RULES) {
    if (rule.pattern.test(raw)) {
      return rule.message;
    }
  }

  if (context === "login") {
    return "Unable to log in right now. Please try again.";
  }

  if (context === "register") {
    return "Unable to create the account right now. Please try again.";
  }

  if (context === "reset") {
    return "Unable to update the password right now. Please try again.";
  }

  return "Something went wrong. Please try again.";
}

export function isExpiredOrUsedLinkError(message: string | null | undefined) {
  return /expired|already.*used|invalid.*token|token.*invalid|auth session missing|session.*missing/i.test(
    String(message ?? ""),
  );
}
