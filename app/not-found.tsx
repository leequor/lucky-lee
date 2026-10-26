import Link from "next/link";

import { Logo } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <main className="grid min-h-[100dvh] bg-ink px-5 py-6 text-paper sm:px-8">
      <div className="mx-auto flex w-full max-w-[1080px] flex-col">
        <Logo />

        <div className="flex flex-1 flex-col justify-center py-16">
          <div className="mb-6 h-[4px] w-10 bg-signal-500" aria-hidden="true" />
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-signal-500">
            404 / Not found
          </p>
          <h1 className="mt-4 max-w-[10ch] text-[clamp(3.5rem,10vw,8rem)] font-semibold leading-[0.82] tracking-[-0.07em] text-paper">
            Not in the plan.
          </h1>
          <p className="mt-6 max-w-[42ch] text-[14px] leading-6 text-paper/60">
            The link may be old, or the page only exists in a local design preview.
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center border border-signal-500 bg-signal-500 px-4 text-[13px] font-bold text-ink transition-colors hover:bg-paper"
            >
              Back to the app
            </Link>
          </div>
        </div>

        <p className="border-t border-paper/20 py-5 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/40">
          Lucky Patcher / Sprint 01
        </p>
      </div>
    </main>
  );
}
