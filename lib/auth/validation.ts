import type { AuthFieldErrors } from "./types";

export const MIN_PASSWORD_LENGTH = 6;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; fieldErrors: AuthFieldErrors };

export function normalizeEmail(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

export function validateEmail(email: string) {
  if (!email) {
    return "Email is required.";
  }

  if (!EMAIL_PATTERN.test(email)) {
    return "Please enter a valid email address.";
  }

  return null;
}

export function validatePassword(password: string) {
  if (!password) {
    return "Password is required.";
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
  }

  return null;
}

export function validateRegistration(input: {
  email: unknown;
  password: unknown;
}): ValidationResult<{ email: string; password: string }> {
  const email = normalizeEmail(input.email);
  const password = String(input.password ?? "");
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  if (emailError || passwordError) {
    return {
      ok: false,
      message: emailError || passwordError || "Please check the form.",
      fieldErrors: {
        ...(emailError ? { email: emailError } : {}),
        ...(passwordError ? { password: passwordError } : {}),
      },
    };
  }

  return {
    ok: true,
    data: { email, password },
  };
}

export function validateLogin(input: {
  email: unknown;
  password: unknown;
}): ValidationResult<{ email: string; password: string }> {
  const email = normalizeEmail(input.email);
  const password = String(input.password ?? "");
  const emailError = validateEmail(email);

  if (emailError || !password) {
    return {
      ok: false,
      message: emailError || "Password is required.",
      fieldErrors: {
        ...(emailError ? { email: emailError } : {}),
        ...(!password ? { password: "Password is required." } : {}),
      },
    };
  }

  return {
    ok: true,
    data: { email, password },
  };
}

export function validateResetPassword(input: {
  password: unknown;
  confirmPassword: unknown;
}): ValidationResult<{ password: string }> {
  const password = String(input.password ?? "");
  const confirmPassword = String(input.confirmPassword ?? "");
  const passwordError = validatePassword(password);
  const confirmError = confirmPassword !== password ? "Passwords do not match." : null;

  if (passwordError || confirmError) {
    return {
      ok: false,
      message: passwordError || confirmError || "Please check the form.",
      fieldErrors: {
        ...(passwordError ? { password: passwordError } : {}),
        ...(confirmError ? { confirmPassword: confirmError } : {}),
      },
    };
  }

  return {
    ok: true,
    data: { password },
  };
}
