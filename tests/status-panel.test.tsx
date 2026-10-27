import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { StatusPanel } from "@/components/landing/status-panel";

const healthyApp = {
  ok: true,
  status: 200,
  json: async () => ({
    status: "ok",
    service: "web",
    timestamp: "2026-10-26T12:00:00.000Z",
  }),
};

function databaseResponse(body: unknown, ok = true, status = 200) {
  return { ok, status, json: async () => body };
}

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("StatusPanel", () => {
  it("shows a connected app and Supabase", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(healthyApp)
        .mockResolvedValueOnce(
          databaseResponse({ status: "connected", latencyMs: 12 }),
        ),
    );

    render(<StatusPanel />);

    expect(screen.getByText("Checking the app health endpoint...")).toBeInTheDocument();
    expect(await screen.findByText(/Connected in 12 ms/)).toBeInTheDocument();
    expect(screen.getByText(/Service web responded/)).toBeInTheDocument();
  });

  it("shows a warning when Supabase is not configured", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(healthyApp)
        .mockResolvedValueOnce(
          databaseResponse({
            status: "not_configured",
            message: "Add the Supabase environment variables.",
          }),
        ),
    );

    render(<StatusPanel />);

    expect(await screen.findByText("Add the Supabase environment variables.")).toBeInTheDocument();
  });

  it("shows an error when the Supabase project is unavailable", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(healthyApp)
        .mockResolvedValueOnce(
          databaseResponse({
            status: "unavailable",
            message: "Supabase responded with HTTP 503.",
          }),
        ),
    );

    render(<StatusPanel />);

    expect(await screen.findByText("Supabase responded with HTTP 503.")).toBeInTheDocument();
  });

  it("shows an error when the app health endpoint fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce({ ok: false, status: 503 }).mockResolvedValueOnce(
        databaseResponse({ status: "connected" }),
      ),
    );

    render(<StatusPanel />);

    expect(await screen.findByText(/App health returned 503/)).toBeInTheDocument();
    expect(screen.getByText("The app health endpoint did not respond.")).toBeInTheDocument();
  });

  it("shows a network failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    render(<StatusPanel />);

    expect(await screen.findByText("network down")).toBeInTheDocument();
    expect(screen.getByText("The Supabase health endpoint did not respond.")).toBeInTheDocument();
  });
});
