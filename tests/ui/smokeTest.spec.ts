import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.stage"), override: true });

const ENV_URL_FULL = process.env.URL || "";
const ENV_URL = ENV_URL_FULL.replace(/\/login$/, "");
const ENV_NAME = "STAGE";

(globalThis as any).__TEST_ENV_URL__ = ENV_URL_FULL;
(globalThis as any).__TEST_ENV_USERNAME__ = process.env.USERNAME || "";
(globalThis as any).__TEST_ENV_PASSWORD__ = process.env.PASSWORD || "";

import { sequentialTest, expect } from "../../src/pages/basePage";
import { LOCATORS } from "../../src/locators.stage";

console.log(`\n🔧 Running: Smoke Suite - ${ENV_NAME} Environment`);
console.log(`   URL: ${ENV_URL}`);
console.log(`-----------------------------------\n`);

sequentialTest.describe.serial(`🔥 Smoke Suite - ${ENV_NAME} Environment`, () => {
  sequentialTest.setTimeout(120000);

  sequentialTest("Verify landing page after login", async ({ page }) => {
    await expect(page.locator(LOCATORS.home)).toBeVisible();
    console.log("Smoke 1 [STAGE]: Home page is visible after login");

    await expect(page.locator(LOCATORS.contactsApp)).toBeVisible();
    console.log("Smoke 2 [STAGE]: Contacts app is visible");

    await expect(page.locator(LOCATORS.signatureApp)).toBeVisible();
    console.log("Smoke 3 [STAGE]: Signature app is visible");

    await expect(page.locator(LOCATORS.fileManagerApp)).toBeVisible();
    console.log("Smoke 4 [STAGE]: File Manager app is visible");

    await expect(page.locator(LOCATORS.seliseStoreButton)).toBeVisible();
    console.log("Smoke 5 [STAGE]: SELISE Store button is visible");

    await expect(page.locator(LOCATORS.logo)).toBeVisible();
    console.log("Smoke 6 [STAGE]: Logo is visible in header");

    await expect(page.locator(LOCATORS.profileLogo)).toBeVisible();
    console.log("Smoke 7 [STAGE]: Profile logo is visible in header");

    await expect(page.locator(LOCATORS.myAppsMenu)).toBeVisible();
    console.log("Smoke 8 [STAGE]: My Apps menu is visible in header");

    console.log(`\nSmoke Suite [${ENV_NAME}]: All landing page checks passed\n`);
  });
});
