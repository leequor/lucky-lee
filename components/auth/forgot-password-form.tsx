"use client";

import { useActionState } from "react";

import { forgotPasswordAction } from "@/app/actions/auth";
import { Alert } from "@/components/ui/alert";
import { FormField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { initialAuthState } from "@/lib/auth/types";

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(forgotPasswordAction, initialAuthState);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.status === "error" ? <Alert tone="error">{state.message}</Alert> : null}
      {state.status === "success" ? <Alert tone="success">{state.message}</Alert> : null}

      <FormField
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="you@team.com"
        autoComplete="email"
        inputMode="email"
        hint="Use the address on your account"
        error={state.fieldErrors?.email}
        required
      />

      <SubmitButton pendingText="Sending link...">Send reset link</SubmitButton>
    </form>
  );
}
