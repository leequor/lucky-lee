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

  it("lets a regular user read the staff directory", async () => {
    const { data, error } = await userOne.client.from("profiles").select("id, email");

    expect(error).toBeNull();
    expect(data?.length).toBeGreaterThanOrEqual(3);
    expect(data?.map((row) => row.id)).toEqual(
      expect.arrayContaining([userOne.id, userTwo.id, adminUser.id]),
    );
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

  it("denies anonymous repair-table reads", async () => {
    const anon = createClient(url!, anonKey!, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error } = await anon.from("tickets").select("id").limit(1);

    expect(data ?? []).toHaveLength(0);
    expect(error).not.toBeNull();
  });

  it("lets staff read the repair queue", async () => {
    const { data, error } = await userOne.client.from("tickets").select("id").limit(5);

    expect(error).toBeNull();
    expect((data ?? []).length).toBeGreaterThan(0);
  });

  it("tracks a seeded ticket through the public RPC", async () => {
    const anon = createClient(url!, anonKey!, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error } = await anon.rpc("track_ticket", {
      p_code: "TRACK1041",
    });

    expect(error).toBeNull();
    expect(data).toMatchObject({ ticket_number: "PW-1041", status: "in_repair" });
  });

  it("only lets an owner grant owner access", async () => {
    const { error } = await adminUser.client
      .from("profiles")
      .update({ role: "superadmin" })
      .eq("id", adminUser.id);

    expect(error).not.toBeNull();

    const { data } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", adminUser.id)
      .single();

    expect(data?.role).toBe("admin");
  });

  it("does not let a technician write inventory or invoices", async () => {
    const { data: part } = await supabaseAdmin.from("parts").select("id,stock").limit(1).single();
    const { data: invoice } = await supabaseAdmin
      .from("invoices")
      .select("id,status")
      .limit(1)
      .single();

    const stockUpdate = await userOne.client
      .from("parts")
      .update({ stock: part!.stock })
      .eq("id", part!.id)
      .select("id");

    const invoiceUpdate = await userOne.client
      .from("invoices")
      .update({ status: invoice!.status })
      .eq("id", invoice!.id)
      .select("id");

    expect(stockUpdate.data ?? []).toHaveLength(0);
    expect(invoiceUpdate.data ?? []).toHaveLength(0);
  });

  it("does not let a technician collect an invoice through the billing RPC", async () => {
    const { data: invoice } = await supabaseAdmin
      .from("invoices")
      .select("id,status")
      .eq("status", "sent")
      .limit(1)
      .single();

    const { error } = await userOne.client.rpc("mark_invoice_paid", {
      p_invoice_id: invoice!.id,
    });

    expect(error).not.toBeNull();

    const { data } = await supabaseAdmin
      .from("invoices")
      .select("status")
      .eq("id", invoice!.id)
      .single();

    expect(data?.status).toBe("sent");
  });

  it("lets a manager adjust inventory", async () => {
    const { data: part } = await supabaseAdmin.from("parts").select("id,stock").limit(1).single();

    const { data, error } = await adminUser.client
      .from("parts")
      .update({ stock: part!.stock })
      .eq("id", part!.id)
      .select("id");

    expect(error).toBeNull();
    expect(data ?? []).toHaveLength(1);
  });

  it("tracks with only the code and rejects the guessable ticket number", async () => {
    const anon = createClient(url!, anonKey!, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const byCode = await anon.rpc("track_ticket", {
      p_code: " track1041 ",
    });
    const byTicketNumber = await anon.rpc("track_ticket", {
      p_code: "PW-1041",
    });
    const unknown = await anon.rpc("track_ticket", {
      p_code: "NOPE",
    });

    expect(byCode.error).toBeNull();
    expect(byCode.data).toMatchObject({ ticket_number: "PW-1041" });
    expect(byTicketNumber.error).toBeNull();
    expect(byTicketNumber.data).toBeNull();
    expect(unknown.error).toBeNull();
    expect(unknown.data).toBeNull();
  });
});
