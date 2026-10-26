import type { ReactNode } from "react";

export function AuthCard({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="animate-reveal">
      <div className="mb-6 h-[4px] w-10 bg-signal-500" aria-hidden="true" />
      <p className="label">{eyebrow}</p>
      <h1 className="mt-4 text-[clamp(2rem,4vw,2.85rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-ink">
        {title}
      </h1>
      <p className="mt-4 max-w-[42ch] text-[14px] leading-6 text-muted">{description}</p>

      <div className="mt-8">{children}</div>

      {footer ? (
        <div className="mt-8 border-t border-ink/15 pt-5 text-[13px] text-muted">{footer}</div>
      ) : null}
    </div>
  );
}
