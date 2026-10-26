import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabasePublicConfig } from "./env";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabasePublicConfig();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. The root middleware refreshes
          // the session on the next request, which is the documented Supabase pattern.
        }
      },
    },
  });
}
