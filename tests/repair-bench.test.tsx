import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("next/dynamic", () => ({
  default: () => () => <div data-testid="repair-scene" />,
}));

import { RepairBench } from "@/components/patchwork/repair-bench";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
});

describe("RepairBench", () => {
  it("renders the bench and switches layers", async () => {
    const browser = userEvent.setup();
    render(<RepairBench />);

    expect(await screen.findByTestId("repair-scene")).toBeInTheDocument();
    const battery = screen.getByRole("button", { name: /Battery/ });
    expect(battery).toHaveAttribute("aria-pressed", "false");
    await browser.click(battery);
    expect(battery).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/iPhone 15 Pro/)).toBeInTheDocument();
  });

  it("hides layer controls in compact mode", async () => {
    render(<RepairBench compact />);
    expect(await screen.findByTestId("repair-scene", undefined, { timeout: 3000 })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Battery/ })).not.toBeInTheDocument();
    expect(screen.getByText("Live 3D")).toBeInTheDocument();
  });
});
