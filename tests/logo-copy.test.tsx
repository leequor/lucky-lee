import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CopyButton } from "@/components/workspace/copy-button";
import { Logo } from "@/components/ui/logo";

describe("CopyButton", () => {
  it("copies a value and confirms", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    const browser = userEvent.setup();
    render(<CopyButton value="TRACK1041" />);

    await browser.click(screen.getByRole("button", { name: /Copy TRACK1041/ }));
    expect(await screen.findByText("Copied")).toBeInTheDocument();
  });
});

describe("Logo", () => {
  it("renders the linked wordmark", () => {
    render(<Logo />);
    const link = screen.getByRole("link", { name: /Patchwork home/ });
    expect(link).toHaveAttribute("href", "/");
    expect(withinLogo(link)).toBe("Patchwork");
  });

  it("supports mark-only and non-linked variants", () => {
    render(<Logo markOnly href="" />);
    expect(screen.queryByText("Patchwork")).not.toBeInTheDocument();
  });
});

function withinLogo(element: HTMLElement) {
  return element.querySelector("span:last-child")?.textContent ?? "";
}
