import Link from "next/link";

import {
  EmptyState,
  Feedback,
  PageHeader,
  Panel,
  PrimaryLink,
} from "@/components/workspace/ui";
import { getCustomers } from "@/lib/repair/queries";
import { initials } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; notice?: string; error?: string }>;
}) {
  const params = await searchParams;
  const customers = await getCustomers(params.q);

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Contact details, devices, and every repair attached to the person."
        actions={<PrimaryLink href="/customers/new">New customer</PrimaryLink>}
      />
      <Feedback notice={params.notice} error={params.error} />

      <Panel className="mt-5 overflow-hidden">
        <form className="flex flex-wrap items-center gap-2 border-b border-line p-4">
          <label className="relative min-w-[220px] flex-1">
            <span className="sr-only">Search customers</span>
            <input
              name="q"
              defaultValue={params.q}
              placeholder="Search name, email, phone, or company"
              className="h-9 w-full rounded-lg border border-line bg-paper px-3 text-[12px] text-ink outline-none placeholder:text-muted/60 focus:border-accent"
            />
          </label>
          <button
            type="submit"
            className="inline-flex h-9 items-center justify-center rounded-full bg-ink px-4 text-[12px] font-semibold text-paper hover:bg-white"
          >
            Search
          </button>
          {params.q ? (
            <Link href="/customers" className="inline-flex h-9 items-center rounded-full border border-line px-3 text-[12px] text-muted hover:text-ink">
              Clear
            </Link>
          ) : null}
        </form>

        {customers.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title={params.q ? "No matching customers" : "No customers yet"}
              body={
                params.q
                  ? "Try a different name, email, or phone number."
                  : "Add the first customer, attach their device, and open a ticket."
              }
              action={<PrimaryLink href="/customers/new">New customer</PrimaryLink>}
            />
          </div>
        ) : (
          <>
            <div className="hidden grid-cols-[1.5fr_1fr_0.55fr_0.55fr_0.55fr] gap-4 border-b border-line px-5 py-2.5 text-[10px] text-muted md:grid">
              <span>Customer</span>
              <span>Company</span>
              <span>Devices</span>
              <span>Open</span>
              <span className="text-right">All tickets</span>
            </div>
            <div className="divide-y divide-line">
              {customers.map((customer) => (
                <Link
                  key={customer.id}
                  href={`/customers/${customer.id}`}
                  className="grid gap-3 px-5 py-4 transition-colors hover:bg-wash/45 md:grid-cols-[1.5fr_1fr_0.55fr_0.55fr_0.55fr] md:items-center md:gap-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-wash text-[10px] font-semibold text-accent">
                      {initials(customer.full_name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-ink">{customer.full_name}</p>
                      <p className="mt-0.5 truncate text-[11px] text-muted">
                        {customer.phone}
                        {customer.email ? ` · ${customer.email}` : ""}
                      </p>
                    </div>
                  </div>
                  <p className="truncate text-[12px] text-muted">{customer.company || "—"}</p>
                  <p className="figure text-[12px] text-ink">{customer.device_count}</p>
                  <p className="figure text-[12px] text-ink">{customer.open_count}</p>
                  <p className="figure text-[12px] text-muted md:text-right">{customer.ticket_count}</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </Panel>

      <p className="mt-4 text-[11px] text-muted">{customers.length} customer{customers.length === 1 ? "" : "s"} shown.</p>
    </div>
  );
}
