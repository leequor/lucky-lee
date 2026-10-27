import Link from "next/link";

import { Logo } from "@/components/ui/logo";
import { LuckyScene } from "@/components/visual/lucky-scene";

export default function NotFound() {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-paper px-5 py-6 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-canvas flex-col">
        <Logo />

        <div className="grid flex-1 items-center gap-8 py-14 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="figure text-[13px] text-accent">404</p>
            <h1 className="mt-3 text-[42px] font-semibold leading-[0.98] tracking-[-0.05em] text-ink sm:text-[56px]">
              This leaf fell off.
            </h1>
            <p className="mt-4 max-w-[46ch] text-[14px] leading-6 text-muted">
              The link may be old, or the page only exists in a local design preview. Head back to
              the account overview and try again.
            </p>
            <div className="mt-7">
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-[14px] font-medium text-paper transition-colors hover:bg-white"
              >
                Back to the app
              </Link>
            </div>
          </div>

          <div className="relative min-h-[260px] overflow-hidden rounded-2xl border border-line bg-[#08110d]">
            <div className="scene-field pointer-events-none absolute inset-0" aria-hidden="true" />
            <LuckyScene className="absolute inset-0" />
          </div>
        </div>

        <p className="border-t border-line pt-4 text-[12px] text-muted">
          Lucky Patcher · Sprint 01
        </p>
      </div>
    </main>
  );
}
