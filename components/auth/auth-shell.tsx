import Link from "next/link";
import type { ReactNode } from "react";

import { RepairBench } from "@/components/patchwork/repair-bench";
import { Logo } from "@/components/ui/logo";

const PROOF = [
  {
    title: "Repair tickets",
    note: "Intake, diagnosis, parts, and status in one queue.",
  },
  {
    title: "Parts and invoices",
    note: "Stock moves with the repair. Totals are ready to collect.",
  },
  {
    title: "Customer tracking",
    note: "A public code shows progress without exposing customer data.",
  },
];

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-[100dvh] bg-paper">
      <div className="mx-auto grid min-h-[100dvh] w-full max-w-[1240px] lg:grid-cols-[1.02fr_0.98fr]">
        <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-line px-10 py-9 lg:flex xl:px-14">
          <div className="relative">
            <Logo />
          </div>

          <div className="relative py-8">
            <p className="reveal max-w-[11ch] text-[clamp(2.8rem,4.1vw,4.5rem)] font-semibold leading-[0.93] tracking-[-0.055em] text-ink">
              Every repair. One clear desk.
            </p>
            <p className="reveal reveal-delay-1 mt-5 max-w-[40ch] text-[14px] leading-6 text-muted">
              Patchwork keeps intake, parts, invoices, and customer updates in one working system.
            </p>

            <RepairBench compact className="reveal reveal-delay-2 mt-6 h-[280px] w-full max-w-[440px]" />

            <ul className="reveal reveal-delay-3 mt-4 grid gap-0 border-t border-line">
              {PROOF.map((item) => (
                <li key={item.title} className="flex gap-3 border-b border-line py-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <div>
                    <p className="text-[13px] font-medium text-ink">{item.title}</p>
                    <p className="mt-0.5 text-[12px] leading-5 text-muted">{item.note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative flex items-center justify-between text-[12px] text-muted">
            <p>Patchwork · Repair operations</p>
            <Link href="/track" className="transition-colors hover:text-ink">
              Public tracker
            </Link>
          </div>
        </aside>

        <div className="flex min-h-[100dvh] flex-col px-5 py-5 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between lg:hidden">
            <Logo />
            <Link
              href="/track"
              className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[12px] text-muted"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              Track repair
            </Link>
          </header>

          <div className="mx-auto mt-6 w-full max-w-form lg:hidden">
            <div className="relative h-32 overflow-hidden rounded-2xl border border-line bg-[#0B0D10]">
              <div className="scene-field pointer-events-none absolute inset-0" aria-hidden="true" />
              <RepairBench compact className="absolute inset-0 border-0" />
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center py-8 sm:py-10">{children}</div>

          <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 text-[12px] text-muted">
            <p>Patchwork · Repair operations</p>
            <p>Staff accounts are invite-only</p>
          </footer>
        </div>
      </div>
    </main>
  );
}
