import Link from "next/link";

import { Feedback, PageHeader, Panel } from "@/components/workspace/ui";
import { TicketIntakeForm } from "@/components/workspace/ticket-intake-form";
import { getCustomerOptions, getStaffProfiles } from "@/lib/repair/queries";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ error?: string; mode?: string }>;

export default async function NewTicketPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const [customers, staff] = await Promise.all([getCustomerOptions(), getStaffProfiles()]);

  return (
    <div>
      <PageHeader
        title="New intake"
        description="Log the device, record the fault, and put it in the queue."
        actions={
          <Link
            href="/tickets"
            className="inline-flex h-9 items-center justify-center rounded-full border border-line bg-wash px-3.5 text-[12px] font-medium text-ink transition-colors hover:border-[#3A414B]"
          >
            Back to tickets
          </Link>
        }
      />
      <Feedback error={params.error} />

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.45fr_0.55fr]">
        <Panel className="reveal p-5 sm:p-6">
          <TicketIntakeForm
            customers={customers}
            staff={staff}
            initialMode={params.mode === "new" ? "new" : "existing"}
          />
        </Panel>

        <div className="grid content-start gap-4">
          <Panel className="reveal reveal-delay-1 overflow-hidden">
            <div className="border-b border-line px-5 py-4">
              <h2 className="text-[15px] font-medium text-ink">Intake checklist</h2>
              <p className="mt-0.5 text-[12px] text-muted">Do these before the device leaves the counter.</p>
            </div>
            <ol className="divide-y divide-line">
              {[
                "Confirm the customer's phone and email.",
                "Record the exact fault and any existing damage.",
                "Photograph the device if it is already damaged.",
                "Give the customer the tracking code from the ticket page.",
              ].map((item, index) => (
                <li key={item} className="flex gap-3 px-5 py-3">
                  <span className="figure mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-line text-[10px] text-muted">
                    {index + 1}
                  </span>
                  <p className="text-[12px] leading-5 text-muted">{item}</p>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel className="reveal reveal-delay-2 p-5">
            <h2 className="text-[14px] font-medium text-ink">What the customer gets</h2>
            <p className="mt-2 text-[12px] leading-5 text-muted">
              Every ticket gets a public code. The customer opens{" "}
              <Link href="/track" className="text-accent hover:text-[#ff8358]">
                /track
              </Link>{" "}
              and enters the code plus the email or phone on file.
            </p>
            <div className="mt-4 rounded-xl border border-line bg-paper p-3">
              <p className="text-[10px] text-muted">Customer sees</p>
              <p className="mt-1 text-[12px] text-ink">Status, device, issue, and visible timeline notes.</p>
            </div>
          </Panel>

          <Panel className="reveal reveal-delay-3 p-5">
            <h2 className="text-[14px] font-medium text-ink">Billing default</h2>
            <p className="mt-2 text-[12px] leading-5 text-muted">
              Invoices add labour plus parts and apply a 12% tax. You can edit labour and the estimate
              from the ticket after diagnosis.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
