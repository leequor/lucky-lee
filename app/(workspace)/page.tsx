import Link from "next/link";

import { RepairBench } from "@/components/patchwork/repair-bench";
import {
  DataBar,
  EmptyState,
  PageHeader,
  Panel,
  PanelHeader,
  PrimaryLink,
  PriorityPill,
  SecondaryLink,
  StatusPill,
} from "@/components/workspace/ui";
import {
  formatCompactMoney,
  formatRelative,
  ROLE_LABELS,
} from "@/lib/repair/format";
import { getDashboardData } from "@/lib/repair/queries";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboardData();
  const dateLabel = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
  const activeJobs = data.counts.diagnosing + data.counts.in_repair + data.counts.waiting_parts;

  return (
    <div>
      <PageHeader
        title="Repair desk"
        description={`${dateLabel} · What is on the bench, what is blocked, and what is ready to leave.`}
        actions={
          <>
            <SecondaryLink href="/track">Open tracker</SecondaryLink>
            <PrimaryLink href="/tickets/new">New ticket</PrimaryLink>
          </>
        }
      />

      <section className="mt-6 grid gap-4 xl:grid-cols-[1.42fr_0.58fr]">
        <RepairBench className="reveal min-h-[430px] xl:min-h-[520px]" />

        <Panel className="reveal reveal-delay-1 flex flex-col overflow-hidden">
          <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
            <div>
              <h2 className="text-[15px] font-medium text-ink">Today at a glance</h2>
              <p className="mt-0.5 text-[12px] text-muted">Live counts across the shop.</p>
            </div>
            <span className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-positive-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-positive" aria-hidden="true" />
              Live
            </span>
          </div>

          <div className="grid flex-1 grid-cols-2 divide-x divide-y divide-line sm:grid-cols-2">
            <Metric label="Open jobs" value={String(data.openCount)} note={`${activeJobs} at the bench`} />
            <Metric
              label="Ready to collect"
              value={String(data.readyCount)}
              note={
                data.readyCount === 0
                  ? "all collected"
                  : data.readyCount === 1
                    ? "one customer waiting"
                    : "customers waiting"
              }
              accent
            />
            <Metric
              label="This month"
              value={formatCompactMoney(data.revenueMtd)}
              note="paid invoices"
            />
            <Metric
              label="Low stock"
              value={String(data.lowStock.length)}
              note={data.lowStock.length === 1 ? "part needs a reorder" : "parts need a reorder"}
            />
          </div>

          <div className="border-t border-line px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[12px] text-muted">Next out the door</p>
              <Link href="/tickets?status=ready" className="text-[12px] font-medium text-accent hover:text-[#ff8358]">
                View ready
              </Link>
            </div>
            <div className="mt-3 space-y-2">
              {data.readyTickets.slice(0, 2).map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/tickets/${ticket.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-line bg-paper px-3 py-2.5 transition-colors hover:border-[#3A414B]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-medium text-ink">{ticket.customer.full_name}</p>
                    <p className="mt-0.5 truncate text-[11px] text-muted">
                      {ticket.device.brand} {ticket.device.model}
                    </p>
                  </div>
                  <span className="figure shrink-0 text-[11px] text-muted">{ticket.ticket_number}</span>
                </Link>
              ))}
              {data.readyTickets.length === 0 ? (
                <p className="rounded-lg border border-dashed border-line px-3 py-3 text-[12px] text-muted">
                  Nothing waiting for pickup.
                </p>
              ) : null}
            </div>
          </div>
        </Panel>
      </section>

      <section className="mt-5 grid gap-4 xl:grid-cols-[1.42fr_0.58fr]">
        <Panel className="reveal reveal-delay-1 overflow-hidden">
          <PanelHeader
            title="Live queue"
            detail="Open tickets, newest first."
            action={
              <Link href="/tickets" className="text-[12px] font-medium text-accent hover:text-[#ff8358]">
                All tickets
              </Link>
            }
          />

          {data.queue.length === 0 ? (
            <div className="p-5">
              <EmptyState
                title="The bench is clear"
                body="Create the first ticket when a device comes in."
                action={<PrimaryLink href="/tickets/new">New ticket</PrimaryLink>}
              />
            </div>
          ) : (
            <div className="divide-y divide-line">
              {data.queue.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/tickets/${ticket.id}`}
                  className="grid gap-3 px-5 py-3.5 transition-colors hover:bg-wash/45 md:grid-cols-[1.1fr_1.2fr_auto_auto]"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="figure text-[11px] text-muted">{ticket.ticket_number}</span>
                      <PriorityPill priority={ticket.priority} />
                    </div>
                    <p className="mt-1 truncate text-[13px] font-medium text-ink">{ticket.customer.full_name}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[12px] text-ink">{ticket.device.brand} {ticket.device.model}</p>
                    <p className="mt-0.5 truncate text-[11px] text-muted">{ticket.issue}</p>
                  </div>
                  <div className="flex items-center md:justify-end">
                    <StatusPill status={ticket.status} />
                  </div>
                  <div className="flex items-center justify-between gap-4 text-[11px] text-muted md:justify-end">
                    <span className="truncate">{ticket.assignee?.full_name || "Unassigned"}</span>
                    <span className="figure shrink-0">{formatRelative(ticket.created_at)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Panel>

        <div className="grid gap-4">
          <Panel className="reveal reveal-delay-2 overflow-hidden">
            <PanelHeader title="Bench load" detail="Open jobs by technician." />
            <div className="space-y-4 px-5 py-4">
              {data.teamLoad.length === 0 ? (
                <p className="text-[12px] text-muted">No staff profiles yet.</p>
              ) : (
                data.teamLoad.slice(0, 5).map((member) => (
                  <div key={member.id}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-medium text-ink">{member.full_name || member.email}</p>
                        <p className="mt-0.5 text-[10px] text-muted">{ROLE_LABELS[member.role]}</p>
                      </div>
                      <span className="figure text-[12px] text-ink">{member.open}</span>
                    </div>
                    <div className="mt-2">
                      <DataBar value={member.open} max={Math.max(1, data.openCount)} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </Panel>

          <Panel className="reveal reveal-delay-3 overflow-hidden">
            <PanelHeader
              title="Low stock"
              detail="At or below reorder level."
              action={
                <Link href="/inventory" className="text-[12px] font-medium text-accent hover:text-[#ff8358]">
                  Inventory
                </Link>
              }
            />
            {data.lowStock.length === 0 ? (
              <p className="px-5 py-4 text-[12px] text-muted">Stock levels are healthy.</p>
            ) : (
              <ul className="divide-y divide-line">
                {data.lowStock.slice(0, 4).map((part) => (
                  <li key={part.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-medium text-ink">{part.name}</p>
                      <p className="mt-0.5 text-[10px] text-muted">{part.sku}</p>
                    </div>
                    <span
                      className={
                        part.stock === 0
                          ? "rounded-full bg-negative-soft px-2 py-1 text-[10px] font-medium text-negative-ink"
                          : "rounded-full bg-warn-soft px-2 py-1 text-[10px] font-medium text-warn"
                      }
                    >
                      {part.stock} left
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </section>

      <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {(
          [
            ["intake", "Logged today", "New devices waiting for diagnosis"],
            ["diagnosing", "On diagnosis", "Fault-finding in progress"],
            ["waiting_parts", "Blocked", "Waiting on supplier deliveries"],
            ["in_repair", "In repair", "Approved and moving"],
          ] as const
        ).map(([status, label, note]) => (
          <Panel key={status} className="reveal px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <StatusPill status={status} />
              <span className="figure text-[24px] font-semibold tracking-[-0.04em] text-ink">
                {data.counts[status]}
              </span>
            </div>
            <p className="mt-3 text-[12px] font-medium text-ink">{label}</p>
            <p className="mt-1 text-[11px] leading-5 text-muted">{note}</p>
          </Panel>
        ))}
      </section>

      <p className="mt-6 text-[11px] text-muted">
        Showing {data.queue.length} open jobs · {data.teamLoad.length} staff · {data.lowStock.length} stock alerts
      </p>
    </div>
  );
}

function Metric({
  label,
  value,
  note,
  accent = false,
}: {
  label: string;
  value: string;
  note: string;
  accent?: boolean;
}) {
  return (
    <div className="px-5 py-4">
      <p className="text-[11px] text-muted">{label}</p>
      <p
        className={
          accent
            ? "figure mt-1 text-[28px] font-semibold tracking-[-0.04em] text-accent"
            : "figure mt-1 text-[28px] font-semibold tracking-[-0.04em] text-ink"
        }
      >
        {value}
      </p>
      <p className="mt-1 text-[11px] leading-5 text-muted">{note}</p>
    </div>
  );
}
