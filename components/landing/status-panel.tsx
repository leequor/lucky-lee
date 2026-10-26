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

const STATE_LABEL = {
  loading: "Wait",
  ok: "Ready",
  warn: "Warn",
  error: "Fail",
} as const;

const STATE_STYLE = {
  loading: "border-ink/25 text-muted",
  ok: "border-ink bg-ink text-paper",
  warn: "border-signal-600 bg-signal-50 text-signal-700",
  error: "border-signal-600 bg-signal-700 text-white",
} as const;

function StatusRow({
  label,
  state,
  detail,
}: {
  label: string;
  state: keyof typeof STATE_LABEL;
  detail: string;
}) {
  return (
    <div className="grid gap-3 border-b border-ink/15 py-4 sm:grid-cols-[1fr_auto] sm:items-start">
      <div>
        <p className="text-[13px] font-medium text-ink">{label}</p>
        <p className="mt-1 max-w-[58ch] font-mono text-[10px] leading-5 text-muted">{detail}</p>
      </div>
      <span
        className={cn(
          "inline-flex w-fit border px-2 py-1 font-mono text-[10px] uppercase leading-none tracking-[0.12em]",
          STATE_STYLE[state],
        )}
      >
        {STATE_LABEL[state]}
      </span>
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
    <div>
      {error ? (
        <div className="mb-4 border-l-[3px] border-l-signal-600 bg-signal-50 px-4 py-3 font-mono text-[10px] leading-5 text-ink">
          {error}
        </div>
      ) : null}

      <div className="border-t border-ink/15">
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
      </div>

      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
        <a className="transition-colors hover:text-ink" href="/api/health">
          /api/health
        </a>
        <a className="transition-colors hover:text-ink" href="/api/health/supabase">
          /api/health/supabase
        </a>
      </div>
    </div>
  );
}
