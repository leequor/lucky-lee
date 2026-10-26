import { notFound } from "next/navigation";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Alert } from "@/components/ui/alert";

export const dynamic = "force-dynamic";

export default function ResetPasswordPreviewPage() {
  if (process.env.NEXT_PUBLIC_DESIGN_PREVIEW !== "true") {
    notFound();
  }

  return (
    <AuthShell>
      <AuthCard
        eyebrow="Design preview"
        title="Set a new password"
        description="Sample recovery session for screenshots and design review. The real page only renders this form when Supabase has verified the reset link."
        footer={
          <p className="text-xs text-muted">
            Local preview only. The form action still requires a real recovery session.
          </p>
        }
      >
        <div className="space-y-5">
          <Alert tone="info">
            Preview mode: this is a sample account. No password will be changed.
          </Alert>
          <ResetPasswordForm />
        </div>
      </AuthCard>
    </AuthShell>
  );
}
