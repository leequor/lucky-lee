import { describe, expect, it, vi } from "vitest";

import {
  deviceLabel,
  formatCompactMoney,
  formatDate,
  formatMoney,
  formatRelative,
  formatShortDate,
  isOpenStatus,
  openStatuses,
  PRIORITY_META,
  ROLE_LABELS,
  statusLabel,
  taxForSubtotal,
  TICKET_STATUS_META,
} from "@/lib/repair/format";
import { TICKET_STATUSES, TICKET_PRIORITIES } from "@/lib/repair/types";

describe("repair format helpers", () => {
  it("formats money in cents", () => {
    expect(formatMoney(123456)).toBe("$1,234.56");
    expect(formatMoney(0)).toBe("$0.00");
    expect(formatMoney(null)).toBe("$0.00");
    expect(formatCompactMoney(123456)).toBe("$1,235");
    expect(formatCompactMoney(1234567)).toBe("$12.3K");
  });

  it("formats dates and relative time", () => {
    expect(formatDate(null)).toBe("—");
    expect(formatShortDate(null)).toBe("—");
    expect(formatDate("2026-10-27T12:00:00.000Z")).toContain("2026");
    expect(formatShortDate("2026-10-27T12:00:00.000Z")).toContain("Oct");
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-27T12:00:00.000Z"));
    expect(formatRelative(null)).toBe("—");
    expect(formatRelative("2026-10-27T12:00:00.000Z")).toMatch(/now|this minute/);
    expect(formatRelative("2026-10-27T10:00:00.000Z")).toContain("2 hours");
    expect(formatRelative("2026-10-24T12:00:00.000Z")).toContain("3 days");
    expect(formatRelative("2026-08-01T12:00:00.000Z")).toContain("2026");
    vi.useRealTimers();
  });

  it("labels every status and priority", () => {
    for (const status of TICKET_STATUSES) {
      expect(TICKET_STATUS_META[status].label.length).toBeGreaterThan(0);
      expect(statusLabel(status)).toBe(TICKET_STATUS_META[status].label);
    }
    for (const priority of TICKET_PRIORITIES) {
      expect(PRIORITY_META[priority].rank).toBeGreaterThanOrEqual(0);
    }
    expect(ROLE_LABELS.superadmin).toBe("Owner");
    expect(ROLE_LABELS.user).toBe("Technician");
  });

  it("identifies open statuses and computes tax", () => {
    expect(openStatuses()).toEqual(["intake", "diagnosing", "waiting_parts", "in_repair"]);
    expect(isOpenStatus("ready")).toBe(false);
    expect(isOpenStatus("in_repair")).toBe(true);
    expect(taxForSubtotal(10000)).toBe(1200);
  });

  it("builds a readable device label", () => {
    expect(deviceLabel({ category: "phone", brand: "Apple", model: "iPhone 15" })).toBe(
      "Phone · Apple iPhone 15",
    );
  });
});
