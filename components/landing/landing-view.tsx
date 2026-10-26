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

const SHORTCUTS = [
  { href: "/login", label: "Login", note: "Sign in" },
  { href: "/register", label: "Register", note: "Create account" },
  { href: "/forgot-password", label: "Reset request", note: "Recovery" },
];

const SYSTEM = [
  { label: "Auth", value: "Supabase", note: "Email and password with secure sessions." },
  { label: "Data", value: "RLS on", note: "Profiles are scoped to the signed-in user." },
  { label: "Quality", value: "Automated", note: "Unit, RLS, browser, and security checks." },
];

const primaryLink =
  "inline-flex h-10 items-center justify-center border border-ink bg-ink px-4 text-[13px] font-medium text-paper transition-colors hover:border-signal-600 hover:bg-signal-700";
const secondaryLink =
  "inline-flex h-10 items-center justify-center border border-ink/30 px-4 text-[13px] font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper";

export function LandingView({ user, preview = false }: { user: AuthUser; preview?: boolean }) {
  const firstName = user.fullName?.split(/\s+/)[0] || user.email.split("@")[0] || "teammate";
  const displayName = user.fullName || user.email;

  return (
    <div className="min-h-screen bg-paper">
      <Navbar user={user} preview={preview} />

      <main className="mx-auto max-w-[1400px] px-5 pb-8 sm:px-8">
        {preview ? (
          <div className="border-b border-signal-600/25 bg-signal-50 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-signal-700">
            Design preview / sample account
          </div>
        ) : null}

        <section className="border-b border-ink/15 py-10 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[1.45fr_0.55fr]">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-[3px] w-8 bg-signal-500" aria-hidden="true" />
                <p className="label">Sprint 01 / Control room</p>
              </div>

              <h1 className="mt-7 max-w-[12ch] text-[clamp(3rem,6.4vw,5.8rem)] font-semibold leading-[0.9] tracking-[-0.065em] text-ink">
                Welcome back,
                <br />
                {firstName}.
              </h1>

              <p className="mt-6 max-w-[46ch] text-[15px] leading-6 text-muted">
                Signed in as <span className="font-medium text-ink">{user.email}</span>. Account
                access, roles, and release checks live on this page.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/status" className={primaryLink}>
                  Check system status
                </Link>
                <a href="#sprint-checklist" className={secondaryLink}>
                  Sprint checklist
                </a>
              </div>
            </div>

            <aside className="border-t border-ink/15 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <div className="flex items-start justify-between gap-4">
                <p className="label">Current account</p>
                <RoleBadge role={user.role} />
              </div>

              <h2 className="mt-4 break-words text-[26px] font-semibold leading-[1.05] tracking-[-0.04em] text-ink">
                {displayName}
              </h2>

              <dl className="mt-6 border-t border-ink/15 text-[12px]">
                <div className="flex items-start justify-between gap-4 border-b border-ink/15 py-3">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    Email
                  </dt>
                  <dd className="max-w-[210px] break-all text-right font-medium text-ink">
                    {user.email}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 border-b border-ink/15 py-3">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    Member since
                  </dt>
                  <dd className="text-right font-medium text-ink">{formatDate(user.createdAt)}</dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    Account ID
                  </dt>
                  <dd className="max-w-[160px] truncate font-mono text-[10px] text-muted">
                    {user.id}
                  </dd>
                </div>
              </dl>

              <p className="mt-6 border-l-[3px] border-l-signal-500 pl-3 font-mono text-[10px] leading-5 text-muted">
                Passwords stay with Supabase. This app never stores one.
              </p>
            </aside>
          </div>
        </section>

        <section
          id="sprint-checklist"
          className="grid gap-10 py-10 lg:grid-cols-[1.4fr_0.6fr] lg:py-14"
        >
          <div>
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/15 pb-4">
              <div>
                <p className="label">Definition of done</p>
                <h2 className="mt-2 text-[clamp(1.8rem,3vw,2.5rem)] font-semibold leading-none tracking-[-0.045em] text-ink">
                  Sprint 1 checklist
                </h2>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                4 of 5 ready
              </p>
            </div>

            <ol>
              {CHECKLIST.map((item, index) => (
                <li
                  key={item.title}
                  className="grid grid-cols-[1.75rem_1fr_auto] items-start gap-4 border-b border-ink/15 py-4"
                >
                  <span className="pt-0.5 font-mono text-[10px] text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-[14px] font-medium text-ink">{item.title}</p>
                    <p className="mt-1 max-w-[52ch] text-[12px] leading-5 text-muted">
                      {item.body}
                    </p>
                  </div>
                  <span
                    className={
                      item.done
                        ? "border border-ink bg-ink px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-paper"
                        : "border border-signal-600 bg-signal-50 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-signal-700"
                    }
                  >
                    {item.done ? "Ready" : "Open"}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="lg:border-l lg:border-ink/15 lg:pl-8">
            <p className="label">Presentation shortcuts</p>
            <h2 className="mt-2 text-[clamp(1.8rem,3vw,2.5rem)] font-semibold leading-none tracking-[-0.045em] text-ink">
              Keep the demo calm
            </h2>
            <p className="mt-4 max-w-[34ch] text-[13px] leading-6 text-muted">
              Jump straight to the screens you need during the Nov 9 walkthrough.
            </p>

            <div className="mt-6 border-t border-ink/15">
              {SHORTCUTS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center justify-between gap-4 border-b border-ink/15 py-4 transition-colors hover:text-signal-700 sm:py-3"
                >
                  <span>
                    <span className="block text-[13px] font-medium">{link.label}</span>
                    <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                      {link.note}
                    </span>
                  </span>
                  <span className="font-mono text-[13px] text-muted" aria-hidden="true">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="grid border-y border-ink/15 sm:grid-cols-3">
          {SYSTEM.map((card) => (
            <div
              key={card.label}
              className="border-b border-ink/15 py-5 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0"
            >
              <p className="label">{card.label}</p>
              <p className="mt-3 text-[24px] font-semibold leading-none tracking-[-0.04em] text-ink">
                {card.value}
              </p>
              <p className="mt-3 max-w-[30ch] text-[11px] leading-5 text-muted">{card.note}</p>
            </div>
          ))}
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 py-6 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
          <p>Lucky Patcher / Sprint 01 / {new Date().getFullYear()}</p>
          <p>{preview ? "Design preview" : "Signed in"}</p>
        </footer>
      </main>
    </div>
  );
}
