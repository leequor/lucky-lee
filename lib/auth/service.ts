import type { Session, SupabaseClient, User } from "@supabase/supabase-js";

import { mapAuthError } from "./errors";
import type { AppRole, AuthFieldErrors } from "./types";
import {
  validateEmail,
  validateLogin,
  validateRegistration,
  validateResetPassword,
} from "./validation";

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; fieldErrors?: AuthFieldErrors };

export function getDefaultRole(env: NodeJS.ProcessEnv = process.env): AppRole {
  const configured = env.NEXT_PUBLIC_DEV_DEFAULT_ROLE?.trim();

  if (configured === "superadmin" || configured === "admin" || configured === "user") {
    return configured;
  }

  return env.NODE_ENV === "production" ? "user" : "superadmin";
}

export function isAppRole(value: unknown): value is AppRole {
  return value === "superadmin" || value === "admin" || value === "user";
}

export async function registerWithPassword(
  client: SupabaseClient,
  input: { email: unknown; password: unknown; fullName?: string },
  options: {
    role?: AppRole;
    emailRedirectTo?: string;
    env?: NodeJS.ProcessEnv;
  } = {},
): Promise<
  ServiceResult<{
    user: User | null;
    session: Session | null;
    needsEmailConfirmation: boolean;
    role: AppRole;
  }>
> {
  const validation = validateRegistration(input);

  if (!validation.ok) {
    return {
      ok: false,
      message: validation.message,
      fieldErrors: validation.fieldErrors,
    };
  }

  const role = options.role ?? getDefaultRole(options.env);

  try {
    const { data, error } = await client.auth.signUp({
      email: validation.data.email,
      password: validation.data.password,
      options: {
        emailRedirectTo: options.emailRedirectTo,
        data: {
          role,
          full_name: input.fullName?.trim() || "",
        },
      },
    });

    if (error) {
      return {
        ok: false,
        message: mapAuthError(error.message, "register"),
      };
    }

    if (data.user?.identities?.length === 0) {
      return {
        ok: false,
        message: "Email already registered.",
      };
    }

    return {
      ok: true,
      data: {
        user: data.user,
        session: data.session,
        needsEmailConfirmation: !data.session,
        role,
      },
    };
  } catch (error) {
    return {
      ok: false,
      message: mapAuthError(error instanceof Error ? error.message : undefined, "register"),
    };
  }
}

export async function loginWithPassword(
  client: SupabaseClient,
  input: { email: unknown; password: unknown },
): Promise<ServiceResult<{ user: User; session: Session }>> {
  const validation = validateLogin(input);

  if (!validation.ok) {
    return {
      ok: false,
      message: validation.message,
      fieldErrors: validation.fieldErrors,
    };
  }

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email: validation.data.email,
      password: validation.data.password,
    });

    if (error) {
      return {
        ok: false,
        message: mapAuthError(error.message, "login"),
      };
    }

    if (!data.user || !data.session) {
      return {
        ok: false,
        message: "Unable to log in right now. Please try again.",
      };
    }

    return {
      ok: true,
      data: {
        user: data.user,
        session: data.session,
      },
    };
  } catch (error) {
    return {
      ok: false,
      message: mapAuthError(error instanceof Error ? error.message : undefined, "login"),
    };
  }
}

export async function requestPasswordReset(
  client: SupabaseClient,
  rawEmail: unknown,
  options: { redirectTo: string },
): Promise<ServiceResult<{ email: string }>> {
  const email = String(rawEmail ?? "").trim().toLowerCase();
  const emailError = validateEmail(email);

  if (emailError) {
    return {
      ok: false,
      message: emailError,
      fieldErrors: { email: emailError },
    };
  }

  try {
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: options.redirectTo,
    });

    if (error && !/user not found/i.test(error.message || "")) {
      return {
        ok: false,
        message: mapAuthError(error.message, "reset"),
      };
    }

    return {
      ok: true,
      data: { email },
    };
  } catch (error) {
    return {
      ok: false,
      message: mapAuthError(error instanceof Error ? error.message : undefined, "reset"),
    };
  }
}

export async function updatePassword(
  client: SupabaseClient,
  input: { password: unknown; confirmPassword: unknown },
): Promise<ServiceResult<{ updated: true }>> {
  const validation = validateResetPassword(input);

  if (!validation.ok) {
    return {
      ok: false,
      message: validation.message,
      fieldErrors: validation.fieldErrors,
    };
  }

  try {
    const { error } = await client.auth.updateUser({
      password: validation.data.password,
    });

    if (error) {
      return {
        ok: false,
        message: mapAuthError(error.message, "reset"),
      };
    }

    return {
      ok: true,
      data: { updated: true },
    };
  } catch (error) {
    return {
      ok: false,
      message: mapAuthError(error instanceof Error ? error.message : undefined, "reset"),
    };
  }
}

export async function logout(client: SupabaseClient): Promise<ServiceResult<{ signedOut: true }>> {
  try {
    const { error } = await client.auth.signOut();

    if (error) {
      return {
        ok: false,
        message: mapAuthError(error.message, "general"),
      };
    }

    return {
      ok: true,
      data: { signedOut: true },
    };
  } catch (error) {
    return {
      ok: false,
      message: mapAuthError(error instanceof Error ? error.message : undefined, "general"),
    };
  }
}
