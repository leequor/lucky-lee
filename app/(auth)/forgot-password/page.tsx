import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
};

const linkClass =
  "font-medium text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-signal-600";

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      eyebrow="Recovery / 03"
      title="Reset your password"
      description="Enter your account email. If it matches, Supabase sends a single-use reset link."
      footer={
        <p>
          Remembered it?{" "}
          <Link href="/login" className={linkClass}>
            Back to sign in
          </Link>
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
