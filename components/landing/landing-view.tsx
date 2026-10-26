import Link from "next/link";

import { Navbar } from "@/components/ui/navbar";
import { RoleBadge } from "@/components/ui/role-badge";
import type { AppRole, AuthUser } from "@/lib/auth/types";
import { cn, formatDate } from "@/lib/utils";

const ROLE_LABELS: Record<AppRole, string> = {
  superadmin: "Superadmin",
  admin: "Admin",
  user: "User",
};

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
    body: "Profiles, roles, and row level security are in the migration.",
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-clover-200/75">
        {label}
      </dt>
      <dd className="mt-2 text-sm font-semibold text-white">{value}</dd>
    </div>
  );
}

export function LandingView({ user, preview = false }: { user: AuthUser; preview?: boolean }) {
  const firstName = user.fullName?.split(/\s+/)[0] || user.email.split("@")[0] || "teammate";
  const displayName = user.fullName || user.email;

  return (
    <div className="min-h-screen bg-cream">
      <div className="pointer-events-none fixed inset-0 bg-grid-soft opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent_72%)]" />
      <Navbar user={user} preview={preview} />

      <main className="relative mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
        {preview ? (
          <div className="mb-5 rounded-full border border-coral-500/20 bg-coral-100/70 px-4 py-2 text-center text-xs font-semibold text-coral-600">
            Design preview with a sample account. Set NEXT_PUBLIC_DESIGN_PREVIEW=true locally to view it.
          </div>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[1.28fr_.72fr]">
          <div className="relative overflow-hidden rounded-[2.25rem] bg-clover-900 p-7 text-white shadow-card sm:p-9">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -bottom-24 right-16 h-64 w-64 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute right-8 top-8 text-[120px] font-display leading-none text-white/[0.04]">
              ✦
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.22em] text-clover-200">
              Sprint 1 control room
            </p>
            <h1 className="mt-5 max-w-2xl font-display text-4xl font-semibold leading-[1.04] tracking-tight text-balance sm:text-[3.35rem]">
              Welcome back, {firstName}.
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-clover-100/80">
              You are signed in as <span className="font-semibold text-white">{user.email}</span>.
              Everything the team needs for account access and release readiness is in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/status"
                className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-clover-900 transition hover:bg-clover-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-clover-900"
              >
                Check system status
              </Link>
              <a
                href="#sprint-checklist"
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 px-5 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-clover-900"
              >
                View sprint checklist
              </a>
            </div>

            <dl className="mt-10 grid gap-3 sm:grid-cols-3">
              <Stat label="Role" value={ROLE_LABELS[user.role]} />
              <Stat label="Auth" value="Active session" />
              <Stat label="Member since" value={formatDate(user.createdAt)} />
            </dl>
          </div>

          <aside className="rounded-[2.25rem] border border-ink/10 bg-paper/90 p-6 shadow-soft sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
                  Current account
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                  {displayName}
                </h2>
              </div>
              <RoleBadge role={user.role} />
            </div>

            <dl className="mt-6 space-y-4 border-t border-ink/10 pt-5 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted">Email</dt>
                <dd className="max-w-[210px] break-all text-right font-semibold text-ink">
                  {user.email}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted">Member since</dt>
                <dd className="text-right font-semibold text-ink">{formatDate(user.createdAt)}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-muted">Account ID</dt>
                <dd className="max-w-[160px] truncate text-right font-mono text-xs text-ink/60">
                  {user.id}
                </dd>
              </div>
            </dl>

            <div className="mt-6 rounded-2xl bg-clover-50 p-4">
              <p className="text-sm font-semibold text-clover-900">Passwords stay private</p>
              <p className="mt-1 text-sm leading-6 text-clover-800/80">
                Supabase hashes credentials. This app never stores a password in its own database.
              </p>
            </div>
          </aside>
        </section>

        <section id="sprint-checklist" className="mt-6 grid gap-6 md:grid-cols-[1.15fr_.85fr]">
          <div className="rounded-[2rem] border border-ink/10 bg-paper/90 p-6 shadow-soft sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-clover-700">
                  Definition of done
                </p>
                <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink">
                  Sprint 1 checklist
                </h2>
              </div>
              <span className="rounded-full bg-clover-100 px-3 py-1 text-xs font-bold text-clover-800">
                4 / 5 ready
              </span>
            </div>

            <ul className="mt-5 space-y-3">
              {CHECKLIST.map((item) => (
                <li
                  key={item.title}
                  className="flex items-start gap-3 rounded-2xl border border-ink/5 bg-white/45 p-3.5"
                >
                  <span
                    className={cn(
                      "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold",
                      item.done
                        ? "bg-clover-100 text-clover-800"
                        : "border border-dashed border-ink/20 text-ink/30",
                    )}
                    aria-hidden="true"
                  >
                    {item.done ? "✓" : "·"}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-5 text-muted">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-ink/10 bg-paper/90 p-6 shadow-soft sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-clover-700">
              Presentation shortcuts
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink">
              Keep the demo calm
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Jump straight to the screens you need during the Nov 9 walkthrough.
            </p>

            <div className="mt-5 space-y-3">
              {[
                { href: "/status", label: "System status", note: "Health checks" },
                { href: "/login", label: "Login screen", note: "Sign in" },
                { href: "/register", label: "Register screen", note: "Create account" },
                { href: "/forgot-password", label: "Reset request", note: "Recovery" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-ink/8 bg-white/45 px-4 py-3 transition hover:border-clover-700/20 hover:bg-white"
                >
                  <span>
                    <span className="block text-sm font-semibold text-ink">{link.label}</span>
                    <span className="block text-xs text-muted">{link.note}</span>
                  </span>
                  <span className="text-clover-700" aria-hidden="true">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Auth provider",
              value: "Supabase",
              note: "Email and password with secure sessions.",
            },
            {
              label: "Database guardrail",
              value: "RLS on",
              note: "Profiles are scoped to the signed-in user.",
            },
            {
              label: "Quality gate",
              value: "Automated",
              note: "Validation and auth helpers have unit tests.",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-[1.75rem] border border-ink/10 bg-paper/70 p-5 shadow-soft"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                {card.label}
              </p>
              <p className="mt-2 font-display text-2xl font-semibold text-ink">{card.value}</p>
              <p className="mt-2 text-xs leading-5 text-muted">{card.note}</p>
            </div>
          ))}
        </section>

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-5 text-xs text-muted">
          <p>Lucky Patcher · Sprint 1 · {new Date().getFullYear()}</p>
          <p>
            {preview ? "Design preview" : "Signed in"} ·{" "}
            <Link href="/status" className="font-semibold text-clover-700 hover:underline">
              system status
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
