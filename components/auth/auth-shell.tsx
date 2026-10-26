import type { ReactNode } from "react";

import { Logo } from "@/components/ui/logo";

const FEATURES = [
  {
    title: "One account, every screen",
    body: "Register once, then move between login, reset, and the landing page without friction.",
  },
  {
    title: "Sessions handled properly",
    body: "Supabase Auth and secure cookies keep the session fresh without putting secrets in the browser.",
  },
  {
    title: "A reset flow that respects people",
    body: "Clear messages for expired links, short passwords, and the happy path.",
  },
];

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-cream">
      <div className="pointer-events-none absolute inset-0 bg-grid-soft [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-clover-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-coral-100/70 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-7 sm:px-8 lg:grid lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-16 lg:py-10">
        <div className="mb-8 flex items-center justify-between lg:hidden">
          <Logo />
          <span className="rounded-full border border-ink/10 bg-white/60 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-ink/55">
            Sprint 1
          </span>
        </div>

        <section className="hidden lg:block">
          <Logo />
          <p className="mt-14 text-xs font-bold uppercase tracking-[0.24em] text-clover-700">
            Account access, sorted
          </p>
          <h2 className="mt-4 max-w-xl font-display text-5xl font-semibold leading-[1.04] tracking-tight text-ink text-balance">
            A calmer way to get everyone in.
          </h2>
          <p className="mt-5 max-w-lg text-[15px] leading-7 text-muted">
            Lucky Patcher brings registration, sign-in, password recovery, and the team
            dashboard into one consistent experience.
          </p>

          <div className="mt-10 space-y-5">
            {FEATURES.map((feature, index) => (
              <div key={feature.title} className="flex gap-4">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-clover-100 text-xs font-bold text-clover-800">
                  0{index + 1}
                </span>
                <div>
                  <p className="font-semibold text-ink">{feature.title}</p>
                  <p className="mt-1 max-w-md text-sm leading-6 text-muted">{feature.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex items-center gap-3 text-xs font-medium text-ink/45">
            <span className="h-px w-10 bg-ink/20" />
            Built by the Lucky Patcher team
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center lg:justify-end">
          <div className="w-full max-w-md">{children}</div>
        </section>
      </div>
    </main>
  );
}
