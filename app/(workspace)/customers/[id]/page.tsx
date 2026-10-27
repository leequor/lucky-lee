import Link from "next/link";
import { notFound } from "next/navigation";

import { addDeviceAction } from "@/app/actions/repair";
import { FormField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { SelectField } from "@/components/workspace/form-controls";
import {
  EmptyState,
  Feedback,
  PageHeader,
  Panel,
  PanelHeader,
  PrimaryLink,
  PriorityPill,
  StatusPill,
} from "@/components/workspace/ui";
import {
  DEVICE_CATEGORY_LABELS,
  formatDate,
  formatRelative,
} from "@/lib/repair/format";
import { getCustomerDetail } from "@/lib/repair/queries";
import { DEVICE_CATEGORIES } from "@/lib/repair/types";
import { initials } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string; error?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const customer = await getCustomerDetail(id);

  if (!customer) notFound();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/customers" className="inline-flex items-center gap-2 text-[12px] text-muted hover:text-ink">
          <span aria-hidden="true">←</span>
          All customers
        </Link>
        <PrimaryLink href="/tickets/new">New ticket</PrimaryLink>
      </div>
      <Feedback notice={query.notice} error={query.error} />

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl border border-line bg-wash text-[16px] font-semibold text-accent">
            {initials(customer.full_name)}
          </div>
          <div>
            <PageHeader title={customer.full_name} description={`${customer.phone}${customer.email ? ` · ${customer.email}` : ""}`} />
            <p className="mt-1 text-[11px] text-muted">
              Customer since {formatDate(customer.created_at)} · {customer.devices.length} device
              {customer.devices.length === 1 ? "" : "s"} · {customer.tickets.length} ticket
              {customer.tickets.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        <div className="text-right text-[11px] text-muted">
          <p>{customer.company || "Individual customer"}</p>
          {customer.notes ? <p className="mt-1 max-w-[36ch]">{customer.notes}</p> : null}
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-4">
          <Panel className="reveal overflow-hidden">
            <PanelHeader title="Repair history" detail="Every ticket for this customer." />
            {customer.tickets.length === 0 ? (
              <div className="p-5">
                <EmptyState
                  title="No repairs yet"
                  body="Attach a device below, then open the first ticket."
                  action={<PrimaryLink href="/tickets/new">New ticket</PrimaryLink>}
                />
              </div>
            ) : (
              <div className="divide-y divide-line">
                {customer.tickets.map((ticket) => (
                  <Link
                    key={ticket.id}
                    href={`/tickets/${ticket.id}`}
                    className="grid gap-2 px-5 py-4 transition-colors hover:bg-wash/45 sm:grid-cols-[0.7fr_1.2fr_1fr_0.6fr] sm:items-center"
                  >
                    <p className="figure text-[12px] font-medium text-ink">{ticket.ticket_number}</p>
                    <div className="min-w-0">
                      <p className="truncate text-[12px] text-ink">{ticket.device.brand} {ticket.device.model}</p>
                      <p className="mt-0.5 truncate text-[10px] text-muted">{ticket.issue}</p>
                    </div>
                    <StatusPill status={ticket.status} />
                    <div className="flex items-center justify-between gap-2 sm:justify-end">
                      <PriorityPill priority={ticket.priority} />
                      <span className="figure text-[10px] text-muted">{formatRelative(ticket.created_at)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Panel>

          <Panel className="reveal reveal-delay-1 overflow-hidden">
            <PanelHeader title="Devices" detail="Attach a device before opening its ticket." />
            {customer.devices.length === 0 ? (
              <p className="px-5 py-5 text-[12px] text-muted">No devices attached.</p>
            ) : (
              <div className="grid gap-3 p-5 sm:grid-cols-2">
                {customer.devices.map((device) => (
                  <div key={device.id} className="rounded-xl border border-line bg-paper p-4">
                    <p className="text-[10px] text-muted">{DEVICE_CATEGORY_LABELS[device.category] ?? device.category}</p>
                    <p className="mt-1 text-[14px] font-medium text-ink">{device.brand} {device.model}</p>
                    <p className="mt-1 text-[11px] text-muted">
                      {device.serial || "No serial"} {device.color ? `· ${device.color}` : ""}
                    </p>
                    <p className="mt-3 text-[10px] text-muted">Added {formatDate(device.created_at)}</p>
                  </div>
                ))}
              </div>
            )}
            <form action={addDeviceAction} className="space-y-4 border-t border-line bg-paper/40 p-5">
              <input type="hidden" name="customer_id" value={customer.id} />
              <div className="grid gap-4 sm:grid-cols-3">
                <SelectField id="category" name="category" label="Device type" defaultValue="phone">
                  {DEVICE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {DEVICE_CATEGORY_LABELS[category]}
                    </option>
                  ))}
                </SelectField>
                <FormField id="brand" name="brand" label="Brand" placeholder="Apple" required />
                <FormField id="model" name="model" label="Model" placeholder="iPhone 15 Pro" required />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField id="serial" name="serial" label="Serial / IMEI" placeholder="Optional" />
                <FormField id="color" name="color" label="Color" placeholder="Optional" />
              </div>
              <div className="flex justify-end">
                <SubmitButton pendingText="Adding...">Add device</SubmitButton>
              </div>
            </form>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel className="reveal reveal-delay-1 p-5">
            <h2 className="text-[14px] font-medium text-ink">Contact</h2>
            <dl className="mt-4 space-y-3 text-[12px]">
              <div>
                <dt className="text-muted">Phone</dt>
                <dd className="mt-0.5 text-ink">{customer.phone}</dd>
              </div>
              <div>
                <dt className="text-muted">Email</dt>
                <dd className="mt-0.5 break-all text-ink">{customer.email || "Not provided"}</dd>
              </div>
              <div>
                <dt className="text-muted">Company</dt>
                <dd className="mt-0.5 text-ink">{customer.company || "—"}</dd>
              </div>
              <div>
                <dt className="text-muted">Notes</dt>
                <dd className="mt-0.5 leading-5 text-ink">{customer.notes || "No notes."}</dd>
              </div>
            </dl>
          </Panel>

          <Panel className="reveal reveal-delay-2 p-5">
            <h2 className="text-[14px] font-medium text-ink">Quick numbers</h2>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg border border-line bg-paper py-3">
                <p className="figure text-[22px] font-semibold text-ink">{customer.devices.length}</p>
                <p className="mt-1 text-[10px] text-muted">Devices</p>
              </div>
              <div className="rounded-lg border border-line bg-paper py-3">
                <p className="figure text-[22px] font-semibold text-ink">{customer.tickets.length}</p>
                <p className="mt-1 text-[10px] text-muted">Tickets</p>
              </div>
              <div className="rounded-lg border border-line bg-paper py-3">
                <p className="figure text-[22px] font-semibold text-accent">
                  {customer.tickets.filter((ticket) => ["intake", "diagnosing", "waiting_parts", "in_repair"].includes(ticket.status)).length}
                </p>
                <p className="mt-1 text-[10px] text-muted">Open</p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
