import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create account",
};

export default function RegisterPage() {
  return (
    <AuthCard
      eyebrow="Join the team"
      title="Create your account"
      description="Register with your email and a password. In development, new accounts receive the superadmin role so the team can test every screen."
      footer={
        <p>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-clover-700 hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}
