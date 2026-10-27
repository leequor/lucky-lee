import { test, expect } from "@playwright/test";

import { demoPassword, demoUsers } from "./helpers";

const widths = [360, 768, 1440];

for (const width of widths) {
  test(`public screens have no horizontal scroll at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });

    for (const path of ["/login", "/register", "/forgot-password"]) {
      await page.goto(path);
      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      expect(metrics.scrollWidth, `${path} at ${width}px`).toBeLessThanOrEqual(
        metrics.clientWidth + 1,
      );
    }
  });
}

test("the landing page has no horizontal scroll at mobile width", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 900 });
  await page.goto("/login");
  await page.getByLabel("Email").fill(demoUsers.user);
  await page.getByLabel("Password").fill(demoPassword);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL("/");

  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));

  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
  await expect(page.getByRole("button", { name: "Log out" })).toBeVisible();
});
