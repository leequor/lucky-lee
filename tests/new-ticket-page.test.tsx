import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/app/actions/repair", () => ({
  createTicketAction: vi.fn(),
}));

vi.mock("@/lib/repair/queries", () => ({
  getCustomerOptions: vi.fn(),
  getStaffProfiles: vi.fn(),
}));

import NewTicketPage from "@/app/(workspace)/tickets/new/page";
import { getCustomerOptions, getStaffProfiles } from "@/lib/repair/queries";

describe("NewTicketPage", () => {
  it("renders intake fields and customers", async () => {
    vi.mocked(getCustomerOptions).mockResolvedValue([
      {
        id: "c1",
        full_name: "Maya Chen",
        email: "maya@example.com",
        phone: "415-555-0142",
        devices: [{ id: "d1", category: "phone", brand: "Apple", model: "iPhone 15 Pro" }],
      },
    ]);
    vi.mocked(getStaffProfiles).mockResolvedValue([
      { id: "s1", email: "admin@example.com", full_name: "Demo Admin", role: "admin", created_at: null },
    ]);

    render(
      await NewTicketPage({
        searchParams: Promise.resolve({ mode: "existing", error: "Choose a device." }),
      }),
    );

    expect(screen.getByRole("heading", { name: "New intake" })).toBeInTheDocument();
    expect(screen.getByLabelText("Customer")).toBeInTheDocument();
    expect(screen.getByLabelText("Device")).toBeInTheDocument();
    expect(screen.getByLabelText("What is wrong?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create ticket" })).toBeInTheDocument();
    expect(screen.getByText("Choose a device.")).toBeInTheDocument();
    expect(screen.getByText("Intake checklist")).toBeInTheDocument();
  });
});
