import type { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  labelExtra?: ReactNode;
};

export function FormField({
  id,
  label,
  hint,
  error,
  labelExtra,
  className,
  ...inputProps
}: FormFieldProps) {
  const describedBy =
    [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={id}
          className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink"
        >
          {label}
        </label>
        {labelExtra ? (
          <span className="text-[12px] text-muted">{labelExtra}</span>
        ) : hint ? (
          <span id={`${id}-hint`} className="font-mono text-[10px] text-muted">
            {hint}
          </span>
        ) : null}
      </div>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={cn(
          "h-11 w-full rounded-none border bg-surface px-3 text-[15px] text-ink outline-none transition-colors placeholder:text-muted focus:border-ink focus:shadow-[inset_0_-2px_0_0_#0a0a0a]",
          error ? "border-danger-500 focus:border-danger-500 focus:shadow-[inset_0_-2px_0_0_#C62828]" : "border-ink/30",
          className,
        )}
        {...inputProps}
      />
      {hint && labelExtra ? (
        <p id={`${id}-hint`} className="font-mono text-[10px] leading-4 text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="font-mono text-[10px] leading-4 text-danger-600"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
