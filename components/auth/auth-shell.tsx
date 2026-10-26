import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/ui/logo";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-[100dvh] bg-paper">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-canvas flex-col px-6 py-6">
        <header className="flex items-center justify-between">
          <Logo />
          <Link
            href="/status"
            className="text-[13px] text-muted transition-colors hover:text-ink"
          >
            System status
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center py-10 sm:py-14">{children}</div>

        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 text-[12px] text-muted">
          <p>Lucky Patcher · Sprint 1</p>
          <p>Accounts for the project team</p>
        </footer>
      </div>
    </main>
  );
}
