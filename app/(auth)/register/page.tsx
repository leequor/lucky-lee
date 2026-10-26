import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create account",
};

const linkClass =
  "font-medium text-ink underline decoration-[#c9c9c9] underline-offset-4 transition-colors hover:decoration-ink";

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create your account"
      description="Create the account you use for the dashboard and recovery. Development signups receive superadmin for testing."
      footer={
        <p>
          Already have an account?{" "}
          <Link href="/login" className={linkClass}>
            Sign in
          </Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}
