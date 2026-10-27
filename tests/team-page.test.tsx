import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/app/actions/repair", () => ({
  inviteStaffAction: vi.fn(),
  updateRoleAction: vi.fn(),
}));

vi.mock("@/lib/repair/queries", () => ({
  getDashboardData: vi.fn(),
  getStaffProfiles: vi.fn(),
}));

vi.mock("@/lib/repair/session", () => ({
  getStaff: vi.fn(),
}));

import TeamPage from "@/app/(workspace)/team/page";
import { getDashboardData, getStaffProfiles } from "@/lib/repair/queries";
import { getStaff } from "@/lib/repair/session";

const profiles = [
  { id: "s1", email: "alex@example.com", full_name: "Alex", role: "superadmin" as const, created_at: null },
  { id: "s2", email: "admin@example.com", full_name: "Demo Admin", role: "admin" as const, created_at: null },
  { id: "s3", email: "user@example.com", full_name: "Demo User", role: "user" as const, created_at: null },
];

const dashboard = {
  openCount: 4,
  teamLoad: [
    { id: "s1", full_name: "Alex", email: "alex@example.com", role: "superadmin", open: 1, active: 0 },
    { id: "s2", full_name: "Demo Admin", email: "admin@example.com", role: "admin", open: 2, active: 1 },
    { id: "s3", full_name: "Demo User", email: "user@example.com", role: "user", open: 1, active: 1 },
  ],
};

const owner = { id: "s1", email: "alex@example.com", role: "superadmin" as const, fullName: "Alex", createdAt: null };
const manager = { id: "s2", email: "admin@example.com", role: "admin" as const, fullName: "Demo Admin", createdAt: null };
const technician = { id: "s3", email: "user@example.com", role: "user" as const, fullName: "Demo User", createdAt: null };

async function renderTeam(staff: typeof owner | typeof manager | typeof technician) {
  vi.mocked(getStaff).mockResolvedValue(staff);
  vi.mocked(getStaffProfiles).mockResolvedValue(profiles);
  vi.mocked(getDashboardData).mockResolvedValue(dashboard as never);

  render(await TeamPage({ searchParams: Promise.resolve({}) }));
}

describe("TeamPage", () => {
  it("lets owners manage every role", async () => {
    await renderTeam(owner);

    expect(screen.getAllByRole("option", { name: "Owner" })).toHaveLength(4);
    expect(screen.getByRole("button", { name: "Create staff account" })).toBeInTheDocument();
    expect(screen.queryByText("Owner-managed")).not.toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Save" })).toHaveLength(3);
  });

  it("stops managers from touching owner rows or granting owner", async () => {
    await renderTeam(manager);

    expect(screen.queryByRole("option", { name: "Owner" })).not.toBeInTheDocument();
    expect(screen.getByText("Owner-managed")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create staff account" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Save" })).toHaveLength(2);
  });

  it("shows technicians a read-only directory", async () => {
    await renderTeam(technician);

    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Create staff account" })).not.toBeInTheDocument();
    expect(screen.getByText(/Your account is a technician/)).toBeInTheDocument();
    expect(screen.getByText("Owner-managed")).toBeInTheDocument();
    expect(screen.getAllByText("Manager-managed")).toHaveLength(2);
  });
});
