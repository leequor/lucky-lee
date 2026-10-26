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
    <div className="animate-fade-up rounded-[2rem] border border-ink/10 bg-paper/90 p-6 shadow-card backdrop-blur sm:p-8">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-clover-700">{eyebrow}</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-[2rem]">
          {title}
        </h1>
        <p className="text-sm leading-6 text-muted">{description}</p>
      </div>

      <div className="mt-7">{children}</div>

      {footer ? (
        <div className="mt-7 border-t border-ink/10 pt-5 text-center text-sm text-muted">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
