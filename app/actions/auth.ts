"use server";

import { redirect } from "next/navigation";

import { mapAuthError } from "@/lib/auth/errors";
import {
  loginWithPassword,
  logout,
  registerWithPassword,
  requestPasswordReset,
  updatePassword,
} from "@/lib/auth/service";
import type { AuthState } from "@/lib/auth/types";
import { getAuthCallbackUrl } from "@/lib/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ClientResult =
  | { ok: true; client: Awaited<ReturnType<typeof createSupabaseServerClient>> }
  | { ok: false; message: string };

async function getClient(): Promise<ClientResult> {
  try {
    return {
      ok: true,
      client: await createSupabaseServerClient(),
    };
  } catch (error) {
    return {
      ok: false,
      message: mapAuthError(error instanceof Error ? error.message : undefined, "general"),
    };
  }
}

export async function loginAction(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const clientResult = await getClient();

  if (!clientResult.ok) {
    return { status: "error", message: clientResult.message };
  }

  const result = await loginWithPassword(clientResult.client, {
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.ok) {
    return {
      status: "error",
      message: result.message,
      fieldErrors: result.fieldErrors,
    };
  }

  redirect("/");
}

export async function registerAction(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (process.env.NEXT_PUBLIC_ALLOW_STAFF_SIGNUP !== "true") {
    return {
      status: "error",
      message: "Staff accounts are invite-only. Ask an owner or manager to create your account.",
    };
  }

  const clientResult = await getClient();

  if (!clientResult.ok) {
    return { status: "error", message: clientResult.message };
  }

  const result = await registerWithPassword(
    clientResult.client,
    {
      email: formData.get("email"),
      password: formData.get("password"),
      fullName: String(formData.get("fullName") ?? ""),
    },
    {
      emailRedirectTo: getAuthCallbackUrl("/"),
    },
  );

  if (!result.ok) {
    return {
      status: "error",
      message: result.message,
      fieldErrors: result.fieldErrors,
    };
  }

  if (result.data.needsEmailConfirmation) {
    return {
      status: "success",
      message:
        "Account created. Check your email for the confirmation link, then return here to log in.",
    };
  }

  redirect("/");
}

export async function forgotPasswordAction(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const clientResult = await getClient();

  if (!clientResult.ok) {
    return { status: "error", message: clientResult.message };
  }

  const result = await requestPasswordReset(clientResult.client, formData.get("email"), {
    redirectTo: getAuthCallbackUrl("/reset-password"),
  });

  if (!result.ok) {
    return {
      status: "error",
      message: result.message,
      fieldErrors: result.fieldErrors,
    };
  }

  return {
    status: "success",
    message: `If an account exists for ${result.data.email}, a reset link is on its way. Check your inbox and spam folder.`,
  };
}

export async function resetPasswordAction(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const clientResult = await getClient();

  if (!clientResult.ok) {
    return { status: "error", message: clientResult.message };
  }

  const result = await updatePassword(clientResult.client, {
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!result.ok) {
    return {
      status: "error",
      message: result.message,
      fieldErrors: result.fieldErrors,
    };
  }

  await clientResult.client.auth.signOut();
  redirect(`/login?message=${encodeURIComponent("Password updated. Log in with your new password.")}`);
}

export async function logoutAction() {
  const clientResult = await getClient();

  if (clientResult.ok) {
    await logout(clientResult.client);
  }

  redirect("/login");
}
