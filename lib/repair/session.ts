import { redirect } from "next/navigation";

import { getAuthUser, getCurrentUser } from "@/lib/auth/session";
import type { AuthUser } from "@/lib/auth/types";

export async function requireStaff(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return getAuthUser(user);
}

export async function requireAdmin(): Promise<AuthUser> {
  const staff = await requireStaff();

  if (staff.role === "user") {
    redirect("/");
  }

  return staff;
}

export async function getStaff(): Promise<AuthUser | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  return getAuthUser(user);
}
