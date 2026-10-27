import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/app/actions/repair", () => ({
  createTicketAction: vi.fn(),
}));

import { TicketIntakeForm } from "@/components/workspace/ticket-intake-form";

const customers = [
  {
    id: "customer-1",
    full_name: "Maya Chen",
    email: "maya@example.com",
    phone: "415-555-0142",
    devices: [{ id: "device-1", category: "phone", brand: "Apple", model: "iPhone 15 Pro" }],
  },
  {
    id: "customer-2",
    full_name: "Daniel Ortiz",
    email: null,
    phone: "415-555-0188",
    devices: [],
  },
];

const staff = [
  { id: "staff-1", email: "alex@example.com", full_name: "Alex Campita", role: "superadmin" as const, created_at: null },
];

describe("TicketIntakeForm", () => {
  it("starts with no customer selected and asks for a device", async () => {
    const browser = userEvent.setup();
    render(<TicketIntakeForm customers={customers} staff={staff} />);

    expect(screen.getByLabelText("Customer")).toHaveValue("");
    expect(screen.getByLabelText("Device")).toBeDisabled();
    expect(screen.getByLabelText("What is wrong?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create ticket" })).toBeInTheDocument();

    await browser.selectOptions(screen.getByLabelText("Customer"), "customer-1");
    expect(screen.getByLabelText("Device")).toHaveValue("");
    expect(screen.getByLabelText("Device")).not.toBeDisabled();

    await browser.selectOptions(screen.getByLabelText("Device"), "device-1");
    expect(screen.getByLabelText("Device")).toHaveValue("device-1");

    await browser.selectOptions(screen.getByLabelText("Customer"), "customer-2");
    expect(screen.getByLabelText("Device")).toBeDisabled();
    expect(screen.getByText(/This customer has no device yet/)).toBeInTheDocument();
  });

  it("switches to new customer fields", async () => {
    const browser = userEvent.setup();
    render(<TicketIntakeForm customers={customers} staff={staff} />);

    await browser.click(screen.getByRole("button", { name: "New customer" }));
    expect(screen.getByLabelText("Customer name")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone")).toBeInTheDocument();
    expect(screen.getByLabelText("Brand")).toBeInTheDocument();
    expect(screen.getByLabelText("Model")).toBeInTheDocument();
    expect(screen.getByLabelText("Device type")).toBeInTheDocument();
  });

  it("supports an empty customer list", () => {
    render(<TicketIntakeForm customers={[]} staff={staff} initialMode="new" />);
    expect(screen.queryByText(/No customers yet/)).not.toBeInTheDocument();
    expect(screen.getByLabelText("Customer name")).toBeInTheDocument();
  });
});
