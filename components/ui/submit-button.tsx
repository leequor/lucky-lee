"use client";

import { useFormStatus } from "react-dom";

import { Button } from "./button";

export function SubmitButton({
  children,
  pendingText = "Working...",
}: {
  children: React.ReactNode;
  pendingText?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending} aria-live="polite">
      {pending ? (
        <>
          <span className="h-2 w-2 animate-pulse bg-current" aria-hidden="true" />
          {pendingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
