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
          className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink"
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
          "h-11 w-full rounded-[2px] border bg-surface px-3 text-[15px] text-ink outline-none transition-colors placeholder:text-muted focus:border-ink focus:ring-1 focus:ring-ink",
          error ? "border-signal-600 focus:border-signal-600 focus:ring-signal-600" : "border-ink/25",
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
          className="font-mono text-[10px] leading-4 text-signal-700"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
