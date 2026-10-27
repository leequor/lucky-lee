import { test, expect } from "@playwright/test";

test("health endpoints report the app and Supabase as ready", async ({ page, request }) => {
  const app = await request.get("/api/health");
  expect(app.status()).toBe(200);
  expect((await app.json()).status).toBe("ok");

  const supabase = await request.get("/api/health/supabase");
  expect(supabase.status()).toBe(200);
  expect((await supabase.json()).status).toBe("connected");

  await page.goto("/status");
  await expect(page.getByText("Next.js app", { exact: true })).toBeVisible();
  await expect(page.getByText("Supabase connection", { exact: true })).toBeVisible();
  await expect(page.getByText(/Connected in \d+ ms/)).toBeVisible();
});
