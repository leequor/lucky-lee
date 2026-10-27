"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { logoutAction } from "@/app/actions/auth";
import { Logo } from "@/components/ui/logo";
import type { AuthUser } from "@/lib/auth/types";
import { ROLE_LABELS } from "@/lib/repair/format";
import { initials } from "@/lib/utils";

import {
  ArrowUpRightIcon,
  CloseIcon,
  CustomersIcon,
  DashboardIcon,
  InventoryIcon,
  InvoiceIcon,
  LogoutIcon,
  MenuIcon,
  PlusIcon,
  SearchIcon,
  TeamIcon,
  TicketIcon,
} from "./icons";

const NAV = [
  { href: "/", label: "Overview", icon: DashboardIcon },
  { href: "/tickets", label: "Tickets", icon: TicketIcon },
  { href: "/customers", label: "Customers", icon: CustomersIcon },
  { href: "/inventory", label: "Inventory", icon: InventoryIcon },
  { href: "/invoices", label: "Invoices", icon: InvoiceIcon },
  { href: "/team", label: "Team", icon: TeamIcon },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function pageTitle(pathname: string) {
  if (pathname === "/") return "Overview";
  if (pathname.startsWith("/tickets")) return "Tickets";
  if (pathname.startsWith("/customers")) return "Customers";
  if (pathname.startsWith("/inventory")) return "Inventory";
  if (pathname.startsWith("/invoices")) return "Invoices";
  if (pathname.startsWith("/team")) return "Team";
  return "Patchwork";
}

export function WorkspaceShell({
  user,
  children,
}: {
  user: AuthUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const displayName = user.fullName || user.email;
  const avatar = initials(displayName) || "PW";

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-line px-5">
        <div onClick={() => setOpen(false)}>
          <Logo />
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-wash hover:text-ink lg:hidden"
          aria-label="Close navigation"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="px-3 pt-4">
        <Link
          href="/tickets/new"
          onClick={() => setOpen(false)}
          className="flex h-10 items-center justify-center gap-2 rounded-full bg-accent px-4 text-[13px] font-semibold text-[#170A05] transition-colors hover:bg-[#ff8358]"
        >
          <PlusIcon className="h-4 w-4" />
          New ticket
        </Link>
      </div>

      <nav className="mt-5 flex-1 space-y-1 px-3" aria-label="Main navigation">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={
                active
                  ? "flex h-10 items-center gap-3 rounded-lg bg-wash px-3 text-[13px] font-medium text-ink"
                  : "flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] text-muted transition-colors hover:bg-wash/70 hover:text-ink"
              }
              aria-current={active ? "page" : undefined}
            >
              <Icon className={active ? "h-4 w-4 text-accent" : "h-4 w-4"} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-3">
        <Link
          href="/track"
          onClick={() => setOpen(false)}
          className="flex h-10 items-center justify-between rounded-lg border border-line px-3 text-[12px] text-muted transition-colors hover:border-[#3A414B] hover:text-ink"
        >
          Public tracker
          <ArrowUpRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="border-t border-line p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-wash text-[11px] font-semibold text-accent">
            {avatar}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-medium text-ink">{displayName}</p>
            <p className="mt-0.5 truncate text-[10px] text-muted">{user.email}</p>
            <p className="mt-0.5 text-[11px] text-muted">{ROLE_LABELS[user.role]}</p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-wash hover:text-ink"
              aria-label="Log out"
              title="Log out"
            >
              <LogoutIcon className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-paper">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] border-r border-line bg-surface lg:block">
        {sidebar}
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Close navigation overlay"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[280px] border-r border-line bg-surface shadow-2xl">
            {sidebar}
          </aside>
        </div>
      ) : null}

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-paper/95 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted hover:text-ink lg:hidden"
            aria-label="Open navigation"
          >
            <MenuIcon className="h-4 w-4" />
          </button>

          <p className="hidden text-[13px] font-medium text-muted sm:block">{pageTitle(pathname)}</p>

          <form action="/tickets" className="ml-auto hidden w-full max-w-xs items-center md:flex">
            <label className="relative flex w-full items-center">
              <SearchIcon className="pointer-events-none absolute left-3 h-4 w-4 text-muted" />
              <span className="sr-only">Search tickets</span>
              <input
                name="q"
                type="search"
                placeholder="Search tickets or customers"
                className="h-9 w-full rounded-full border border-line bg-surface pl-9 pr-3 text-[12px] text-ink outline-none placeholder:text-muted/70 focus:border-accent"
              />
            </label>
          </form>

          <Link
            href="/tickets/new"
            className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-full bg-ink px-3.5 text-[12px] font-semibold text-paper transition-colors hover:bg-white md:ml-3"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            New
          </Link>

          <form action={logoutAction} className="lg:hidden">
            <button
              type="submit"
              className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted hover:text-ink"
              aria-label="Log out"
              title="Log out"
            >
              <LogoutIcon className="h-4 w-4" />
            </button>
          </form>
        </header>

        <main className="mx-auto w-full max-w-[1320px] px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
