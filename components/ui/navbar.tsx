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
    <header className="sticky top-0 z-30 border-b border-line bg-surface">
      <div className="mx-auto flex h-16 max-w-canvas items-center justify-between gap-4 px-6">
        <Logo href={preview ? "/design-preview" : "/"} />

        <div className="flex items-center gap-3">
          <Link
            href="/status"
            className="hidden text-[13px] text-muted transition-colors hover:text-ink md:block"
          >
            System status
          </Link>
          <div className="hidden items-center gap-2.5 md:flex">
            <span className="max-w-[200px] truncate text-[13px] text-muted">{user.email}</span>
            <RoleBadge role={user.role} />
          </div>
          <div
            className="grid h-8 w-8 place-items-center rounded-full bg-wash text-[12px] font-medium text-ink"
            aria-hidden="true"
          >
            {avatar}
          </div>
          {preview ? (
            <Button variant="secondary" size="sm" className="h-9" disabled>
              Log out
            </Button>
          ) : (
            <form action={logoutAction}>
              <Button variant="secondary" size="sm" type="submit" className="h-9">
                Log out
              </Button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}
