// @vitest-environment node
import { existsSync } from "node:fs";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

if (existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const configured = Boolean(url && anonKey && serviceRoleKey);

type TestUser = {
  id: string;
  email: string;
  password: string;
  client: SupabaseClient;
};

const createdIds: string[] = [];
const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function admin(): SupabaseClient {
  return createClient(url!, serviceRoleKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function createUser(
  supabaseAdmin: SupabaseClient,
  name: string,
  role: string,
): Promise<TestUser> {
  const email = `rls-${name}-${runId}@luckypatcher.test`;
  const password = `Test-${runId}-${name}`;
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role, full_name: `RLS ${name}` },
  });

  if (error || !data.user) {
    throw new Error(`Unable to create ${name}: ${error?.message ?? "no user"}`);
  }

  createdIds.push(data.user.id);

  const client = createClient(url!, anonKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const signIn = await client.auth.signInWithPassword({ email, password });

  if (signIn.error) {
    throw new Error(`Unable to sign in ${name}: ${signIn.error.message}`);
  }

  return { id: data.user.id, email, password, client };
}

describe.skipIf(!configured)("profiles RLS against a live Supabase project", () => {
  let supabaseAdmin: SupabaseClient;
  let userOne: TestUser;
  let userTwo: TestUser;
  let adminUser: TestUser;

  beforeAll(async () => {
    supabaseAdmin = admin();
    userOne = await createUser(supabaseAdmin, "user-one", "user");
    userTwo = await createUser(supabaseAdmin, "user-two", "user");
    adminUser = await createUser(supabaseAdmin, "admin", "admin");
  }, 60_000);

  afterAll(async () => {
    for (const id of createdIds) {
      await supabaseAdmin.auth.admin.deleteUser(id);
    }
  }, 60_000);

  it("creates a profile row through the auth trigger", async () => {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name, role")
      .eq("id", userOne.id)
      .single();

    expect(error).toBeNull();
    expect(data).toMatchObject({
      id: userOne.id,
      email: userOne.email,
      full_name: "RLS user-one",
      role: "user",
    });
  });

  it("lets a regular user read only their own profile", async () => {
    const { data, error } = await userOne.client.from("profiles").select("id, email");

    expect(error).toBeNull();
    expect(data).toHaveLength(1);
    expect(data?.[0]?.id).toBe(userOne.id);
  });

  it("does not let a regular user update their own role", async () => {
    const update = await userOne.client
      .from("profiles")
      .update({ role: "superadmin" })
      .eq("id", userOne.id);

    expect(update.error).toBeNull();

    const { data } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", userOne.id)
      .single();

    expect(data?.role).toBe("user");
  });

  it("lets an admin read every profile", async () => {
    const { data, error } = await adminUser.client
      .from("profiles")
      .select("id")
      .in("id", [userOne.id, userTwo.id, adminUser.id]);

    expect(error).toBeNull();
    expect(data).toHaveLength(3);
  });

  it("lets an admin update another profile", async () => {
    const { error } = await adminUser.client
      .from("profiles")
      .update({ full_name: "Updated by admin" })
      .eq("id", userTwo.id);

    expect(error).toBeNull();

    const { data } = await supabaseAdmin
      .from("profiles")
      .select("full_name")
      .eq("id", userTwo.id)
      .single();

    expect(data?.full_name).toBe("Updated by admin");
  });

  it("denies anonymous profile reads", async () => {
    const anon = createClient(url!, anonKey!, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error } = await anon.from("profiles").select("id");

    expect(data ?? []).toHaveLength(0);
    expect(error).not.toBeNull();
  });

  it("lets the service role read every profile", async () => {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .in("id", [userOne.id, userTwo.id, adminUser.id]);

    expect(error).toBeNull();
    expect(data).toHaveLength(3);
  });
});
