import Link from "next/link";

import { Navbar } from "@/components/ui/navbar";
import { RoleBadge } from "@/components/ui/role-badge";
import type { AuthUser } from "@/lib/auth/types";
import { formatDate } from "@/lib/utils";

const CHECKLIST = [
  {
    title: "Account access",
    body: "Register, login, and logout are wired to Supabase Auth.",
    done: true,
  },
  {
    title: "Password recovery",
    body: "Built-in Supabase reset flow with expired-link handling.",
    done: true,
  },
  {
    title: "Database guardrails",
    body: "Profiles, roles, and row level security live in the migration.",
    done: true,
  },
  {
    title: "Test evidence",
    body: "Automated checks and manual test cases are documented.",
    done: true,
  },
  {
    title: "Team sign-off",
    body: "Working agreement acknowledgement and presentation rehearsal.",
    done: false,
  },
];

const SYSTEM = [
  {
    label: "Session",
    value: "Secure cookie",
    note: "Supabase issues the session. This app never stores a password.",
  },
  {
    label: "Data",
    value: "Row level security",
    note: "Profiles and roles are scoped to the signed-in user.",
  },
  {
    label: "Quality",
    value: "Automated",
    note: "Unit, RLS, browser, and security checks run on every push.",
  },
];

const readyCount = CHECKLIST.filter((item) => item.done).length;
const progress = Math.round((readyCount / CHECKLIST.length) * 100);

const secondaryLink =
  "inline-flex h-9 items-center justify-center rounded-md border border-line bg-wash px-3.5 text-[13px] font-medium text-ink transition-colors hover:bg-[#e6e6e6]";

export function LandingView({ user, preview = false }: { user: AuthUser; preview?: boolean }) {
  const displayName = user.fullName || user.email;

  return (
    <div className="min-h-[100dvh] bg-paper">
      <Navbar user={user} preview={preview} />

      <main className="mx-auto max-w-canvas px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        {preview ? (
          <div className="mt-4 rounded-md bg-warn-soft px-3.5 py-2.5 text-[13px] text-warn">
            Design preview · sample account
          </div>
        ) : null}

        <section className="flex flex-wrap items-end justify-between gap-4 pt-8 sm:pt-10">
          <div>
            <h1 className="text-[24px] font-semibold leading-tight tracking-[-0.02em] text-ink">
              Account overview
            </h1>
            <p className="mt-1.5 text-[14px] text-muted">
              Signed in as <span className="text-ink">{user.email}</span> · Member since{" "}
              {formatDate(user.createdAt)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <RoleBadge role={user.role} />
            <Link href="/status" className={secondaryLink}>
              Check system status
            </Link>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-lg border border-line bg-surface">
          <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
            <h2 className="text-[16px] font-medium text-ink">Your account</h2>
            <p className="text-[13px] text-muted">Signed in now</p>
          </div>

          <dl className="grid divide-y divide-line sm:grid-cols-2 sm:divide-y-0">
            <div className="px-5 py-4">
              <dt className="text-[13px] text-muted">Display name</dt>
              <dd className="mt-1 break-words text-[15px] text-ink">{displayName}</dd>
            </div>
            <div className="px-5 py-4 sm:border-l sm:border-line">
              <dt className="text-[13px] text-muted">Email</dt>
              <dd className="mt-1 break-all text-[15px] text-ink">{user.email}</dd>
            </div>
            <div className="border-t border-line px-5 py-4">
              <dt className="text-[13px] text-muted">Role</dt>
              <dd className="mt-1 text-[15px] text-ink">
                {user.role === "superadmin" ? "Superadmin" : user.role === "admin" ? "Admin" : "User"}
              </dd>
            </div>
            <div className="border-t border-line px-5 py-4 sm:border-l">
              <dt className="text-[13px] text-muted">Account ID</dt>
              <dd className="mt-1 truncate font-mono text-[13px] text-muted">{user.id}</dd>
            </div>
          </dl>
        </section>

        <section className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-[16px] font-medium text-ink">Sprint 1 checklist</h2>
              <p className="mt-1 text-[13px] text-muted">
                What the account system covers before the November 9 demo.
              </p>
            </div>
            <p className="figure text-[13px] text-muted">
              {`${readyCount} of ${CHECKLIST.length} ready`}
            </p>
          </div>

          <div className="mt-3 overflow-hidden rounded-lg border border-line bg-surface">
            <div
              className="h-2 w-full bg-wash"
              role="progressbar"
              aria-valuenow={readyCount}
              aria-valuemin={0}
              aria-valuemax={CHECKLIST.length}
              aria-label="Sprint checklist progress"
            >
              <div className="h-full bg-accent" style={{ width: `${progress}%` }} />
            </div>

            <ul>
              {CHECKLIST.map((item) => (
                <li
                  key={item.title}
                  className="flex items-start justify-between gap-4 border-t border-line px-5 py-3.5 first:border-t-0"
                >
                  <div>
                    <p className="text-[14px] font-medium text-ink">{item.title}</p>
                    <p className="mt-0.5 max-w-[60ch] text-[13px] leading-5 text-muted">
                      {item.body}
                    </p>
                  </div>
                  <span
                    className={
                      item.done
                        ? "mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-full bg-positive-soft px-2.5 py-1 text-[12px] font-medium text-positive-ink"
                        : "mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-full bg-wash px-2.5 py-1 text-[12px] font-medium text-[#3d3d3d]"
                    }
                  >
                    <span
                      className={
                        item.done
                          ? "h-1.5 w-1.5 rounded-full bg-positive"
                          : "h-1.5 w-1.5 rounded-full bg-[#9a9a9a]"
                      }
                      aria-hidden="true"
                    />
                    {item.done ? "Ready" : "Open"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-[16px] font-medium text-ink">Access and environment</h2>
          <div className="mt-3 grid overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3 sm:gap-px">
            {SYSTEM.map((card) => (
              <div key={card.label} className="bg-surface px-5 py-4">
                <p className="text-[13px] text-muted">{card.label}</p>
                <p className="mt-1 text-[15px] font-medium text-ink">{card.value}</p>
                <p className="mt-1.5 max-w-[34ch] text-[13px] leading-5 text-muted">{card.note}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 text-[12px] text-muted">
          <p>Lucky Patcher · Sprint 01 · {new Date().getFullYear()}</p>
          <p>{preview ? "Design preview" : "Signed in"}</p>
        </footer>
      </main>
    </div>
  );
}
