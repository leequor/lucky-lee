import type { ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function SelectField({
  id,
  label,
  children,
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[13px] font-medium text-ink">
        {label}
      </label>
      <select
        id={id}
        className={cn(
          "h-10 w-full rounded-lg border border-line bg-paper px-3 text-[13px] text-ink outline-none transition-colors hover:border-[#3A414B] focus:border-accent",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  hint,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  id: string;
  label: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[13px] font-medium text-ink">
          {label}
        </label>
        {hint ? <span className="text-[11px] text-muted">{hint}</span> : null}
      </div>
      <textarea
        id={id}
        className={cn(
          "min-h-[110px] w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-[13px] leading-5 text-ink outline-none transition-colors placeholder:text-muted/55 hover:border-[#3A414B] focus:border-accent",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function CheckboxField({
  id,
  label,
  description,
  defaultChecked,
}: {
  id: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label htmlFor={id} className="flex items-start gap-3 rounded-lg border border-line bg-paper px-3 py-2.5">
      <input
        id={id}
        name={id}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 rounded border-line bg-paper accent-[#FF6B35]"
      />
      <span>
        <span className="block text-[12px] font-medium text-ink">{label}</span>
        {description ? <span className="mt-0.5 block text-[11px] leading-4 text-muted">{description}</span> : null}
      </span>
    </label>
  );
}
