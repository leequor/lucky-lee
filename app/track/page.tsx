import Link from "next/link";

import { RepairBench } from "@/components/patchwork/repair-bench";
import { Feedback, Panel, StatusPill } from "@/components/workspace/ui";
import { Logo } from "@/components/ui/logo";
import {
  DEVICE_CATEGORY_LABELS,
  formatDate,
  formatRelative,
  TICKET_STATUS_META,
} from "@/lib/repair/format";
import { getTrackedTicket } from "@/lib/repair/queries";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  code?: string;
  contact?: string;
  error?: string;
}>;

export default async function TrackPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const code = params.code?.trim() ?? "";
  const contact = params.contact?.trim() ?? "";
  const hasQuery = Boolean(code && contact);
  const ticket = hasQuery ? await getTrackedTicket(code, contact) : null;

  return (
    <main className="min-h-[100dvh] bg-paper">
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5 sm:px-6">
          <Logo href="/" />
          <div className="flex items-center gap-2">
            <Link
              href="/status"
              className="hidden rounded-full border border-line px-3 py-1.5 text-[12px] text-muted hover:text-ink sm:inline-flex"
            >
              System status
            </Link>
            <Link
              href="/login"
              className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-[12px] font-semibold text-paper hover:bg-white"
            >
              Staff sign in
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1180px] px-5 pb-16 pt-8 sm:px-6 sm:pt-12">
        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
          <div className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-6 sm:p-8">
            <div>
              <div className="flex items-center gap-2 text-[12px] text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                Live repair status
              </div>
              <h1 className="mt-4 max-w-[12ch] text-[44px] font-semibold leading-[0.94] tracking-[-0.055em] text-ink sm:text-[62px]">
                Track your repair.
              </h1>
              <p className="mt-4 max-w-[44ch] text-[14px] leading-6 text-muted">
                Enter the ticket code from your intake receipt and the email or phone number on the
                repair. No account needed.
              </p>

              <form className="mt-7 space-y-3" method="get">
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-medium text-ink">Ticket code</span>
                  <input
                    name="code"
                    defaultValue={code}
                    placeholder="e.g. TRACK1041"
                    className="h-11 w-full rounded-lg border border-line bg-paper px-3.5 font-mono text-[13px] uppercase tracking-[0.04em] text-ink outline-none placeholder:font-sans placeholder:tracking-normal placeholder:text-muted/55 focus:border-accent"
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-medium text-ink">Email or phone</span>
                  <input
                    name="contact"
                    defaultValue={contact}
                    placeholder="maya@northline.studio or 415-555-0142"
                    className="h-11 w-full rounded-lg border border-line bg-paper px-3.5 text-[13px] text-ink outline-none placeholder:text-muted/55 focus:border-accent"
                    required
                  />
                </label>
                <button
                  type="submit"
                  className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-full bg-accent text-[13px] font-semibold text-[#170A05] transition-colors hover:bg-[#ff8358]"
                >
                  Check status
                </button>
              </form>

              <Feedback error={params.error || (hasQuery && !ticket ? "No ticket matched that code and contact." : undefined)} />
            </div>

            <div className="mt-8 border-t border-line pt-4 text-[11px] leading-5 text-muted">
              <p>Your code is on the intake receipt. Contact the shop if you cannot find it.</p>
            </div>
          </div>

          <RepairBench className="reveal min-h-[340px] lg:min-h-0" />
        </div>

        {ticket ? (
          <section className="mt-5 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <Panel className="reveal p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="figure text-[12px] text-muted">{ticket.ticket_number}</p>
                  <h2 className="mt-1 text-[24px] font-semibold tracking-[-0.035em] text-ink">
                    {ticket.device.brand} {ticket.device.model}
                  </h2>
                </div>
                <StatusPill status={ticket.status} />
              </div>
              <p className="mt-2 text-[12px] text-muted">
                {DEVICE_CATEGORY_LABELS[ticket.device.category] ?? ticket.device.category} · opened{" "}
                {formatDate(ticket.created_at)} · updated {formatRelative(ticket.updated_at)}
              </p>

              <div className="mt-6 rounded-xl border border-line bg-paper p-4">
                <p className="text-[10px] text-muted">What we are working on</p>
                <p className="mt-1 text-[13px] leading-6 text-ink">{ticket.issue}</p>
              </div>

              <div className="mt-5 rounded-xl border border-line bg-wash/45 p-4">
                <p className="text-[10px] text-muted">Current stage</p>
                <p className="mt-1 text-[14px] font-medium text-ink">
                  {TICKET_STATUS_META[ticket.status].label}
                </p>
                <p className="mt-1 text-[12px] leading-5 text-muted">
                  {TICKET_STATUS_META[ticket.status].description}
                </p>
              </div>

              <p className="mt-5 text-[11px] text-muted">
                Hi {ticket.customer_name}. If something looks wrong, call the shop and quote{" "}
                <span className="font-mono text-ink">{ticket.ticket_number}</span>.
              </p>
            </Panel>

            <Panel className="reveal reveal-delay-1 overflow-hidden">
              <div className="border-b border-line px-5 py-4">
                <h2 className="text-[15px] font-medium text-ink">Repair timeline</h2>
                <p className="mt-0.5 text-[12px] text-muted">Updates the bench has shared with you.</p>
              </div>
              <div className="divide-y divide-line">
                {ticket.events.length === 0 ? (
                  <p className="px-5 py-6 text-[12px] text-muted">No updates yet.</p>
                ) : (
                  ticket.events.map((event, index) => (
                    <div key={`${event.created_at}-${index}`} className="flex gap-3 px-5 py-4">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          {event.status ? <StatusPill status={event.status} /> : null}
                          <span className="text-[10px] text-muted">{formatRelative(event.created_at)}</span>
                        </div>
                        {event.body ? <p className="mt-1.5 text-[12px] leading-5 text-muted">{event.body}</p> : null}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Panel>
          </section>
        ) : (
          <section className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              ["1", "Find your code", "The code is printed on the intake receipt, next to the ticket number."],
              ["2", "Use the contact on file", "Enter the email or phone number you gave at the counter."],
              ["3", "No account needed", "The tracker only shows repair progress, not your address or payment details."],
            ].map(([step, title, body]) => (
              <Panel key={step} className="reveal p-5">
                <p className="figure text-[11px] text-accent">{step}</p>
                <p className="mt-2 text-[13px] font-medium text-ink">{title}</p>
                <p className="mt-1 text-[12px] leading-5 text-muted">{body}</p>
              </Panel>
            ))}
          </section>
        )}
      </div>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-2 px-5 py-4 text-[11px] text-muted sm:px-6">
          <p>Patchwork · Repair operations</p>
          <p>Customers see status only. Staff manage the rest.</p>
        </div>
      </footer>
    </main>
  );
}
