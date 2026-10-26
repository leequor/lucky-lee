import type { Metadata } from "next";
import Link from "next/link";

import { StatusPanel } from "@/components/landing/status-panel";
import { Logo } from "@/components/ui/logo";

export const metadata: Metadata = {
  title: "System status",
};

export default function StatusPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-cream">
      <div className="pointer-events-none absolute inset-0 bg-grid-soft [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
      <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-clover-200/50 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="flex items-center justify-between gap-4">
          <Logo />
          <Link
            href="/"
            className="text-sm font-semibold text-clover-700 hover:underline"
          >
            Back to app
          </Link>
        </div>

        <div className="mt-10 rounded-[2rem] border border-ink/10 bg-paper/90 p-6 shadow-card sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-clover-700">
            Connection check
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">
            Is everything awake?
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
            This page checks the Next.js app and the configured Supabase project. Use it
            before the demo so the team knows the environment is ready.
          </p>

          <div className="mt-7">
            <StatusPanel />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Health checks run on demand and are never cached.
        </p>
      </div>
    </main>
  );
}
