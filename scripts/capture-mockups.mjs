import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

import { chromium } from "@playwright/test";

const baseUrl = process.env.CAPTURE_BASE_URL || "http://localhost:3000";
const email = process.env.CAPTURE_EMAIL || "user@luckypatcher.test";
const password = process.env.CAPTURE_PASSWORD || "LuckyLee-Demo-2026!";
const chromeCandidates = [
  process.env.CAPTURE_CHROME,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const executablePath = chromeCandidates.find((path) => existsSync(path));

const pages = [
  ["/login", "login.png"],
  ["/register", "register.png"],
  ["/forgot-password", "forgot-password.png"],
  ["/design-preview/reset-password", "reset-password.png"],
  ["/status", "status.png"],
];

const mockupsDir = join(process.cwd(), "design", "mockups");
mkdirSync(mockupsDir, { recursive: true });

const browser = await chromium.launch({ executablePath, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

try {
  for (const [path, name] of pages) {
    await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(3000);
    const target = join(mockupsDir, name);
    await page.screenshot({ path: target, fullPage: true });
    console.log(`captured ${name}`);
  }

  await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle" });
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await Promise.all([
    page.waitForURL(`${baseUrl}/`),
    page.getByRole("button", { name: "Sign in" }).click(),
  ]);
  await page.waitForTimeout(4000);

  const landing = join(mockupsDir, "landing-preview.png");
  await page.screenshot({ path: landing, fullPage: true });
  console.log("captured landing-preview.png");
} finally {
  await browser.close();
}
