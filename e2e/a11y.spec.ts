import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

import { demoPassword, demoUsers } from "./helpers";

async function criticalViolations(page: import("@playwright/test").Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();

  return results.violations.filter((violation) => violation.impact === "critical");
}

for (const path of ["/login", "/register", "/forgot-password", "/status"]) {
  test(`no critical accessibility violations on ${path}`, async ({ page }) => {
    await page.goto(path);

    expect(await criticalViolations(page)).toEqual([]);
  });
}

test("no critical accessibility violations on the landing page", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(demoUsers.user);
  await page.getByLabel("Password").fill(demoPassword);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL("/");

  expect(await criticalViolations(page)).toEqual([]);
});
