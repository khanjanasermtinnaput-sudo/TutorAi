import { chromium } from "playwright";
import path from "node:path";

const shotDir = "C:\\Users\\santi\\AppData\\Local\\Temp\\claude\\C--Users-santi\\f114e677-43fe-4909-9386-a2f53f5d1d8b\\scratchpad";
const SETTLE_MS = 500; // let Framer Motion spring animations finish before screenshotting

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (err) => consoleErrors.push(`pageerror: ${err.message}`));

console.log("=== /login ===");
await page.goto("http://localhost:3000/login", { waitUntil: "networkidle" });
await page.waitForSelector("text=เข้าสู่ระบบด้วย Gmail", { timeout: 15000 });
await page.waitForTimeout(SETTLE_MS);
await page.screenshot({ path: path.join(shotDir, "login-light.png") });
console.log("login screenshot saved");

console.log("=== /login dark theme ===");
await page.emulateMedia({ colorScheme: "dark" });
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(SETTLE_MS);
await page.screenshot({ path: path.join(shotDir, "login-dark.png") });
console.log("login dark screenshot saved");

console.log("=== /dev/glass-preview light ===");
await page.emulateMedia({ colorScheme: "light" });
await page.goto("http://localhost:3000/dev/glass-preview", { waitUntil: "networkidle" });
await page.waitForSelector("text=Liquid Glass Preview", { timeout: 15000 });
await page.waitForTimeout(SETTLE_MS);
await page.screenshot({ path: path.join(shotDir, "glass-preview-light.png"), fullPage: true });
console.log("glass-preview light screenshot saved");

console.log("=== /dev/glass-preview dark ===");
await page.emulateMedia({ colorScheme: "dark" });
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(SETTLE_MS);
await page.screenshot({ path: path.join(shotDir, "glass-preview-dark.png"), fullPage: true });
console.log("glass-preview dark screenshot saved");

console.log("=== interact: open modal ===");
await page.getByText("เปิด Modal").click();
await page.waitForSelector("text=สาธิตการเปิดแบบ droplet morph", { timeout: 5000 });
await page.waitForTimeout(SETTLE_MS);
await page.screenshot({ path: path.join(shotDir, "glass-modal-open.png") });
console.log("modal screenshot saved");

console.log("=== console errors ===");
console.log(JSON.stringify(consoleErrors, null, 2));

await browser.close();
