"use client";

import { useActionState } from "react";

import { registerAction } from "@/app/actions/auth";
import { Alert } from "@/components/ui/alert";
import { FormField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { initialAuthState } from "@/lib/auth/types";

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, initialAuthState);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.status === "error" ? <Alert tone="error">{state.message}</Alert> : null}
      {state.status === "success" ? <Alert tone="success">{state.message}</Alert> : null}

      <FormField
        id="fullName"
        name="fullName"
        type="text"
        label="Display name"
        hint="Optional"
        placeholder="Alex Campita"
        autoComplete="name"
      />

      <FormField
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="you@team.com"
        autoComplete="email"
        inputMode="email"
        error={state.fieldErrors?.email}
        required
      />

      <FormField
        id="password"
        name="password"
        type="password"
        label="Password"
        hint="At least 6 characters"
        placeholder="Create a password"
        autoComplete="new-password"
        error={state.fieldErrors?.password}
        required
      />

      <SubmitButton pendingText="Creating account...">Create account</SubmitButton>
    </form>
  );
}
