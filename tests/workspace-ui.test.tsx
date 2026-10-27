import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  DataBar,
  EmptyState,
  Feedback,
  InvoicePill,
  PageHeader,
  Panel,
  PrimaryLink,
  PriorityPill,
  SecondaryLink,
  StatusPill,
} from "@/components/workspace/ui";

describe("workspace UI", () => {
  it("renders ticket status and priority pills", () => {
    render(
      <div>
        <StatusPill status="waiting_parts" />
        <PriorityPill priority="urgent" />
      </div>,
    );
    expect(screen.getByText("Waiting on parts")).toBeInTheDocument();
    expect(screen.getByText("Urgent")).toBeInTheDocument();
  });

  it("renders invoice states", () => {
    render(<InvoicePill status="paid" />);
    expect(screen.getByText("Paid")).toBeInTheDocument();
  });

  it("renders page headers, panels, and actions", () => {
    render(
      <Panel>
        <PageHeader title="Tickets" description="Every repair" actions={<PrimaryLink href="/tickets/new">New ticket</PrimaryLink>} />
        <SecondaryLink href="/inventory">Inventory</SecondaryLink>
      </Panel>,
    );
    expect(screen.getByRole("heading", { name: "Tickets" })).toBeInTheDocument();
    expect(screen.getByText("Every repair")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "New ticket" })).toHaveAttribute("href", "/tickets/new");
    expect(screen.getByRole("link", { name: "Inventory" })).toHaveAttribute("href", "/inventory");
  });

  it("renders feedback states and empty states", () => {
    const { rerender } = render(<Feedback notice="Saved." />);
    expect(screen.getByRole("status")).toHaveTextContent("Saved.");
    rerender(<Feedback error="Broken." />);
    expect(screen.getByRole("alert")).toHaveTextContent("Broken.");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    rerender(<EmptyState title="Nothing here" body="Add something." />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
    expect(screen.getByText("Add something.")).toBeInTheDocument();
  });

  it("renders a clamped data bar", () => {
    const { container } = render(<DataBar value={15} max={10} />);
    const fill = container.firstElementChild?.lastElementChild;
    expect(fill).toHaveStyle({ width: "100%" });
  });
});
