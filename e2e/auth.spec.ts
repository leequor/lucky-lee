import { test, expect } from "@playwright/test";

import {
  createConfirmedUser,
  demoPassword,
  demoUsers,
  generateRecoveryToken,
  uniqueEmail,
} from "./helpers";

test.describe("account access", () => {
  test("logged-out visitors are redirected from the landing page", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: "Sign in to Patchwork" })).toBeVisible();
  });

  test("the public registration page is invite-only", async ({ page }) => {
    await page.goto("/register");

    await expect(page.getByRole("heading", { name: "Staff accounts are invite-only" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Create account" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Back to sign in" })).toBeVisible();
  });

  test("a wrong password stays on the login page", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(demoUsers.user);
    await page.getByLabel("Password").fill("not-the-password");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText("Wrong email or password.")).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByLabel("Email")).toHaveValue(demoUsers.user);
    await expect(page.getByLabel("Password")).toHaveValue("");
  });

  test("a demo user can log in and log out", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(demoUsers.user);
    await page.getByLabel("Password").fill(demoPassword);
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL("/", { timeout: 15000 });
    await expect(page.getByText(demoUsers.user).first()).toBeVisible();
    await expect(page.getByText("Technician").first()).toBeVisible();

    await page.getByRole("button", { name: "Log out" }).click();
    await expect(page).toHaveURL(/\/login$/);

    await page.goto("/");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("forgot password gives a generic success for unknown emails", async ({ page }) => {
    const email = uniqueEmail("missing");

    await page.goto("/forgot-password");
    await page.getByLabel("Email").fill(email);
    await page.getByRole("button", { name: "Send reset link" }).click();

    await expect(page.getByRole("status")).toContainText("If an account exists");
    await expect(page).toHaveURL(/\/forgot-password$/);
  });

  test("a recovery link is single use and sets a new password", async ({ page }) => {
    const email = uniqueEmail("reset");
    const oldPassword = "OldPass123!";
    const newPassword = "NewPass123!";
    const userId = await createConfirmedUser(email, oldPassword);
    const token = await generateRecoveryToken(email);
    const recoveryPath = `/auth/confirm?token_hash=${encodeURIComponent(token)}&type=recovery&next=/reset-password`;

    await page.goto(recoveryPath);
    await expect(page).toHaveURL(/\/reset-password$/);
    await expect(page.getByRole("heading", { name: "Set a new password" })).toBeVisible();

    await page.getByLabel("New password", { exact: true }).fill(newPassword);
    await page.getByLabel("Confirm new password", { exact: true }).fill(newPassword);
    await page.getByRole("button", { name: "Update password" }).click();

    await expect(page).toHaveURL(/\/login\?message=/);
    await expect(page.getByText("Password updated.")).toBeVisible();

    await page.goto(recoveryPath);
    await expect(page).toHaveURL(/\/login\?error=/);
    await expect(page.getByText(/invalid, expired, or has already been used/)).toBeVisible();

    await page.goto("/login");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(oldPassword);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Wrong email or password.")).toBeVisible();

    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(newPassword);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL("/", { timeout: 15000 });
    await expect(page.getByText(email).first()).toBeVisible();

    await page.getByRole("button", { name: "Log out" }).click();
    await expect(page).toHaveURL(/\/login$/);

    const cleanup = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users/${userId}`,
      {
        method: "DELETE",
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        },
      },
    );
    expect(cleanup.ok).toBe(true);
  });
});
