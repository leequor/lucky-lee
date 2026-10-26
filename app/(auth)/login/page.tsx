import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in",
};

const linkClass =
  "font-medium text-ink underline decoration-[#c9c9c9] underline-offset-4 transition-colors hover:decoration-ink";

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
      title="Sign in to Lucky Patcher"
      description="Use the email and password on your team account. The session stays in a secure cookie."
      footer={
        <p>
          New to the team?{" "}
          <Link href="/register" className={linkClass}>
            Create an account
          </Link>
        </p>
      }
    >
      <LoginForm notice={readParam(params.message)} errorNotice={readParam(params.error)} />
    </AuthCard>
  );
}
