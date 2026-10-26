import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Alert } from "@/components/ui/alert";
import { getCurrentUser } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Set a new password",
};

export const dynamic = "force-dynamic";

const linkClass =
  "font-medium text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-signal-600";
const codeClass = "border border-ink/15 bg-surface px-1 py-0.5 font-mono text-[11px]";

export default async function ResetPasswordPage() {
  if (!isSupabaseConfigured()) {
    return (
      <AuthCard
        eyebrow="Configuration / 00"
        title="Supabase is not connected yet"
        description="Add your project URL and anon key to .env.local, then restart the development server."
        footer={
          <p>
            <Link href="/login" className={linkClass}>
              Back to sign in
            </Link>
          </p>
        }
      >
        <Alert tone="info">
          Copy <code className={codeClass}>.env.example</code> to{" "}
          <code className={codeClass}>.env.local</code> and fill in the Supabase values. See{" "}
          <code className={codeClass}>docs/supabase-setup.md</code>.
        </Alert>
      </AuthCard>
    );
  }

  const user = await getCurrentUser();

  if (!user) {
    return (
      <AuthCard
        eyebrow="Recovery link / 04"
        title="This link has expired"
        description="Reset links are single-use and expire for your safety. Request a fresh one and open it in the same browser."
        footer={
          <p>
            <Link href="/login" className={linkClass}>
              Back to sign in
            </Link>
          </p>
        }
      >
        <Link
          href="/forgot-password"
          className="inline-flex h-11 w-full items-center justify-center border border-ink bg-ink px-5 text-[13px] font-medium text-paper transition-colors hover:border-signal-600 hover:bg-signal-700"
        >
          Request a new reset link
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      eyebrow="Recovery link / 04"
      title="Set a new password"
      description={`Choose a new password for ${user.email ?? "your account"}. You will sign in with it on the next screen.`}
      footer={
        <p>
          Need to start over?{" "}
          <Link href="/forgot-password" className={linkClass}>
            Request another link
          </Link>
        </p>
      }
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
