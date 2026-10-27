import Link from "next/link";

import { Navbar } from "@/components/ui/navbar";
import { RoleBadge } from "@/components/ui/role-badge";
import { LuckyScene } from "@/components/visual/lucky-scene";
import type { AuthUser } from "@/lib/auth/types";
import { formatDate, initials } from "@/lib/utils";

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
  "inline-flex h-9 items-center justify-center rounded-full border border-line bg-wash px-3.5 text-[13px] font-medium text-ink transition-colors hover:border-[#335245] hover:bg-[#18261f]";

export function LandingView({ user, preview = false }: { user: AuthUser; preview?: boolean }) {
  const displayName = user.fullName || user.email;
  const avatar = initials(displayName) || "LP";

  return (
    <div className="min-h-[100dvh] bg-paper">
      <Navbar user={user} preview={preview} />

      <main className="mx-auto max-w-canvas px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-6">
        {preview ? (
          <div className="mt-4 rounded-xl border border-warn/20 bg-warn-soft px-3.5 py-2.5 text-[13px] text-warn">
            Design preview · sample account
          </div>
        ) : null}

        <section className="pt-6 sm:pt-9">
          <div className="grid gap-4 lg:grid-cols-[1.16fr_0.84fr]">
            <div className="reveal relative overflow-hidden rounded-2xl border border-line bg-surface p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-[12px] text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                    Signed in now
                  </div>
                  <h1 className="mt-3 text-[24px] font-semibold leading-[1.02] tracking-[-0.045em] text-ink sm:text-[32px]">
                    Account overview
                  </h1>
                  <p className="mt-2 text-[13px] leading-5 text-muted sm:text-[14px]">
                    Signed in as <span className="text-ink">{user.email}</span> · Member since{" "}
                    {formatDate(user.createdAt)}
                  </p>
                </div>
                <RoleBadge role={user.role} />
              </div>

              <div className="mt-8 flex flex-wrap items-end justify-between gap-5 border-t border-line pt-5">
                <div>
                  <p className="text-[12px] text-muted">Sprint 1 readiness</p>
                  <p className="figure mt-1 text-[54px] font-semibold leading-none tracking-[-0.06em] text-ink sm:text-[64px]">
                    {progress}
                    <span className="ml-0.5 align-top text-[22px] font-medium tracking-normal text-accent">
                      %
                    </span>
                  </p>
                  <p className="mt-2 text-[13px] text-muted">Four checks cleared, one signature left.</p>
                </div>
                <Link href="/status" className={secondaryLink}>
                  Check system status
                </Link>
              </div>

              <dl className="mt-6 grid grid-cols-3 divide-x divide-line border-t border-line pt-4">
                <div className="pr-3">
                  <dt className="text-[11px] text-muted">Role</dt>
                  <dd className="mt-1 truncate text-[13px] font-medium text-ink">
                    {user.role === "superadmin"
                      ? "Superadmin"
                      : user.role === "admin"
                        ? "Admin"
                        : "User"}
                  </dd>
                </div>
                <div className="px-3">
                  <dt className="text-[11px] text-muted">Session</dt>
                  <dd className="mt-1 truncate text-[13px] font-medium text-ink">Cookie</dd>
                </div>
                <div className="pl-3">
                  <dt className="text-[11px] text-muted">Data</dt>
                  <dd className="mt-1 truncate text-[13px] font-medium text-ink">RLS</dd>
                </div>
              </dl>
            </div>

            <div className="reveal reveal-delay-1 relative min-h-[250px] overflow-hidden rounded-2xl border border-line bg-[#08110d] lg:min-h-[340px]">
              <div className="scene-field pointer-events-none absolute inset-0" aria-hidden="true" />
              <LuckyScene className="absolute inset-0" />
              <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-2 text-[11px] text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                Session active
              </div>
              <div className="pointer-events-none absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] text-muted">Fortune core</p>
                  <p className="text-[14px] font-medium text-ink">Live 3D leaf field</p>
                </div>
                <p className="figure text-[11px] text-muted">3D · canvas</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[1.28fr_0.72fr]">
          <div className="reveal reveal-delay-1 overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="flex flex-wrap items-end justify-between gap-3 p-5 sm:p-6">
              <div>
                <h2 className="text-[17px] font-medium text-ink">Sprint 1 checklist</h2>
                <p className="mt-1 text-[13px] text-muted">
                  What the account system covers before the November 9 demo.
                </p>
              </div>
              <p className="figure text-[13px] text-muted">{`${readyCount} of ${CHECKLIST.length} ready`}</p>
            </div>

            <div
              className="h-1.5 w-full bg-wash"
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
                  className="flex items-start justify-between gap-4 border-t border-line px-5 py-3.5 first:border-t-0 sm:px-6"
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
                        : "mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-full bg-wash px-2.5 py-1 text-[12px] font-medium text-muted"
                    }
                  >
                    <span
                      className={
                        item.done
                          ? "h-1.5 w-1.5 rounded-full bg-positive"
                          : "h-1.5 w-1.5 rounded-full bg-[#5a6b62]"
                      }
                      aria-hidden="true"
                    />
                    {item.done ? "Ready" : "Open"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal reveal-delay-2 flex flex-col overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
              <h2 className="text-[17px] font-medium text-ink">Your account</h2>
              <span className="text-[11px] text-muted">Scoped by RLS</span>
            </div>

            <div className="flex items-center gap-3 px-5 py-5 sm:px-6">
              <div
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#2B4338] bg-wash text-[13px] font-semibold text-accent"
                aria-hidden="true"
              >
                {avatar}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-medium text-ink">{displayName}</p>
                <p className="mt-0.5 break-all text-[12px] text-muted">{user.email}</p>
              </div>
            </div>

            <dl className="mt-auto divide-y divide-line border-t border-line">
              <div className="flex items-center justify-between gap-4 px-5 py-3 sm:px-6">
                <dt className="text-[12px] text-muted">Role</dt>
                <dd className="text-[13px] text-ink">
                  {user.role === "superadmin"
                    ? "Superadmin"
                    : user.role === "admin"
                      ? "Admin"
                      : "User"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 px-5 py-3 sm:px-6">
                <dt className="text-[12px] text-muted">Email</dt>
                <dd className="text-[13px] text-ink">Verified</dd>
              </div>
              <div className="flex items-center justify-between gap-4 px-5 py-3 sm:px-6">
                <dt className="text-[12px] text-muted">Provider</dt>
                <dd className="text-[13px] text-ink">Supabase Auth</dd>
              </div>
              <div className="flex items-center justify-between gap-4 px-5 py-3 sm:px-6">
                <dt className="text-[12px] text-muted">Member since</dt>
                <dd className="text-[13px] text-ink">{formatDate(user.createdAt)}</dd>
              </div>
              <div className="px-5 py-3 sm:px-6">
                <dt className="text-[12px] text-muted">Account ID</dt>
                <dd className="mt-1 truncate font-mono text-[12px] text-muted">{user.id}</dd>
              </div>
            </dl>

            <div className="border-t border-line bg-wash/40 px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] text-muted">Account health</p>
                <span className="inline-flex items-center gap-1.5 text-[12px] text-positive-ink">
                  <span className="h-1.5 w-1.5 rounded-full bg-positive" aria-hidden="true" />
                  Clear
                </span>
              </div>
              <p className="mt-2 text-[12px] leading-5 text-muted">
                Email confirmed, role assigned, and recovery enabled.
              </p>
            </div>
          </div>
        </section>

        <section className="reveal reveal-delay-2 mt-9">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-[17px] font-medium text-ink">Access and environment</h2>
            <p className="text-[12px] text-muted">Every layer checked before the demo.</p>
          </div>
          <div className="mt-3 grid overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3 sm:gap-px">
            {SYSTEM.map((card) => (
              <div key={card.label} className="bg-surface px-5 py-4 sm:px-6 sm:py-5">
                <p className="text-[11px] text-muted">{card.label}</p>
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
