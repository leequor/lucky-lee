import Link from "next/link";
import type { ReactNode } from "react";

import {
  INVOICE_STATUS_META,
  PRIORITY_META,
  TICKET_STATUS_META,
} from "@/lib/repair/format";
import type {
  InvoiceStatus,
  TicketPriority,
  TicketStatus,
} from "@/lib/repair/types";
import { cn } from "@/lib/utils";

export function StatusPill({
  status,
  className,
}: {
  status: TicketStatus;
  className?: string;
}) {
  const meta = TICKET_STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium leading-none",
        meta.tone,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} aria-hidden="true" />
      {meta.label}
    </span>
  );
}

export function PriorityPill({ priority }: { priority: TicketPriority }) {
  const meta = PRIORITY_META[priority];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-medium", meta.tone)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} aria-hidden="true" />
      {meta.label}
    </span>
  );
}

export function InvoicePill({ status }: { status: InvoiceStatus }) {
  const meta = INVOICE_STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium leading-none",
        meta.tone,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} aria-hidden="true" />
      {meta.label}
    </span>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[28px] font-semibold leading-[1.05] tracking-[-0.045em] text-ink sm:text-[32px]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-[70ch] text-[13px] leading-5 text-muted">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Feedback({
  notice,
  error,
}: {
  notice?: string;
  error?: string;
}) {
  if (!notice && !error) return null;
  return (
    <div
      className={cn(
        "mt-4 rounded-xl border px-4 py-3 text-[13px]",
        error
          ? "border-negative/30 bg-negative-soft text-negative-ink"
          : "border-positive/25 bg-positive-soft text-positive-ink",
      )}
      role={error ? "alert" : "status"}
    >
      {error || notice}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-surface/60 px-6 py-12 text-center">
      <p className="text-[15px] font-medium text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-[50ch] text-[13px] leading-5 text-muted">{body}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function SecondaryLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-full border border-line bg-wash px-3.5 text-[12px] font-medium text-ink transition-colors hover:border-[#3A414B] hover:bg-[#20252D]",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function PrimaryLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-full bg-accent px-4 text-[12px] font-semibold text-[#170A05] transition-colors hover:bg-[#ff8358]",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-line bg-surface", className)}>{children}</div>
  );
}

export function PanelHeader({
  title,
  detail,
  action,
}: {
  title: string;
  detail?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4">
      <div>
        <h2 className="text-[15px] font-medium text-ink">{title}</h2>
        {detail ? <p className="mt-0.5 text-[12px] text-muted">{detail}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function DataBar({
  value,
  max,
  tone = "bg-accent",
}: {
  value: number;
  max: number;
  tone?: string;
}) {
  const width = max <= 0 ? 0 : Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-wash">
      <div className={cn("h-full rounded-full", tone)} style={{ width: `${width}%` }} />
    </div>
  );
}
