import { existsSync } from "node:fs";

if (existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
}

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const demoPassword = process.env.DEMO_PASSWORD || "DemoPass123!";

export const demoUsers = {
  superadmin: "alex@luckypatcher.test",
  admin: "admin@luckypatcher.test",
  user: "user@luckypatcher.test",
};

export function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@luckypatcher.test`;
}

function adminHeaders() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY for E2E tests.");
  }

  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
  };
}

export async function createConfirmedUser(email: string, password: string) {
  const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
    method: "POST",
    headers: adminHeaders(),
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: "user", full_name: "E2E User" },
    }),
  });

  if (!response.ok) {
    throw new Error(`Unable to create E2E user: ${response.status} ${await response.text()}`);
  }

  const body = (await response.json()) as { id: string };
  return body.id;
}

export async function deleteUser(id: string) {
  if (!supabaseUrl || !serviceRoleKey) {
    return;
  }

  await fetch(`${supabaseUrl}/auth/v1/admin/users/${id}`, {
    method: "DELETE",
    headers: adminHeaders(),
  });
}

export async function generateRecoveryToken(email: string) {
  const response = await fetch(`${supabaseUrl}/auth/v1/admin/generate_link`, {
    method: "POST",
    headers: adminHeaders(),
    body: JSON.stringify({
      type: "recovery",
      email,
      options: { redirectTo: "http://localhost:3000/auth/confirm" },
    }),
  });

  if (!response.ok) {
    throw new Error(`Unable to generate recovery link: ${response.status} ${await response.text()}`);
  }

  const body = (await response.json()) as {
    hashed_token?: string;
    properties?: { hashed_token?: string };
  };

  const token = body.hashed_token ?? body.properties?.hashed_token;

  if (!token) {
    throw new Error("Supabase did not return a recovery token hash.");
  }

  return token;
}
