import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      eyebrow="Account recovery"
      title="Reset your password"
      description="Enter the email on your account. If it exists, Supabase will send a single-use reset link."
      footer={
        <p>
          Remembered it?{" "}
          <Link href="/login" className="font-semibold text-clover-700 hover:underline">
            Back to sign in
          </Link>
        </p>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
