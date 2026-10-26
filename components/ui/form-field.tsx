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
        <label htmlFor={id} className="text-sm font-semibold text-ink">
          {label}
        </label>
        {labelExtra ? (
          <span className="text-xs font-medium text-clover-700">{labelExtra}</span>
        ) : hint ? (
          <span id={`${id}-hint`} className="text-xs text-muted">
            {hint}
          </span>
        ) : null}
      </div>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={cn(
          "h-12 w-full rounded-2xl border bg-white/75 px-4 text-[15px] text-ink shadow-inner outline-none transition placeholder:text-ink/30 focus:bg-white focus:ring-4",
          error
            ? "border-coral-500/70 focus:border-coral-500 focus:ring-coral-500/10"
            : "border-ink/10 focus:border-clover-600 focus:ring-clover-600/10",
          className,
        )}
        {...inputProps}
      />
      {hint && labelExtra ? (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-coral-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
