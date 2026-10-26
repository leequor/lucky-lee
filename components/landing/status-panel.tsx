"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type AppHealth = {
  status: string;
  service: string;
  timestamp: string;
};

type SupabaseHealth = {
  status: "connected" | "not_configured" | "unavailable";
  latencyMs?: number;
  message?: string;
};

function StatusRow({
  label,
  state,
  detail,
}: {
  label: string;
  state: "loading" | "ok" | "warn" | "error";
  detail: string;
}) {
  const color =
    state === "ok"
      ? "bg-clover-500"
      : state === "warn"
        ? "bg-coral-400"
        : state === "error"
          ? "bg-coral-600"
          : "bg-ink/25";

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-ink/8 bg-white/55 p-4">
      <span className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", color)} aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold text-ink">{label}</p>
        <p className="mt-1 text-xs leading-5 text-muted">{detail}</p>
      </div>
    </div>
  );
}

export function StatusPanel() {
  const [app, setApp] = useState<AppHealth | null>(null);
  const [database, setDatabase] = useState<SupabaseHealth | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [appResponse, databaseResponse] = await Promise.all([
          fetch("/api/health", { cache: "no-store" }),
          fetch("/api/health/supabase", { cache: "no-store" }),
        ]);

        if (!appResponse.ok) {
          throw new Error(`App health returned ${appResponse.status}.`);
        }

        const appData = (await appResponse.json()) as AppHealth;
        const databaseData = (await databaseResponse.json()) as SupabaseHealth;

        if (!cancelled) {
          setApp(appData);
          setDatabase(databaseData);
        }
      } catch (caught) {
        if (!cancelled) {
          setError(caught instanceof Error ? caught.message : "Unable to load health checks.");
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-5">
      {error ? (
        <div className="rounded-2xl border border-coral-500/25 bg-coral-100/70 px-4 py-3 text-sm text-coral-600">
          {error}
        </div>
      ) : null}

      <StatusRow
        label="Next.js app"
        state={app ? "ok" : error ? "error" : "loading"}
        detail={
          app
            ? `Service ${app.service} responded at ${new Date(app.timestamp).toLocaleTimeString()}.`
            : error
              ? "The app health endpoint did not respond."
              : "Checking the app health endpoint..."
        }
      />

      <StatusRow
        label="Supabase connection"
        state={
          !database
            ? error
              ? "error"
              : "loading"
            : database.status === "connected"
              ? "ok"
              : database.status === "not_configured"
                ? "warn"
                : "error"
        }
        detail={
          database
            ? database.status === "connected"
              ? `Connected in ${database.latencyMs ?? 0} ms.`
              : database.message || database.status
            : error
              ? "The Supabase health endpoint did not respond."
              : "Checking the Supabase Auth endpoint..."
        }
      />

      <div className="rounded-2xl border border-ink/8 bg-white/45 p-4 text-xs leading-5 text-muted">
        <p className="font-semibold text-ink">Raw endpoints</p>
        <p className="mt-1">
          <a className="font-semibold text-clover-700 hover:underline" href="/api/health">
            /api/health
          </a>{" "}
          checks the web app.{" "}
          <a className="font-semibold text-clover-700 hover:underline" href="/api/health/supabase">
            /api/health/supabase
          </a>{" "}
          checks the configured Supabase project.
        </p>
      </div>
    </div>
  );
}
