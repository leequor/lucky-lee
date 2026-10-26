import type { Metadata } from "next";
import Link from "next/link";

import { StatusPanel } from "@/components/landing/status-panel";
import { Logo } from "@/components/ui/logo";

export const metadata: Metadata = {
  title: "System status",
};

export default function StatusPage() {
  return (
    <main className="min-h-[100dvh] bg-paper">
      <div className="mx-auto max-w-[1080px] px-5 sm:px-8">
        <header className="flex h-16 items-center justify-between border-b border-ink/15">
          <Logo />
          <Link
            href="/"
            className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-ink"
          >
            Back to app
          </Link>
        </header>

        <section className="grid gap-10 py-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14 lg:py-16">
          <div>
            <div className="mb-6 h-[3px] w-8 bg-signal-500" aria-hidden="true" />
            <p className="label">System / Health</p>
            <h1 className="mt-4 text-[clamp(2.6rem,5vw,4.4rem)] font-semibold leading-[0.92] tracking-[-0.06em] text-ink">
              System
              <br />
              status.
            </h1>
            <p className="mt-6 max-w-[34ch] text-[14px] leading-6 text-muted">
              Checks the Next.js app and the configured Supabase project. Run this before the
              demo so the environment is known.
            </p>
          </div>

          <div className="lg:pt-2">
            <StatusPanel />
          </div>
        </section>

        <footer className="border-t border-ink/15 py-5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
          Health checks run on demand / never cached
        </footer>
      </div>
    </main>
  );
}
