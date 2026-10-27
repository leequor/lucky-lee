"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { loginAction } from "@/app/actions/auth";
import { Alert } from "@/components/ui/alert";
import { FormField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { initialAuthState } from "@/lib/auth/types";

export function LoginForm({
  notice,
  errorNotice,
}: {
  notice?: string;
  errorNotice?: string;
}) {
  const [state, formAction] = useActionState(loginAction, initialAuthState);
  const [email, setEmail] = useState("");
  const message =
    state.status === "error" ? state.message : state.status === "success" ? state.message : errorNotice || notice;
  const tone = state.status === "error" || errorNotice ? "error" : "success";

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {message ? <Alert tone={tone}>{message}</Alert> : null}

      <FormField
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="you@team.com"
        autoComplete="email"
        inputMode="email"
        error={state.fieldErrors?.email}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <FormField
        id="password"
        name="password"
        type="password"
        label="Password"
        placeholder="Your password"
        autoComplete="current-password"
        labelExtra={
          <Link href="/forgot-password" className="hover:underline">
            Forgot password?
          </Link>
        }
        error={state.fieldErrors?.password}
        required
      />

      <SubmitButton pendingText="Signing in...">Sign in</SubmitButton>
    </form>
  );
}
