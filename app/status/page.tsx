import type { Metadata } from "next";
import Link from "next/link";

import { RepairBench } from "@/components/patchwork/repair-bench";
import { StatusPanel } from "@/components/landing/status-panel";
import { Logo } from "@/components/ui/logo";

export const metadata: Metadata = {
  title: "System status",
};

const RUNBOOK = [
  {
    title: "The app is unreachable",
    body: "Check that the deployment is live and that /api/health returns 200, then reload this page.",
  },
  {
    title: "Supabase is unavailable",
    body: "Confirm the project URL and anon key on the deployment, then run the check again.",
  },
  {
    title: "Before service",
    body: "Open this page on the front-desk machine so both checks are warm before customers arrive.",
  },
];

export default function StatusPage() {
  return (
    <main className="min-h-[100dvh] bg-paper">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex h-16 max-w-canvas items-center justify-between px-5 sm:px-6">
          <Logo />
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[12px] text-muted transition-colors hover:border-[#335245] hover:text-ink"
          >
            Back to desk
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-canvas px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-8 sm:px-6 sm:pt-12">
        <div className="grid items-stretch gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="reveal rounded-2xl border border-line bg-surface p-6 sm:p-8">
            <div className="flex items-center gap-2 text-[12px] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              Live checks, never cached
            </div>
            <h1 className="mt-3 text-[34px] font-semibold leading-[1.02] tracking-[-0.045em] text-ink sm:text-[44px]">
              System status
            </h1>
            <p className="mt-3 max-w-[58ch] text-[14px] leading-6 text-muted">
              Checks the Next.js app and the configured Supabase project. Run this before the demo
              so the environment is known.
            </p>
            <div className="mt-6">
              <StatusPanel />
            </div>
          </div>

          <div className="reveal reveal-delay-1 relative hidden min-h-[280px] overflow-hidden rounded-2xl border border-line bg-[#0B0D10] lg:block">
            <RepairBench compact className="absolute inset-0 border-0" />
            <div className="pointer-events-none absolute inset-x-5 bottom-5">
              <p className="text-[11px] text-muted">Bench check</p>
              <p className="mt-1 text-[14px] font-medium text-ink">Two checks. One clear answer.</p>
            </div>
          </div>
        </div>

        <section className="reveal reveal-delay-2 mt-9">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-[17px] font-medium text-ink">If a check fails</h2>
            <p className="text-[12px] text-muted">Work top to bottom.</p>
          </div>
          <div className="mt-3 overflow-hidden rounded-2xl border border-line bg-surface">
            {RUNBOOK.map((item) => (
              <div key={item.title} className="border-t border-line px-5 py-4 first:border-t-0 sm:px-6">
                <p className="text-[14px] font-medium text-ink">{item.title}</p>
                <p className="mt-0.5 max-w-[78ch] text-[13px] leading-5 text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-8 border-t border-line pt-4 text-[12px] text-muted">
          Health checks run on demand and are never cached.
        </footer>
      </div>
    </main>
  );
}
