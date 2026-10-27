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
      <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h1 className="text-balance text-[27px] font-semibold leading-[1.1] tracking-[-0.035em] text-ink sm:text-[30px]">
          {title}
        </h1>
        <p className="mt-3 text-[14px] leading-6 text-muted">{description}</p>

        <div className="mt-7">{children}</div>

        {footer ? (
          <div className="mt-7 border-t border-line pt-5 text-[13px] text-muted">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
