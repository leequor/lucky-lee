import type { Metadata } from "next";
import Link from "next/link";

import { createCustomerAction } from "@/app/actions/repair";
import { FormField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { TextAreaField } from "@/components/workspace/form-controls";
import { Feedback, PageHeader, Panel } from "@/components/workspace/ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "New customer" };

export default async function NewCustomerPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div>
      <PageHeader
        title="New customer"
        description="Create the profile first, then attach the device and open a ticket."
        actions={
          <Link
            href="/customers"
            className="inline-flex h-9 items-center justify-center rounded-full border border-line bg-wash px-3.5 text-[12px] font-medium text-ink hover:border-[#3A414B]"
          >
            Back to customers
          </Link>
        }
      />
      <Feedback error={params.error} />

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel className="reveal p-5 sm:p-6">
          <form action={createCustomerAction} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="fullName" name="fullName" label="Full name" placeholder="Maya Chen" required />
              <FormField id="phone" name="phone" type="tel" label="Phone" placeholder="415-555-0142" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="email" name="email" type="email" label="Email" placeholder="maya@northline.studio" hint="Optional" />
              <FormField id="company" name="company" label="Company" placeholder="Optional" />
            </div>
            <TextAreaField id="notes" name="notes" label="Notes" placeholder="Anything the team should know about this customer." />
            <div className="flex justify-end border-t border-line pt-5">
              <SubmitButton pendingText="Creating...">Create customer</SubmitButton>
            </div>
          </form>
        </Panel>

        <div className="space-y-4">
          <Panel className="reveal reveal-delay-1 p-5">
            <h2 className="text-[14px] font-medium text-ink">Why create the profile first?</h2>
            <p className="mt-2 text-[12px] leading-5 text-muted">
              The profile holds contact details and every device. Tickets link to both, so repair
              history stays with the customer instead of a loose device.
            </p>
          </Panel>
          <Panel className="reveal reveal-delay-2 p-5">
            <h2 className="text-[14px] font-medium text-ink">Public tracking</h2>
            <p className="mt-2 text-[12px] leading-5 text-muted">
              Add an email or phone if the customer should be able to follow the repair at{" "}
              <span className="text-ink">/track</span>. The code is generated on the ticket.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
