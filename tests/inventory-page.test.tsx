import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/app/actions/repair", () => ({
  addPartAction: vi.fn(),
  adjustStockAction: vi.fn(),
}));

vi.mock("@/lib/repair/queries", () => ({
  getInventory: vi.fn(),
}));

vi.mock("@/lib/repair/session", () => ({
  getStaff: vi.fn(),
}));

import InventoryPage from "@/app/(workspace)/inventory/page";
import { getInventory } from "@/lib/repair/queries";
import { getStaff } from "@/lib/repair/session";

const parts = [
  {
    id: "p1",
    sku: "SCR-IP15-OEM",
    name: "iPhone 15 OLED assembly",
    category: "screen",
    stock: 0,
    reorder_level: 2,
    cost_cents: 12900,
    price_cents: 24900,
    supplier: "MobileParts Co.",
    created_at: "2026-10-01T10:00:00.000Z",
    updated_at: "2026-10-01T10:00:00.000Z",
  },
  {
    id: "p2",
    sku: "BAT-IP15",
    name: "iPhone 15 battery",
    category: "battery",
    stock: 1,
    reorder_level: 2,
    cost_cents: 3200,
    price_cents: 7900,
    supplier: null,
    created_at: "2026-10-01T10:00:00.000Z",
    updated_at: "2026-10-01T10:00:00.000Z",
  },
  {
    id: "p3",
    sku: "ADH-IP15",
    name: "iPhone 15 adhesive gasket",
    category: "supplies",
    stock: 9,
    reorder_level: 3,
    cost_cents: 300,
    price_cents: 900,
    supplier: "MobileParts Co.",
    created_at: "2026-10-01T10:00:00.000Z",
    updated_at: "2026-10-01T10:00:00.000Z",
  },
];

const owner = { id: "s1", email: "alex@example.com", role: "superadmin" as const, fullName: "Alex", createdAt: null };
const technician = { id: "s3", email: "user@example.com", role: "user" as const, fullName: "Demo User", createdAt: null };

describe("InventoryPage", () => {
  it("gives managers the add form and stock controls", async () => {
    vi.mocked(getStaff).mockResolvedValue(owner);
    vi.mocked(getInventory).mockResolvedValue(parts as never);

    render(await InventoryPage({ searchParams: Promise.resolve({ q: "iPhone", new: "1" }) }));

    expect(screen.getByText("Add a part")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Add part" })).toHaveAttribute("href", "/inventory?new=1");
    expect(screen.getByRole("button", { name: "Add one iPhone 15 battery" })).toBeInTheDocument();
    expect(screen.getByText("Out")).toBeInTheDocument();
    expect(screen.getByText("Low")).toBeInTheDocument();
    expect(screen.getAllByText("iPhone 15 battery").length).toBeGreaterThan(0);
  });

  it("keeps stock read-only for technicians", async () => {
    vi.mocked(getStaff).mockResolvedValue(technician);
    vi.mocked(getInventory).mockResolvedValue(parts as never);

    render(await InventoryPage({ searchParams: Promise.resolve({ new: "1" }) }));

    expect(screen.queryByText("Add a part")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Add part" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Add one|Remove one/ })).not.toBeInTheDocument();
    expect(screen.getAllByText("Manager-managed").length).toBe(3);
  });
});
