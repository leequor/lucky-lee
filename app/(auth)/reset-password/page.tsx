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
  "font-medium text-ink underline decoration-[#c9c9c9] underline-offset-4 transition-colors hover:decoration-ink";
const codeClass = "rounded-sm bg-wash px-1.5 py-0.5 font-mono text-[12px] text-ink";

export default async function ResetPasswordPage() {
  if (!isSupabaseConfigured()) {
    return (
      <AuthCard
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
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-[#141414] px-4 text-[14px] font-medium text-white transition-colors hover:bg-[#2b2b2b]"
        >
          Request a new reset link
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
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
