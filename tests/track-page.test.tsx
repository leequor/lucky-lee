import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/repair/queries", () => ({
  getTrackedTicket: vi.fn(),
}));

vi.mock("@/components/patchwork/repair-bench", () => ({
  RepairBench: () => <div>3D bench</div>,
}));

import TrackPage from "@/app/track/page";
import { getTrackedTicket } from "@/lib/repair/queries";

const tracked = {
  ticket_number: "PW-1041",
  status: "in_repair",
  issue: "Screen cracked after a drop.",
  created_at: "2026-10-27T10:00:00.000Z",
  updated_at: "2026-10-27T10:00:00.000Z",
  completed_at: null,
  customer_name: "Maya",
  device: { category: "phone", brand: "Apple", model: "iPhone 15 Pro" },
  events: [
    {
      status: "in_repair",
      body: "Status moved to in repair.",
      created_at: "2026-10-27T10:00:00.000Z",
    },
  ],
};

describe("TrackPage", () => {
  it("renders the tracking form before a lookup", async () => {
    render(await TrackPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByRole("heading", { name: "Track your repair." })).toBeInTheDocument();
    expect(screen.getByLabelText("Ticket code")).toBeInTheDocument();
    expect(screen.getByLabelText("Email or phone")).toBeInTheDocument();
    expect(screen.getByText("3D bench")).toBeInTheDocument();
    expect(vi.mocked(getTrackedTicket)).not.toHaveBeenCalled();
  });

  it("renders a matched repair and timeline", async () => {
    vi.mocked(getTrackedTicket).mockResolvedValue(tracked as never);
    render(
      await TrackPage({
        searchParams: Promise.resolve({ code: "TRACK1041", contact: "maya@example.com" }),
      }),
    );

    expect(screen.getAllByText("PW-1041").length).toBeGreaterThan(0);
    expect(screen.getByText("Apple iPhone 15 Pro")).toBeInTheDocument();
    expect(screen.getAllByText("In repair").length).toBeGreaterThan(0);
    expect(screen.getByText("Status moved to in repair.")).toBeInTheDocument();
    expect(screen.getByText(/Hi Maya/)).toBeInTheDocument();
  });

  it("explains a failed lookup", async () => {
    vi.mocked(getTrackedTicket).mockResolvedValue(null);
    render(
      await TrackPage({
        searchParams: Promise.resolve({ code: "NOPE", contact: "nobody@example.com" }),
      }),
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "No ticket matched that code and contact.",
    );
  });
});
