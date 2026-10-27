import Link from "next/link";

import {
  EmptyState,
  Feedback,
  PageHeader,
  Panel,
  PrimaryLink,
  PriorityPill,
  StatusPill,
} from "@/components/workspace/ui";
import { formatRelative, PRIORITY_META, TICKET_STATUS_META } from "@/lib/repair/format";
import { getStaffProfiles, getTickets } from "@/lib/repair/queries";
import { TICKET_PRIORITIES, TICKET_STATUSES } from "@/lib/repair/types";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  q?: string;
  status?: string;
  priority?: string;
  assigned?: string;
  notice?: string;
  error?: string;
}>;

export default async function TicketsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const [tickets, staff] = await Promise.all([
    getTickets({
      search: params.q,
      status: params.status,
      priority: params.priority,
      assigned: params.assigned,
    }),
    getStaffProfiles(),
  ]);

  const active = Boolean(params.q || (params.status && params.status !== "all") || (params.priority && params.priority !== "all") || (params.assigned && params.assigned !== "all"));

  return (
    <div>
      <PageHeader
        title="Tickets"
        description="Every device on the bench, from intake to collection."
        actions={<PrimaryLink href="/tickets/new">New ticket</PrimaryLink>}
      />
      <Feedback notice={params.notice} error={params.error} />

      <Panel className="mt-5 overflow-hidden">
        <form className="grid gap-2 border-b border-line p-4 lg:grid-cols-[1.6fr_0.9fr_0.8fr_1fr_auto]">
          <label className="relative flex items-center">
            <span className="sr-only">Search tickets</span>
            <input
              name="q"
              defaultValue={params.q}
              placeholder="Search ticket, customer, phone, device"
              className="h-9 w-full rounded-lg border border-line bg-paper px-3 text-[12px] text-ink outline-none placeholder:text-muted/60 focus:border-accent"
            />
          </label>
          <label>
            <span className="sr-only">Status</span>
            <select
              name="status"
              defaultValue={params.status ?? "all"}
              className="h-9 w-full rounded-lg border border-line bg-paper px-2.5 text-[12px] text-ink outline-none focus:border-accent"
            >
              <option value="all">All statuses</option>
              {TICKET_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {TICKET_STATUS_META[status].label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Priority</span>
            <select
              name="priority"
              defaultValue={params.priority ?? "all"}
              className="h-9 w-full rounded-lg border border-line bg-paper px-2.5 text-[12px] text-ink outline-none focus:border-accent"
            >
              <option value="all">All priorities</option>
              {TICKET_PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {PRIORITY_META[priority].label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Technician</span>
            <select
              name="assigned"
              defaultValue={params.assigned ?? "all"}
              className="h-9 w-full rounded-lg border border-line bg-paper px-2.5 text-[12px] text-ink outline-none focus:border-accent"
            >
              <option value="all">Any technician</option>
              {staff.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.full_name || member.email}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              className="inline-flex h-9 items-center justify-center rounded-full bg-ink px-4 text-[12px] font-semibold text-paper transition-colors hover:bg-white"
            >
              Filter
            </button>
            {active ? (
              <Link
                href="/tickets"
                className="inline-flex h-9 items-center justify-center rounded-full border border-line px-3 text-[12px] text-muted hover:text-ink"
              >
                Clear
              </Link>
            ) : null}
          </div>
        </form>

        {tickets.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title={active ? "No matching tickets" : "No tickets yet"}
              body={
                active
                  ? "Change the filters or search term and try again."
                  : "Log the first device and Patchwork will start building the queue."
              }
              action={<PrimaryLink href="/tickets/new">New ticket</PrimaryLink>}
            />
          </div>
        ) : (
          <>
            <div className="hidden grid-cols-[0.8fr_1.4fr_1fr_0.8fr_0.9fr_0.7fr] gap-4 border-b border-line px-5 py-2.5 text-[10px] text-muted md:grid">
              <span>Ticket</span>
              <span>Customer / device</span>
              <span>Status</span>
              <span>Priority</span>
              <span>Technician</span>
              <span className="text-right">Updated</span>
            </div>
            <div className="divide-y divide-line">
              {tickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/tickets/${ticket.id}`}
                  className="group grid gap-3 px-5 py-4 transition-colors hover:bg-wash/45 md:grid-cols-[0.8fr_1.4fr_1fr_0.8fr_0.9fr_0.7fr] md:items-center md:gap-4"
                >
                  <div>
                    <p className="figure text-[12px] font-medium text-ink">{ticket.ticket_number}</p>
                    <p className="mt-0.5 text-[10px] text-muted">{ticket.public_code}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-ink">{ticket.customer.full_name}</p>
                    <p className="mt-0.5 truncate text-[11px] text-muted">
                      {ticket.device.brand} {ticket.device.model}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 md:block">
                    <StatusPill status={ticket.status} />
                    <p className="mt-1.5 hidden truncate text-[10px] text-muted md:block">{ticket.issue}</p>
                  </div>
                  <PriorityPill priority={ticket.priority} />
                  <div className="min-w-0">
                    <p className="truncate text-[12px] text-ink">{ticket.assignee?.full_name || "Unassigned"}</p>
                    <p className="mt-0.5 text-[10px] text-muted">
                      {ticket.assignee ? "Assigned" : "Needs owner"}
                    </p>
                  </div>
                  <p className="figure text-[11px] text-muted md:text-right">{formatRelative(ticket.updated_at)}</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </Panel>

      <p className="mt-4 text-[11px] text-muted">
        {tickets.length} ticket{tickets.length === 1 ? "" : "s"} shown.
      </p>
    </div>
  );
}
