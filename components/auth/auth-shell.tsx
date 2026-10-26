import type { ReactNode } from "react";

import { Logo } from "@/components/ui/logo";

const FACTS = [
  { label: "Auth", value: "Supabase" },
  { label: "Session", value: "Secure cookie" },
  { label: "Reset", value: "Single use" },
];

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-[100dvh] bg-paper">
      <div className="mx-auto grid min-h-[100dvh] max-w-[1500px] lg:grid-cols-[1.15fr_0.85fr]">
        <section className="flex flex-col bg-ink px-5 py-6 text-paper sm:px-10 lg:px-14 lg:py-9">
          <div className="flex items-center justify-between gap-4">
            <Logo />
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/45">
              S1 / Access
            </span>
          </div>

          <div className="flex flex-1 items-center py-14 lg:py-10">
            <div>
              <div className="mb-6 h-[4px] w-12 bg-signal-500" aria-hidden="true" />
              <p className="font-mono text-[10px] font-bold uppercase leading-none tracking-[0.16em] text-signal-500">
                Sprint 01 / Account access
              </p>
              <h1 className="mt-5 max-w-[13ch] text-[clamp(2.7rem,4.6vw,4.5rem)] font-semibold leading-[0.94] tracking-[-0.055em] text-paper">
                One account.
                <br />
                <span className="text-signal-500">Everything after.</span>
              </h1>
              <p className="mt-6 max-w-[42ch] text-[15px] leading-6 text-paper/60">
                Register, sign in, and recover your password. The team dashboard and role
                controls sit behind the same door.
              </p>
            </div>
          </div>

          <dl className="grid grid-cols-3 border-t border-paper/20 pt-5">
            {FACTS.map((fact) => (
              <div key={fact.label} className="border-r border-paper/20 pr-3 last:border-r-0">
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper/40">
                  {fact.label}
                </dt>
                <dd className="mt-2 text-[12px] font-medium text-paper">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="flex items-center bg-paper px-5 py-12 sm:px-10 lg:px-14 lg:py-16">
          <div className="w-full max-w-[420px]">{children}</div>
        </section>
      </div>
    </main>
  );
}
