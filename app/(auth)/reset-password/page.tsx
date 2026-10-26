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

export default async function ResetPasswordPage() {
  if (!isSupabaseConfigured()) {
    return (
      <AuthCard
        eyebrow="Configuration needed"
        title="Supabase is not connected yet"
        description="Add your project URL and anon key to .env.local, then restart the development server."
        footer={
          <p>
            <Link href="/login" className="font-semibold text-clover-700 hover:underline">
              Back to sign in
            </Link>
          </p>
        }
      >
        <Alert tone="info">
          Copy <code className="rounded bg-ink/5 px-1 py-0.5">.env.example</code> to{" "}
          <code className="rounded bg-ink/5 px-1 py-0.5">.env.local</code> and fill in the
          Supabase values. See <code className="rounded bg-ink/5 px-1 py-0.5">docs/supabase-setup.md</code>.
        </Alert>
      </AuthCard>
    );
  }

  const user = await getCurrentUser();

  if (!user) {
    return (
      <AuthCard
        eyebrow="Recovery link"
        title="This link has expired"
        description="Reset links are single-use and expire for your safety. Request a fresh one and open it in the same browser."
        footer={
          <p>
            <Link href="/login" className="font-semibold text-clover-700 hover:underline">
              Back to sign in
            </Link>
          </p>
        }
      >
        <Link
          href="/forgot-password"
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-clover-700 px-6 text-sm font-semibold text-white shadow-soft transition hover:bg-clover-800"
        >
          Request a new reset link
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      eyebrow="Almost there"
      title="Set a new password"
      description={`Choose a new password for ${user.email ?? "your account"}. You will sign in with it on the next screen.`}
      footer={
        <p>
          Need to start over?{" "}
          <Link href="/forgot-password" className="font-semibold text-clover-700 hover:underline">
            Request another link
          </Link>
        </p>
      }
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
