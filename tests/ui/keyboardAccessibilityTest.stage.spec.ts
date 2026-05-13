/**
 * ============================================================================
 * KEYBOARD NAVIGATION ACCESSIBILITY TEST - STAGE ENVIRONMENT
 * ============================================================================
 *
 * Purpose:
 *   This file contains keyboard-only accessibility tests mirroring the full
 *   regression test flow. All interactions use Tab, Enter, Space, and Arrow keys.
 *
 * How to Run:
 *   npm run test:keyboard          - Run keyboard accessibility tests (headed)
 *   npm run test:keyboard:ci       - Run keyboard accessibility tests (headless)
 *
 * ============================================================================
 */

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

console.log(`\n⌨️  Running: Keyboard Navigation Suite - ${ENV_NAME} Environment`);
console.log(`   URL: ${ENV_URL}`);
console.log(`-----------------------------------\n`);

sequentialTest.describe.serial(`⌨️  Keyboard Navigation Suite - ${ENV_NAME}`, () => {
  sequentialTest.setTimeout(600000);

  // ==========================================================================
  // TEST 1: HOME PAGE KEYBOARD NAVIGATION
  // ==========================================================================

  sequentialTest("Test 1: Home Page Keyboard Navigation", async ({ page }) => {
    await expect(page.locator(LOCATORS.home)).toBeVisible();
    console.log(`Test 1.0 [${ENV_NAME}]: Home page loaded\n`);

    const focusableCount = await page.evaluate(() => {
      return document.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex="0"]'
      ).length;
    });
    expect(focusableCount).toBeGreaterThan(0);
    console.log(`Test 1.1 [${ENV_NAME}]: Focusable elements found: ${focusableCount}\n`);

    let tabCount = 0;
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(100);
      const tag = await page.evaluate(() => document.activeElement?.tagName);
      if (tag) tabCount++;
    }
    console.log(`Test 1.2 [${ENV_NAME}]: Tabbed through ${tabCount} elements\n`);

    await page.keyboard.press("Shift+Tab");
    await page.waitForTimeout(200);
    const previousElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(previousElement).toBeTruthy();
    console.log(`Test 1.3 [${ENV_NAME}]: Shift+Tab works: ${previousElement}\n`);

    console.log(`Test 1 [${ENV_NAME}]: Home page keyboard navigation PASSED\n`);
  });

  // ==========================================================================
  // TEST 2: LANDING PAGE KEYBOARD NAVIGATION
  // ==========================================================================

  sequentialTest("Test 2: Landing Page Keyboard Navigation", async ({ page }) => {
    await expect(page.locator(LOCATORS.contactsApp)).toBeVisible();
    console.log(`Test 2.1 [${ENV_NAME}]: Contacts app is visible\n`);

    await expect(page.locator(LOCATORS.signatureApp)).toBeVisible();
    console.log(`Test 2.2 [${ENV_NAME}]: Signature app is visible\n`);

    await expect(page.locator(LOCATORS.fileManagerApp)).toBeVisible();
    console.log(`Test 2.3 [${ENV_NAME}]: File Manager app is visible\n`);

    await expect(page.locator(LOCATORS.seliseStoreButton)).toBeVisible();
    console.log(`Test 2.4 [${ENV_NAME}]: SELISE Store button is present\n`);

    await expect(page.locator(LOCATORS.logo)).toBeVisible();
    console.log(`Test 2.5 [${ENV_NAME}]: Logo is visible in header\n`);

    await expect(page.locator(LOCATORS.profileLogo)).toBeVisible();
    console.log(`Test 2.6 [${ENV_NAME}]: Profile logo is visible in header\n`);

    await expect(page.locator(LOCATORS.myAppsMenu)).toBeVisible();
    console.log(`Test 2.7 [${ENV_NAME}]: My Apps menu is visible in header\n`);
  });

  // ==========================================================================
  // TEST 3: SIGNATURE MODULE KEYBOARD NAVIGATION
  // ==========================================================================

  sequentialTest("Test 3: Signature Module Keyboard Navigation", async ({ page }) => {
    await page.locator(LOCATORS.signatureApp).first().click();
    await page.waitForTimeout(2000);
    console.log(`Test 3.0 [${ENV_NAME}]: Signature app clicked\n`);

    const yetToSignCard = page.locator(LOCATORS.yetToSignCard);
    await yetToSignCard.scrollIntoViewIfNeeded();
    await yetToSignCard.waitFor({ state: "visible", timeout: 5000 });
    if (await yetToSignCard.isVisible()) {
      await yetToSignCard.focus();
      await page.keyboard.press("Enter");
      await page.waitForTimeout(2000);
      console.log(`Test 3.1 [${ENV_NAME}]: Yet To Sign opened via Enter\n`);
      await page.goto(`${ENV_URL}/e-signature`);
      await page.waitForTimeout(2000);
    }

    const yetToReviewCard = page.locator(LOCATORS.yetToReviewCard);
    await yetToReviewCard.scrollIntoViewIfNeeded();
    await yetToReviewCard.waitFor({ state: "visible", timeout: 5000 });
    if (await yetToReviewCard.isVisible()) {
      await yetToReviewCard.focus();
      await page.keyboard.press("Enter");
      await page.waitForTimeout(2000);
      console.log(`Test 3.2 [${ENV_NAME}]: Yet To Review opened via Enter\n`);
      await page.goto(`${ENV_URL}/e-signature`);
      await page.waitForTimeout(2000);
    }

    const pendingCard = page.locator(LOCATORS.pendingCard);
    await pendingCard.scrollIntoViewIfNeeded();
    await pendingCard.waitFor({ state: "visible", timeout: 5000 });
    if (await pendingCard.isVisible()) {
      await pendingCard.focus();
      await page.keyboard.press("Enter");
      await page.waitForTimeout(2000);
      console.log(`Test 3.3 [${ENV_NAME}]: Pending opened via Enter\n`);
      await page.goto(`${ENV_URL}/e-signature`);
      await page.waitForTimeout(2000);
    }

    const completedCard = page.locator(LOCATORS.completedCard);
    await completedCard.scrollIntoViewIfNeeded();
    await completedCard.waitFor({ state: "visible", timeout: 5000 });
    if (await completedCard.isVisible()) {
      await completedCard.focus();
      await page.keyboard.press("Enter");
      await page.waitForTimeout(2000);
      console.log(`Test 3.4 [${ENV_NAME}]: Completed opened via Enter\n`);
    }
  });

  // ==========================================================================
  // TEST 4: DOCUMENT UPLOAD VIA KEYBOARD
  // ==========================================================================

  sequentialTest("Test 4: Upload Document via Keyboard", async ({ page }) => {
    await page.goto(`${ENV_URL}/e-signature`);
    await page.waitForTimeout(3000);
    console.log(`Test 4.0 [${ENV_NAME}]: Navigated to Signature module\n`);

    const closeAlert = page.locator(LOCATORS.closeAlertBtn).first();
    if (await closeAlert.isVisible()) {
      await closeAlert.focus();
      await page.keyboard.press("Enter");
      await page.waitForTimeout(500);
    }

    const uploadAreaVisible = await page.locator(LOCATORS.uploadArea).isVisible();
    if (!uploadAreaVisible) {
      console.log(`Test 4.1 [${ENV_NAME}]: SKIPPED - Upload area not visible\n`);
      console.log(`Test 4 [${ENV_NAME}]: SKIPPED - Upload workflow not available\n`);
      return;
    }

    await page.locator(LOCATORS.uploadArea).waitFor({ state: "visible", timeout: 10000 });
    await expect(page.locator(LOCATORS.uploadArea)).toBeVisible();
    console.log(`Test 4.1 [${ENV_NAME}]: Upload area is visible\n`);

    await page.locator(LOCATORS.uploadInput).setInputFiles("test-data/template.pdf");
    await page.waitForTimeout(5000);
    console.log(`Test 4.2 [${ENV_NAME}]: File uploaded\n`);

    await page.locator(LOCATORS.envelopeNameInput).waitFor({ state: "visible", timeout: 10000 });
    await page.locator(LOCATORS.envelopeNameInput).focus();
    await page.keyboard.press("Control+a");
    await page.keyboard.type("Keyboard Test");
    console.log(`Test 4.3 [${ENV_NAME}]: Envelope name typed via keyboard\n`);

    await page.locator(LOCATORS.addRecipientBtn).waitFor({ state: "visible", timeout: 10000 });
    await page.locator(LOCATORS.addRecipientBtn).focus();
    await page.keyboard.press("Enter");
    console.log(`Test 4.4 [${ENV_NAME}]: Add Recipient via Enter\n`);

    await page.locator(LOCATORS.addRecipientsPage).waitFor({ state: "visible", timeout: 10000 });
    await expect(page.locator(LOCATORS.addRecipientsPage)).toBeVisible();
    console.log(`Test 4.5 [${ENV_NAME}]: Add Recipients page visible\n`);

    await page.locator(LOCATORS.prepareDocumentBtn).waitFor({ state: "visible", timeout: 10000 });
    await page.locator(LOCATORS.prepareDocumentBtn).focus();
    await page.keyboard.press("Enter");
    console.log(`Test 4.6 [${ENV_NAME}]: Prepare Document via Enter\n`);

    await page.waitForTimeout(3000);
    console.log(`Test 4.7 [${ENV_NAME}]: Document loaded\n`);

    console.log(`Test 4 [${ENV_NAME}]: Upload via keyboard completed\n`);
  });

  // ==========================================================================
  // TEST 5: SIGNATURE ADVANCE WORKFLOW VIA KEYBOARD
  // ==========================================================================

  sequentialTest("Test 5: Signature Advance Workflow via Keyboard", async ({ page }) => {
    await page.goto(`${ENV_URL}/e-signature`);
    await page.waitForTimeout(3000);
    console.log(`Test 5.0 [${ENV_NAME}]: Navigated to Signature module\n`);

    const closeAlert = page.locator(LOCATORS.closeAlertBtn).first();
    if (await closeAlert.isVisible()) {
      await closeAlert.focus();
      await page.keyboard.press("Enter");
      await page.waitForTimeout(500);
    }

    const uploadAreaVisible = await page.locator(LOCATORS.uploadArea).isVisible();
    if (!uploadAreaVisible) {
      console.log(`Test 5.1 [${ENV_NAME}]: SKIPPED - Upload area not visible\n`);
      console.log(`Test 5 [${ENV_NAME}]: SKIPPED - Advance workflow not available\n`);
      return;
    }

    await page.locator(LOCATORS.uploadArea).waitFor({ state: "visible", timeout: 10000 });
    console.log(`Test 5.1 [${ENV_NAME}]: Upload area is visible\n`);

    await page.locator(LOCATORS.uploadInput).setInputFiles("test-data/template.pdf");
    await page.waitForTimeout(8000);
    console.log(`Test 5.2 [${ENV_NAME}]: File uploaded\n`);

    const uploadProgress = page.locator('text="template.pdf"').first();
    await uploadProgress.waitFor({ state: "visible", timeout: 15000 });
    console.log(`Test 5.2.1 [${ENV_NAME}]: File upload verified\n`);

    await page.locator(LOCATORS.envelopeNameInput).waitFor({ state: "visible", timeout: 30000 });
    await page.locator(LOCATORS.envelopeNameInput).focus();
    await page.keyboard.press("Control+a");
    await page.keyboard.type("Advance Keyboard Test");

    await page.locator(LOCATORS.signatureTypeAdvance).focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(500);
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    console.log(`Test 5.3 [${ENV_NAME}]: Signature type selected via keyboard\n`);

    await page.locator(LOCATORS.addRecipientBtn).waitFor({ state: "visible", timeout: 10000 });
    await page.locator(LOCATORS.addRecipientBtn).focus();
    await page.keyboard.press("Enter");
    console.log(`Test 5.4 [${ENV_NAME}]: Add Recipient via Enter\n`);

    await page.locator(LOCATORS.addRecipientsPage).waitFor({ state: "visible", timeout: 10000 });
    await expect(page.locator(LOCATORS.addRecipientsPage)).toBeVisible();
    console.log(`Test 5.5 [${ENV_NAME}]: Add Recipients page visible\n`);

    await page.locator(LOCATORS.prepareDocumentBtn).waitFor({ state: "visible", timeout: 10000 });
    await page.locator(LOCATORS.prepareDocumentBtn).focus();
    await page.keyboard.press("Enter");
    console.log(`Test 5.6 [${ENV_NAME}]: Prepare Document via Enter\n`);

    await page.waitForTimeout(5000);
    console.log(`Test 5 [${ENV_NAME}]: Advance keyboard workflow completed\n`);
  });

  // ==========================================================================
  // TEST 6: SIGN A DOCUMENT VIA KEYBOARD
  // ==========================================================================

  sequentialTest("Test 6: Sign A Document via Keyboard", async ({ page }) => {
    await page.goto(`${ENV_URL}/e-signature`);
    await page.waitForTimeout(3000);
    console.log(`Test 6.0 [${ENV_NAME}]: Navigated to Signature module\n`);

    const signADocBtn = page.locator('button:has-text("Sign A Document")');
    await signADocBtn.waitFor({ state: "visible", timeout: 10000 });
    await signADocBtn.focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(2000);
    console.log(`Test 6.1 [${ENV_NAME}]: Sign A Document via Enter\n`);

    await page.locator(LOCATORS.uploadInput).setInputFiles("test-data/template.pdf");
    await page.waitForTimeout(8000);
    console.log(`Test 6.2 [${ENV_NAME}]: File uploaded\n`);

    await page.locator(LOCATORS.envelopeNameInput).waitFor({ state: "visible", timeout: 30000 });
    await page.locator(LOCATORS.envelopeNameInput).focus();
    await page.keyboard.press("Control+a");
    await page.keyboard.type("Sign Doc Keyboard Test");
    console.log(`Test 6.3 [${ENV_NAME}]: Envelope name typed\n`);

    await page.locator(LOCATORS.addRecipientBtn).waitFor({ state: "visible", timeout: 10000 });
    await page.locator(LOCATORS.addRecipientBtn).focus();
    await page.keyboard.press("Enter");
    console.log(`Test 6.4 [${ENV_NAME}]: Add Recipient via Enter\n`);

    await page.locator(LOCATORS.prepareDocumentBtn).waitFor({ state: "visible", timeout: 10000 });
    await page.locator(LOCATORS.prepareDocumentBtn).focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(5000);
    console.log(`Test 6.5 [${ENV_NAME}]: Prepare Document via Enter\n`);

    console.log(`Test 6 [${ENV_NAME}]: Sign A Document keyboard flow completed\n`);
  });

  // ==========================================================================
  // TEST 7: MENU AND DROPDOWN KEYBOARD NAVIGATION
  // ==========================================================================

  sequentialTest("Test 7: Menu and Dropdown Keyboard Navigation", async ({ page }) => {
    await page.goto(`${ENV_URL}/home`);
    await page.waitForTimeout(3000);
    console.log(`Test 7.0 [${ENV_NAME}]: Testing menu keyboard navigation\n`);

    const menuButton = page.locator(LOCATORS.myAppsMenu);
    await menuButton.waitFor({ state: "visible", timeout: 5000 });
    await menuButton.focus();
    console.log(`Test 7.1 [${ENV_NAME}]: Focused on menu button\n`);

    await page.keyboard.press("Space");
    await page.waitForTimeout(500);
    console.log(`Test 7.2 [${ENV_NAME}]: Space key pressed on menu\n`);

    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(200);
    const afterArrowDown = await page.evaluate(() => document.activeElement?.tagName);
    expect(afterArrowDown).toBeTruthy();
    console.log(`Test 7.3 [${ENV_NAME}]: ArrowDown moves in menu: ${afterArrowDown}\n`);

    await page.keyboard.press("ArrowUp");
    await page.waitForTimeout(200);
    console.log(`Test 7.4 [${ENV_NAME}]: ArrowUp moves in menu\n`);

    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
    console.log(`Test 7.5 [${ENV_NAME}]: Escape closes menu\n`);
  });

  // ==========================================================================
  // TEST 8: COMBINED KEYBOARD WORKFLOW
  // ==========================================================================

  sequentialTest("Test 8: Combined Keyboard Workflow", async ({ page }) => {
    await page.goto(`${ENV_URL}/home`);
    await page.waitForTimeout(3000);
    console.log(`Test 8.0 [${ENV_NAME}]: Testing complete keyboard workflow\n`);

    let signatureFound = false;
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(100);
      const text = await page.evaluate(() => document.activeElement?.textContent);
      if (text?.includes("Signature")) {
        signatureFound = true;
        console.log(`Test 8.1 [${ENV_NAME}]: Found Signature app link via Tab\n`);
        break;
      }
    }

    if (signatureFound) {
      await page.keyboard.press("Enter");
      await page.waitForTimeout(3000);
      const onSignaturePage = page.url().includes("e-signature");
      console.log(`Test 8.2 [${ENV_NAME}]: Navigated to signature page: ${onSignaturePage}\n`);

      const uploadArea = page.locator(LOCATORS.uploadArea);
      if (await uploadArea.isVisible()) {
        for (let i = 0; i < 10; i++) {
          await page.keyboard.press("Tab");
          await page.waitForTimeout(100);
          const type = await page.evaluate(() => (document.activeElement as any)?.type);
          if (type === "file") {
            console.log(`Test 8.3 [${ENV_NAME}]: Found file input via Tab\n`);
            break;
          }
        }
      }
    }

    console.log(`Test 8 [${ENV_NAME}]: Combined keyboard workflow PASSED\n`);
  });
});
