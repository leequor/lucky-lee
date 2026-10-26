#!/usr/bin/env node
import { existsSync } from "node:fs";
import process from "node:process";

for (const file of [".env.local", ".env"]) {
  if (existsSync(file)) {
    process.loadEnvFile(file);
    break;
  }
}

const required = [
  ["NEXT_PUBLIC_SUPABASE_URL", "Supabase project URL"],
  ["NEXT_PUBLIC_SUPABASE_ANON_KEY", "Supabase anon key"],
];

const optional = [
  ["NEXT_PUBLIC_SITE_URL", "Public app URL used in auth redirects"],
  ["SUPABASE_SERVICE_ROLE_KEY", "Server-only key for the demo seed script"],
  ["DEMO_PASSWORD", "Password for the seeded demo accounts"],
];

let missing = 0;

console.log("Environment check");
console.log("-----------------");

for (const [name, description] of required) {
  const value = process.env[name]?.trim();

  if (!value) {
    missing += 1;
    console.log(`MISSING  ${name} (${description})`);
    continue;
  }

  if (name === "NEXT_PUBLIC_SUPABASE_URL") {
    try {
      const url = new URL(value);
      const local =
        url.protocol === "http:" &&
        (url.hostname === "localhost" || url.hostname === "127.0.0.1");

      if (url.protocol !== "https:" && !local) {
        console.log(`INVALID  ${name} (must use HTTPS unless localhost)`);
        missing += 1;
        continue;
      }
    } catch {
      console.log(`INVALID  ${name} (not a valid URL)`);
      missing += 1;
      continue;
    }
  }

  console.log(`OK       ${name}`);
}

for (const [name, description] of optional) {
  console.log(`${process.env[name]?.trim() ? "OK      " : "OPTIONAL"} ${name} (${description})`);
}

if (missing > 0) {
  console.log("\nCopy .env.example to .env.local and fill in the missing values.");
  process.exit(1);
}

console.log("\nRequired environment variables are ready.");
