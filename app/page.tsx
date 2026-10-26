import { redirect } from "next/navigation";

import { LandingView } from "@/components/landing/landing-view";
import { getAuthUser, getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const authUser = await getAuthUser(user);

  return <LandingView user={authUser} />;
}
