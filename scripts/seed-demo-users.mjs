#!/usr/bin/env node
import { existsSync } from "node:fs";
import process from "node:process";

import { createClient } from "@supabase/supabase-js";

for (const file of [".env.local", ".env"]) {
  if (existsSync(file)) {
    process.loadEnvFile(file);
    break;
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const password = process.env.DEMO_PASSWORD;

if (!url || !serviceRoleKey) {
  console.error(
    "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local before seeding demo accounts.",
  );
  process.exit(1);
}

if (!password || password.length < 6) {
  console.error("Set DEMO_PASSWORD to at least 6 characters before seeding demo accounts.");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const demoUsers = [
  {
    email: "alex@luckypatcher.test",
    role: "superadmin",
    fullName: "Alex Campita",
  },
  {
    email: "admin@luckypatcher.test",
    role: "admin",
    fullName: "Demo Admin",
  },
  {
    email: "user@luckypatcher.test",
    role: "user",
    fullName: "Demo User",
  },
];

const { data: existing, error: listError } = await supabase.auth.admin.listUsers({
  page: 1,
  perPage: 1000,
});

if (listError) {
  console.error(`Unable to list users: ${listError.message}`);
  process.exit(1);
}

const byEmail = new Map((existing?.users ?? []).map((user) => [user.email?.toLowerCase(), user]));

for (const demo of demoUsers) {
  const current = byEmail.get(demo.email);
  let userId = current?.id;

  if (current) {
    const { error } = await supabase.auth.admin.updateUserById(current.id, {
      password,
      email_confirm: true,
      user_metadata: {
        role: demo.role,
        full_name: demo.fullName,
      },
    });

    if (error) {
      console.error(`Unable to update ${demo.email}: ${error.message}`);
      process.exit(1);
    }
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email: demo.email,
      password,
      email_confirm: true,
      user_metadata: {
        role: demo.role,
        full_name: demo.fullName,
      },
    });

    if (error || !data.user) {
      console.error(`Unable to create ${demo.email}: ${error?.message ?? "unknown error"}`);
      process.exit(1);
    }

    userId = data.user.id;
  }

  if (!userId) {
    console.error(`No user id returned for ${demo.email}.`);
    process.exit(1);
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: userId,
    email: demo.email,
    full_name: demo.fullName,
    role: demo.role,
  });

  if (profileError) {
    console.error(`Unable to upsert the profile for ${demo.email}: ${profileError.message}`);
    process.exit(1);
  }

  console.log(`Seeded ${demo.email} (${demo.role}).`);
}

console.log("\nDemo accounts are ready. Use DEMO_PASSWORD from .env.local to sign in.");
