import type { Metadata } from "next";
import Link from "next/link";

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
    title: "Before the demo",
    body: "Seed the demo accounts and open this page on the presentation laptop so both checks are warm.",
  },
];

export default function StatusPage() {
  return (
    <main className="min-h-[100dvh] bg-paper">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-16 max-w-canvas items-center justify-between px-6">
          <Logo />
          <Link href="/" className="text-[13px] text-muted transition-colors hover:text-ink">
            Back to app
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-canvas px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-10">
        <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-ink">
          System status
        </h1>
        <p className="mt-2 max-w-[62ch] text-[14px] leading-6 text-muted">
          Checks the Next.js app and the configured Supabase project. Run this before the demo so
          the environment is known.
        </p>

        <div className="mt-6">
          <StatusPanel />
        </div>

        <section className="mt-8">
          <h2 className="text-[16px] font-medium text-ink">If a check fails</h2>
          <div className="mt-3 overflow-hidden rounded-lg border border-line bg-surface">
            {RUNBOOK.map((item) => (
              <div key={item.title} className="border-t border-line px-5 py-4 first:border-t-0">
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
