import Link from "next/link";

import { Logo } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-cream px-5">
      <div className="pointer-events-none absolute inset-0 bg-grid-soft [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
      <div className="relative max-w-md text-center">
        <div className="flex justify-center">
          <Logo />
        </div>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-clover-700">
          404
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
          This page is not in the plan.
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          The link may be old, or the page may only be available in a local design preview.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-clover-700 px-5 text-sm font-semibold text-white shadow-soft transition hover:bg-clover-800"
        >
          Back to the app
        </Link>
      </div>
    </main>
  );
}
