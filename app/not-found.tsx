import Link from "next/link";

import { Logo } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <main className="grid min-h-[100dvh] bg-paper px-6 py-6">
      <div className="mx-auto flex w-full max-w-canvas flex-col">
        <Logo />

        <div className="flex flex-1 flex-col justify-center py-16">
          <p className="text-[14px] text-muted">404</p>
          <h1 className="mt-2 text-[32px] font-semibold leading-tight tracking-[-0.02em] text-ink">
            Page not found
          </h1>
          <p className="mt-3 max-w-[46ch] text-[14px] leading-6 text-muted">
            The link may be old, or the page only exists in a local design preview.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-md bg-[#141414] px-4 text-[14px] font-medium text-white transition-colors hover:bg-[#2b2b2b]"
            >
              Back to the app
            </Link>
          </div>
        </div>

        <p className="border-t border-line pt-4 text-[12px] text-muted">
          Lucky Patcher · Sprint 01
        </p>
      </div>
    </main>
  );
}
