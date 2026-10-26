import { logoutAction } from "@/app/actions/auth";
import type { AuthUser } from "@/lib/auth/types";
import { initials } from "@/lib/utils";

import { Button } from "./button";
import { Logo } from "./logo";
import { RoleBadge } from "./role-badge";

export function Navbar({ user, preview = false }: { user: AuthUser; preview?: boolean }) {
  const avatar = initials(user.fullName || user.email) || "LP";

  return (
    <header className="relative z-20 border-b border-ink/10 bg-cream/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Logo href={preview ? "/design-preview" : "/"} />

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="max-w-[220px] truncate text-sm font-semibold text-ink">{user.email}</p>
            <div className="mt-1 flex justify-end">
              <RoleBadge role={user.role} />
            </div>
          </div>
          <div
            className="grid h-10 w-10 place-items-center rounded-full border border-clover-800/10 bg-clover-100 text-xs font-bold text-clover-900"
            aria-hidden="true"
          >
            {avatar}
          </div>
          {preview ? (
            <Button variant="secondary" size="sm" disabled>
              Log out
            </Button>
          ) : (
            <form action={logoutAction}>
              <Button variant="secondary" size="sm" type="submit">
                Log out
              </Button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}
