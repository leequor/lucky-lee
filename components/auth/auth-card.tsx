import type { ReactNode } from "react";

export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="w-full max-w-form">
      <div className="rounded-lg border border-line bg-surface p-6 sm:p-7">
        <h1 className="text-[24px] font-semibold leading-tight tracking-[-0.02em] text-ink">
          {title}
        </h1>
        <p className="mt-2 text-[14px] leading-6 text-muted">{description}</p>

        <div className="mt-6">{children}</div>

        {footer ? (
          <div className="mt-6 border-t border-line pt-4 text-[13px] text-muted">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
