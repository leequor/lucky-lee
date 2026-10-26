import { cache } from "react";
import type { User } from "@supabase/supabase-js";

import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { isAppRole } from "./service";
import type { AppRole, AuthUser } from "./types";

function coerceRole(value: unknown): AppRole {
  return isAppRole(value) ? value : "user";
}

export const getCurrentUser = cache(async (): Promise<User | null> => {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      return null;
    }

    return data.user ?? null;
  } catch {
    return null;
  }
});

export function toAuthUser(user: User): AuthUser {
  const metadata = user.user_metadata ?? {};
  const role = coerceRole(user.app_metadata?.role ?? metadata.role);

  return {
    id: user.id,
    email: user.email ?? "",
    role,
    fullName: typeof metadata.full_name === "string" ? metadata.full_name : null,
    createdAt: user.created_at ?? null,
  };
}

export async function getAuthUser(user: User): Promise<AuthUser> {
  const fallback = toAuthUser(user);

  if (!isSupabaseConfigured()) {
    return fallback;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("profiles")
      .select("role, full_name, created_at")
      .eq("id", user.id)
      .maybeSingle();

    if (!data) {
      return fallback;
    }

    return {
      ...fallback,
      role: coerceRole(data.role),
      fullName: data.full_name || fallback.fullName,
      createdAt: data.created_at || fallback.createdAt,
    };
  } catch {
    return fallback;
  }
}
