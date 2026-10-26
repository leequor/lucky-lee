import Link from "next/link";

import { logoutAction } from "@/app/actions/auth";
import type { AuthUser } from "@/lib/auth/types";
import { initials } from "@/lib/utils";

import { Button } from "./button";
import { Logo } from "./logo";
import { RoleBadge } from "./role-badge";

export function Navbar({ user, preview = false }: { user: AuthUser; preview?: boolean }) {
  const avatar = initials(user.fullName || user.email) || "LP";

  return (
    <header className="sticky top-0 z-30 border-b border-ink bg-ink text-paper">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-8">
        <Logo href={preview ? "/design-preview" : "/"} />

        <div className="flex items-center gap-4">
          <Link
            href="/status"
            className="hidden font-mono text-[10px] uppercase tracking-[0.12em] text-paper/60 transition-colors hover:text-signal-500 sm:block"
          >
            System status
          </Link>
          <div className="hidden items-center gap-3 border-l border-paper/20 pl-4 md:flex">
            <span className="max-w-[200px] truncate font-mono text-[10px] text-paper/60">
              {user.email}
            </span>
            <RoleBadge role={user.role} tone="dark" />
          </div>
          <div
            className="grid h-8 w-8 place-items-center border border-signal-500 bg-transparent font-mono text-[10px] font-bold text-signal-500"
            aria-hidden="true"
          >
            {avatar}
          </div>
          {preview ? (
            <Button
              variant="secondary"
              size="sm"
              className="h-11 border-paper/40 text-paper hover:border-signal-500 hover:bg-signal-500 hover:text-ink sm:h-8"
              disabled
            >
              Log out
            </Button>
          ) : (
            <form action={logoutAction}>
              <Button
                variant="secondary"
                size="sm"
                type="submit"
                className="h-11 border-paper/40 text-paper hover:border-signal-500 hover:bg-signal-500 hover:text-ink sm:h-8"
              >
                Log out
              </Button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}
