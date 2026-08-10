import { chromium } from "playwright";
import path from "node:path";

const shotDir = "C:\\Users\\santi\\AppData\\Local\\Temp\\claude\\C--Users-santi\\f114e677-43fe-4909-9386-a2f53f5d1d8b\\scratchpad";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 375, height: 667 } }); // iPhone SE-ish

const consoleErrors = [];
page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
page.on("pageerror", (err) => consoleErrors.push(`pageerror: ${err.message}`));

await page.goto("http://localhost:3000/login", { waitUntil: "networkidle" });
await page.waitForSelector("text=เข้าสู่ระบบด้วย Gmail", { timeout: 15000 });
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(shotDir, "mobile-login.png") });
console.log("mobile login screenshot saved");

await page.goto("http://localhost:3000/dev/glass-preview", { waitUntil: "networkidle" });
await page.waitForSelector("text=Liquid Glass Preview", { timeout: 15000 });
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(shotDir, "mobile-glass-preview.png"), fullPage: true });
console.log("mobile glass-preview screenshot saved");

console.log("console errors:", JSON.stringify(consoleErrors, null, 2));
await browser.close();
