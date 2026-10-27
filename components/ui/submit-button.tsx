"use client";

import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";

import { Button } from "./button";

export function SubmitButton({
  children,
  pendingText = "Working...",
  className,
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="lg"
      className={cn("w-full", className)}
      disabled={pending}
      aria-live="polite"
    >
      {pending ? (
        <>
          <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
          {pendingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
