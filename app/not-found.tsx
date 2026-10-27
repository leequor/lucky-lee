import Link from "next/link";
import type { Metadata } from "next";

import { RepairBench } from "@/components/patchwork/repair-bench";
import { Logo } from "@/components/ui/logo";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-paper px-5 py-6 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-canvas flex-col">
        <Logo />

        <div className="grid flex-1 items-center gap-8 py-14 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="figure text-[13px] text-accent">404</p>
            <h1 className="mt-3 text-[42px] font-semibold leading-[0.98] tracking-[-0.05em] text-ink sm:text-[56px]">
              This page is off the bench.
            </h1>
            <p className="mt-4 max-w-[46ch] text-[14px] leading-6 text-muted">
              The link may be old, or the page moved. Head back to the repair desk and pick up from
              the queue.
            </p>
            <div className="mt-7">
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-[14px] font-medium text-paper transition-colors hover:bg-white"
              >
                Back to the desk
              </Link>
            </div>
          </div>

          <RepairBench compact className="min-h-[280px]" />
        </div>

        <p className="border-t border-line pt-4 text-[12px] text-muted">
          Patchwork · Repair operations
        </p>
      </div>
    </main>
  );
}
