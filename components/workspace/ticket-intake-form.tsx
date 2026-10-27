"use client";

import Link from "next/link";
import { useState } from "react";

import { createTicketAction } from "@/app/actions/repair";
import { FormField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { SelectField, TextAreaField } from "@/components/workspace/form-controls";
import { PRIORITY_META, TICKET_STATUS_META } from "@/lib/repair/format";
import {
  DEVICE_CATEGORIES,
  TICKET_PRIORITIES,
  type StaffProfile,
} from "@/lib/repair/types";
import { cn } from "@/lib/utils";

type CustomerOption = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string;
  devices: Array<{ id: string; category: string; brand: string; model: string }>;
};

export function TicketIntakeForm({
  customers,
  staff,
  initialMode = "existing",
}: {
  customers: CustomerOption[];
  staff: StaffProfile[];
  initialMode?: "existing" | "new";
}) {
  const [mode, setMode] = useState<"existing" | "new">(initialMode);
  const [customerId, setCustomerId] = useState("");
  const selected = customers.find((customer) => customer.id === customerId);
  const devices = selected?.devices ?? [];
  const [deviceId, setDeviceId] = useState("");

  const switchMode = (next: "existing" | "new") => {
    setMode(next);
    if (next === "new") setDeviceId("");
  };

  return (
    <form action={createTicketAction} className="space-y-5" noValidate>
      <div className="inline-flex rounded-full border border-line bg-paper p-1">
        <button
          type="button"
          onClick={() => switchMode("existing")}
          className={cn(
            "h-8 rounded-full px-3.5 text-[12px] font-medium transition-colors",
            mode === "existing" ? "bg-ink text-paper" : "text-muted hover:text-ink",
          )}
        >
          Existing customer
        </button>
        <button
          type="button"
          onClick={() => switchMode("new")}
          className={cn(
            "h-8 rounded-full px-3.5 text-[12px] font-medium transition-colors",
            mode === "new" ? "bg-ink text-paper" : "text-muted hover:text-ink",
          )}
        >
          New customer
        </button>
      </div>

      <input type="hidden" name="customer_mode" value={mode} />

      {mode === "existing" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            id="customer_id"
            name="customer_id"
            label="Customer"
            value={customerId}
            onChange={(event) => {
              const nextId = event.target.value;
              setCustomerId(nextId);
              setDeviceId("");
            }}
            required
          >
            <option value="">Choose a customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.full_name} · {customer.phone}
              </option>
            ))}
          </SelectField>

          <SelectField
            id="device_id"
            name="device_id"
            label="Device"
            value={deviceId}
            onChange={(event) => setDeviceId(event.target.value)}
            required
            disabled={!selected || devices.length === 0}
          >
            <option value="">{devices.length === 0 ? "No devices on file" : "Choose a device"}</option>
            {devices.map((device) => (
              <option key={device.id} value={device.id}>
                {device.brand} {device.model}
              </option>
            ))}
          </SelectField>

          {selected && devices.length === 0 ? (
            <p className="text-[12px] text-warn sm:col-span-2">
              This customer has no device yet.{" "}
              <Link href={`/customers/${selected.id}`} className="underline">
                Add a device
              </Link>{" "}
              first, or switch to “New customer”.
            </p>
          ) : null}

          {customers.length === 0 ? (
            <p className="text-[12px] text-warn sm:col-span-2">
              No customers yet.{" "}
              <Link href="/customers" className="underline">
                Add the first customer
              </Link>
              .
            </p>
          ) : null}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="new_customer_name" name="new_customer_name" label="Customer name" placeholder="Maya Chen" required />
            <FormField
              id="new_customer_phone"
              name="new_customer_phone"
              label="Phone"
              type="tel"
              placeholder="415-555-0142"
              required
            />
          </div>
          <FormField
            id="new_customer_email"
            name="new_customer_email"
            label="Email"
            type="email"
            placeholder="maya@northline.studio"
            hint="Optional, but needed for public tracking"
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <SelectField id="new_device_category" name="new_device_category" label="Device type" defaultValue="phone">
              {DEVICE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category[0].toUpperCase() + category.slice(1)}
                </option>
              ))}
            </SelectField>
            <FormField id="new_device_brand" name="new_device_brand" label="Brand" placeholder="Apple" required />
            <FormField id="new_device_model" name="new_device_model" label="Model" placeholder="iPhone 15 Pro" required />
          </div>
          <FormField id="new_device_serial" name="new_device_serial" label="Serial / IMEI" placeholder="Optional" />
        </div>
      )}

      <div className="border-t border-line pt-5">
        <TextAreaField
          id="issue"
          name="issue"
          label="What is wrong?"
          hint="Customer's words are fine"
          placeholder="Screen cracked after a drop; touch works intermittently near the top edge."
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField id="priority" name="priority" label="Priority" defaultValue="normal">
          {TICKET_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {PRIORITY_META[priority].label}
            </option>
          ))}
        </SelectField>
        <SelectField id="assigned_to" name="assigned_to" label="Assign to" defaultValue="">
          <option value="">Leave unassigned</option>
          {staff.map((member) => (
            <option key={member.id} value={member.id}>
              {member.full_name || member.email}
            </option>
          ))}
        </SelectField>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <FormField
          id="estimate"
          name="estimate"
          label="Estimate"
          inputMode="decimal"
          placeholder="0.00"
          hint="USD"
        />
        <FormField
          id="labour"
          name="labour"
          label="Labour"
          inputMode="decimal"
          placeholder="0.00"
          hint="USD"
        />
        <FormField id="due_at" name="due_at" type="date" label="Target date" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
        <p className="max-w-[52ch] text-[11px] leading-5 text-muted">
          Intake creates a public tracking code automatically. The customer can follow the repair
          with just that code.
        </p>
        <SubmitButton pendingText="Creating ticket...">Create ticket</SubmitButton>
      </div>

      <p className="text-[11px] text-muted">
        Starting at {TICKET_STATUS_META.intake.label.toLowerCase()} · you can change the status from the
        ticket page.
      </p>
    </form>
  );
}
