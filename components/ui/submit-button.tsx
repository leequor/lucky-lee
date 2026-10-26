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
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
          {pendingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
