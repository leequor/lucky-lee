import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";

export const metadata: Metadata = {
  title: "Staff access",
};

const linkClass =
  "font-medium text-ink underline decoration-[#345347] underline-offset-4 transition-colors hover:decoration-accent";

export default function RegisterPage() {
  return (
    <AuthCard
      title="Staff accounts are invite-only"
      description="Patchwork is the internal repair desk. Owners and managers create staff accounts with a temporary password."
      footer={
        <p>
          Already have an account?{" "}
          <Link href="/login" className={linkClass}>
            Sign in
          </Link>
        </p>
      }
    >
      <div className="space-y-4 text-[13px] leading-6 text-muted">
        <p>
          Ask an owner or manager to add you from the <span className="text-ink">Team</span> page.
          They will give you the email and temporary password for your first sign-in.
        </p>
        <div className="rounded-xl border border-line bg-paper p-4">
          <p className="text-[10px] text-muted">After your first sign-in</p>
          <p className="mt-1 text-[12px] text-ink">
            Change the temporary password from “Forgot password” on the sign-in screen.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex h-11 w-full items-center justify-center rounded-full bg-ink px-4 text-[14px] font-medium text-paper transition-colors hover:bg-white"
        >
          Back to sign in
        </Link>
      </div>
    </AuthCard>
  );
}
