import type { Metadata } from "next";
import Link from "next/link";

import { markInvoicePaidAction } from "@/app/actions/repair";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  EmptyState,
  Feedback,
  InvoicePill,
  PageHeader,
  Panel,
  PanelHeader,
  PrimaryLink,
} from "@/components/workspace/ui";
import { formatDate, formatMoney } from "@/lib/repair/format";
import { getInvoices } from "@/lib/repair/queries";
import { getStaff } from "@/lib/repair/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Invoices" };

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string; error?: string }>;
}) {
  const params = await searchParams;
  const [invoices, staff] = await Promise.all([getInvoices(), getStaff()]);
  const canManage = staff?.role !== "user";
  const paid = invoices.filter((invoice) => invoice.status === "paid");
  const unpaid = invoices.filter((invoice) => invoice.status !== "paid" && invoice.status !== "void");
  const revenue = paid.reduce((total, invoice) => total + invoice.total_cents, 0);

  return (
    <div>
      <PageHeader
        title="Invoices"
        description="Repair totals, tax, and collection status."
        actions={<PrimaryLink href="/tickets">Open tickets</PrimaryLink>}
      />
      <Feedback notice={params.notice} error={params.error} />

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Panel className="px-5 py-4">
          <p className="text-[11px] text-muted">Collected</p>
          <p className="figure mt-1 text-[26px] font-semibold tracking-[-0.04em] text-positive-ink">{formatMoney(revenue)}</p>
        </Panel>
        <Panel className="px-5 py-4">
          <p className="text-[11px] text-muted">Unpaid</p>
          <p className="figure mt-1 text-[26px] font-semibold tracking-[-0.04em] text-warn">{unpaid.length}</p>
        </Panel>
        <Panel className="px-5 py-4">
          <p className="text-[11px] text-muted">Invoices issued</p>
          <p className="figure mt-1 text-[26px] font-semibold tracking-[-0.04em] text-ink">{invoices.length}</p>
        </Panel>
      </div>

      <Panel className="mt-4 overflow-hidden">
        <PanelHeader title="Invoice ledger" detail="Newest first. Payment marks the ticket collected." />
        {invoices.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title="No invoices yet"
              body="Open a ticket and generate an invoice once the repair total is known."
              action={<PrimaryLink href="/tickets">Open tickets</PrimaryLink>}
            />
          </div>
        ) : (
          <>
            <div className="hidden grid-cols-[0.8fr_0.8fr_1.2fr_1fr_0.6fr_0.7fr_0.7fr] gap-4 border-b border-line px-5 py-2.5 text-[10px] text-muted lg:grid">
              <span>Invoice</span>
              <span>Ticket</span>
              <span>Customer</span>
              <span>Device</span>
              <span>Status</span>
              <span className="text-right">Total</span>
              <span className="text-right">Action</span>
            </div>
            <div className="divide-y divide-line">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="grid gap-3 px-5 py-4 lg:grid-cols-[0.8fr_0.8fr_1.2fr_1fr_0.6fr_0.7fr_0.7fr] lg:items-center lg:gap-4"
                >
                  <div>
                    <p className="figure text-[12px] font-medium text-ink">{invoice.invoice_number}</p>
                    <p className="mt-0.5 text-[10px] text-muted">{formatDate(invoice.issued_at)}</p>
                  </div>
                  <Link href={`/tickets/${invoice.ticket_id}`} className="figure text-[12px] text-accent hover:text-[#ff8358]">
                    {invoice.ticket.ticket_number}
                  </Link>
                  <p className="truncate text-[12px] text-ink">{invoice.ticket.customer.full_name}</p>
                  <p className="truncate text-[12px] text-muted">
                    {invoice.ticket.device.brand} {invoice.ticket.device.model}
                  </p>
                  <InvoicePill status={invoice.status} />
                  <p className="figure text-[13px] font-medium text-ink lg:text-right">{formatMoney(invoice.total_cents)}</p>
                  <div className="flex lg:justify-end">
                    {invoice.status === "paid" ? (
                      <span className="text-[11px] text-positive-ink">Paid {formatDate(invoice.paid_at)}</span>
                    ) : invoice.status === "void" ? (
                      <span className="text-[11px] text-muted">Void</span>
                    ) : canManage ? (
                      <form action={markInvoicePaidAction}>
                        <input type="hidden" name="invoice_id" value={invoice.id} />
                        <input type="hidden" name="return_to" value="/invoices" />
                        <SubmitButton pendingText="Recording...">Mark paid</SubmitButton>
                      </form>
                    ) : (
                      <span className="text-[11px] text-muted">Manager review</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Panel>
    </div>
  );
}
