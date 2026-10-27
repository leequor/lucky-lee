import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/ui/logo";
import { LuckyScene } from "@/components/visual/lucky-scene";

const PROOF = [
  {
    title: "Supabase Auth",
    note: "Sessions live in secure cookies. Passwords never touch this app.",
  },
  {
    title: "Roles by RLS",
    note: "Profiles and roles are scoped to the signed-in account.",
  },
  {
    title: "Single-use recovery",
    note: "Reset links expire after one use and are verified by Supabase.",
  },
];

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-[100dvh] bg-paper">
      <div className="mx-auto grid min-h-[100dvh] w-full max-w-[1240px] lg:grid-cols-[1.02fr_0.98fr]">
        <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-line px-10 py-9 lg:flex xl:px-14">
          <div className="scene-field pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="relative">
            <Logo />
          </div>

          <div className="relative py-8">
            <p className="reveal max-w-[11ch] text-[clamp(2.8rem,4.1vw,4.5rem)] font-semibold leading-[0.93] tracking-[-0.055em] text-ink">
              Four leaves. One secure account.
            </p>
            <p className="reveal reveal-delay-1 mt-5 max-w-[37ch] text-[14px] leading-6 text-muted">
              The Lucky Patcher control room for account access, roles, recovery, and the road to
              the Sprint 1 demo.
            </p>

            <div className="reveal reveal-delay-2 mt-6 h-[240px] w-full max-w-[420px] xl:h-[290px]">
              <LuckyScene />
            </div>

            <ul className="reveal reveal-delay-3 mt-2 grid gap-0 border-t border-line">
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
            <p>Lucky Patcher · Sprint 1</p>
            <Link href="/status" className="transition-colors hover:text-ink">
              System status
            </Link>
          </div>
        </aside>

        <div className="flex min-h-[100dvh] flex-col px-5 py-5 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between lg:hidden">
            <Logo />
            <Link
              href="/status"
              className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[12px] text-muted"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              Status
            </Link>
          </header>

          <div className="mx-auto mt-6 w-full max-w-form lg:hidden">
            <div className="relative h-32 overflow-hidden rounded-2xl border border-line bg-[#08110d]">
              <div className="scene-field pointer-events-none absolute inset-0" aria-hidden="true" />
              <LuckyScene variant="compact" className="absolute inset-0" />
              <p className="pointer-events-none absolute inset-x-4 bottom-3 text-[13px] font-medium text-ink">
                Four leaves. One secure account.
              </p>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center py-8 sm:py-10">{children}</div>

          <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 text-[12px] text-muted">
            <p>Lucky Patcher · Sprint 1</p>
            <p>Accounts for the project team</p>
          </footer>
        </div>
      </div>
    </main>
  );
}
