import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
};

const linkClass =
  "font-medium text-ink underline decoration-[#c9c9c9] underline-offset-4 transition-colors hover:decoration-ink";

export default function ForgotPasswordPage() {
  return (
    <AuthCard
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
