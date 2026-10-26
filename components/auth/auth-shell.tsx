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
        <section className="flex flex-col border-ink/15 px-5 py-6 sm:px-10 lg:border-r lg:px-14 lg:py-9">
          <div className="flex items-center justify-between gap-4">
            <Logo />
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              S1 / Access
            </span>
          </div>

          <div className="pt-16 lg:mt-auto lg:pb-12 lg:pt-20">
            <div className="mb-6 h-[3px] w-10 bg-signal-500" aria-hidden="true" />
            <p className="label">Sprint 01 / Account access</p>
            <h1 className="mt-5 max-w-[12ch] text-[clamp(3rem,7vw,6.2rem)] font-semibold leading-[0.9] tracking-[-0.065em] text-ink">
              One account.
              <br />
              Everything after.
            </h1>
            <p className="mt-6 max-w-[42ch] text-[15px] leading-6 text-muted">
              Register, sign in, and recover your password. The team dashboard and role
              controls sit behind the same door.
            </p>
          </div>

          <dl className="grid grid-cols-3 border-t border-ink/15 pt-5">
            {FACTS.map((fact) => (
              <div key={fact.label} className="border-r border-ink/15 pr-3 last:border-r-0">
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  {fact.label}
                </dt>
                <dd className="mt-2 text-[12px] font-medium text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="flex items-center px-5 py-12 sm:px-10 lg:px-14 lg:py-16">
          <div className="w-full max-w-[420px]">{children}</div>
        </section>
      </div>
    </main>
  );
}
