import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in",
};

function readParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string | string[]; error?: string | string[] }>;
}) {
  const params = await searchParams;

  return (
    <AuthCard
      eyebrow="Welcome back"
      title="Sign in to Lucky Patcher"
      description="Use the email and password on your team account. Your session is kept in a secure cookie."
      footer={
        <p>
          New to the team?{" "}
          <Link href="/register" className="font-semibold text-clover-700 hover:underline">
            Create an account
          </Link>
        </p>
      }
    >
      <LoginForm notice={readParam(params.message)} errorNotice={readParam(params.error)} />
    </AuthCard>
  );
}
