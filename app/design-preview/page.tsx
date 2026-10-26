import { notFound } from "next/navigation";

import { LandingView } from "@/components/landing/landing-view";
import type { AuthUser } from "@/lib/auth/types";

export const dynamic = "force-dynamic";

const PREVIEW_USER: AuthUser = {
  id: "00000000-0000-4000-8000-000000000001",
  email: "alex@luckypatcher.test",
  role: "superadmin",
  fullName: "Alex Campita",
  createdAt: "2026-10-19T11:10:00.000Z",
};

export default function DesignPreviewPage() {
  if (process.env.NEXT_PUBLIC_DESIGN_PREVIEW !== "true") {
    notFound();
  }

  return <LandingView user={PREVIEW_USER} preview />;
}
