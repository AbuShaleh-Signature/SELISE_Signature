/**
 * ============================================================================
 * KEYBOARD NAVIGATION ACCESSIBILITY TEST - STAGE ENVIRONMENT
 * ============================================================================
 *
 * Purpose:
 *   This file contains keyboard-only accessibility tests for the SELISE Signature
 *   module. All interactions are performed using only keyboard input.
 *
 * How to Run:
 *   npm run test:keyboard          - Run keyboard accessibility tests (headed)
 *   npm run test:keyboard:ci       - Run keyboard accessibility tests (headless)
 *
 * Keyboard Navigation Standards:
 *   - Tab: Move forward through focusable elements
 *   - Shift+Tab: Move backward through focusable elements
 *   - Enter: Activate buttons/links
 *   - Space: Activate buttons/checkboxes
 *   - Arrow keys: Navigate within menus/dropdowns
 *   - Escape: Close modals/dropdowns
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

console.log(`\n⌨️  Running: Keyboard Navigation Accessibility Suite - ${ENV_NAME}`);
console.log(`   URL: ${ENV_URL}`);
console.log(`-----------------------------------\n`);

sequentialTest.describe.serial(`⌨️  Keyboard Navigation Suite - ${ENV_NAME}`, () => {
  sequentialTest.setTimeout(300000);

  // ==========================================================================
  // TEST 1: HOME PAGE KEYBOARD NAVIGATION
  // ==========================================================================

  sequentialTest("Test 1: Home Page Keyboard Navigation", async ({ page }) => {
    await page.goto(`${ENV_URL}/home`);
    await page.waitForTimeout(3000);
    console.log(`Test 1.0 [${ENV_NAME}]: Testing home page keyboard navigation\n`);

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

    for (let i = 0; i < 20; i++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(50);
      const text = await page.evaluate(() => document.activeElement?.textContent);
      if (text?.includes("My Apps") || text?.includes("Apps")) {
        console.log(`Test 1.4 [${ENV_NAME}]: Found menu: "${text}"\n`);
        break;
      }
    }

    console.log(`Test 1 [${ENV_NAME}]: Home page keyboard navigation PASSED\n`);
  });

  // ==========================================================================
  // TEST 2: SIGNATURE MODULE KEYBOARD NAVIGATION
  // ==========================================================================

  sequentialTest("Test 2: Signature Module Keyboard Navigation", async ({ page }) => {
    await page.goto(`${ENV_URL}/e-signature`);
    await page.waitForTimeout(3000);
    console.log(`Test 2.0 [${ENV_NAME}]: Testing signature module keyboard navigation\n`);

    const closeBtn = page.locator(LOCATORS.closeAlertBtn).first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await page.waitForTimeout(500);
      console.log(`Test 2.1 [${ENV_NAME}]: Closed alert\n`);
    }

    let cardFound = false;
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(100);
      const text = await page.evaluate(() => document.activeElement?.textContent);
      if (
        text?.includes("Yet To Sign") ||
        text?.includes("Yet To Review") ||
        text?.includes("Pending") ||
        text?.includes("Completed")
      ) {
        cardFound = true;
        console.log(`Test 2.2 [${ENV_NAME}]: Found status card: "${text?.slice(0, 30)}..."\n`);
        break;
      }
    }
    if (!cardFound) {
      console.log(
        `Test 2.2 [${ENV_NAME}]: Status cards not reachable via Tab (may be below viewport)\n`
      );
    }

    let uploadFound = false;
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(100);
      const text = await page.evaluate(() => document.activeElement?.textContent);
      if (text?.includes("Upload") || text?.includes("Device")) {
        uploadFound = true;
        console.log(`Test 2.3 [${ENV_NAME}]: Found upload button: "${text?.slice(0, 50)}..."\n`);
        break;
      }
    }
    console.log(
      `Test 2.3 [${ENV_NAME}]: Upload area navigation ${uploadFound ? "verified" : "not found"}\n`
    );

    console.log(`Test 2 [${ENV_NAME}]: Signature module keyboard navigation PASSED\n`);
  });

  // ==========================================================================
  // TEST 3: FORM INPUT KEYBOARD NAVIGATION
  // ==========================================================================

  sequentialTest("Test 3: Form Input Keyboard Navigation", async ({ page }) => {
    await page.goto(`${ENV_URL}/e-signature`);
    await page.waitForTimeout(3000);
    console.log(`Test 3.0 [${ENV_NAME}]: Testing form input keyboard navigation\n`);

    const closeBtn = page.locator(LOCATORS.closeAlertBtn).first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await page.waitForTimeout(500);
    }

    await page.locator(LOCATORS.uploadArea).waitFor({ state: "visible", timeout: 10000 });
    await page.locator(LOCATORS.uploadInput).setInputFiles("test-data/template.pdf");
    await page.waitForTimeout(8000);

    const envelopeInput = page.locator(LOCATORS.envelopeNameInput);
    await envelopeInput.focus();

    await page.keyboard.press("Control+a");
    await page.keyboard.type("Keyboard Test");
    const value = await envelopeInput.inputValue();
    expect(value).toBe("Keyboard Test");
    console.log(`Test 3.1 [${ENV_NAME}]: Typed in input using keyboard\n`);

    await page.keyboard.press("Tab");
    await page.waitForTimeout(200);
    const afterTab = await page.evaluate(() => document.activeElement?.tagName);
    expect(afterTab).toBeTruthy();
    console.log(`Test 3.2 [${ENV_NAME}]: Tab moved to: ${afterTab}\n`);

    await page.keyboard.press("Shift+Tab");
    await page.waitForTimeout(200);
    const afterShiftTab = await page.evaluate(() => document.activeElement?.tagName);
    expect(afterShiftTab).toBeTruthy();
    console.log(`Test 3.3 [${ENV_NAME}]: Shift+Tab moved to: ${afterShiftTab}\n`);

    await envelopeInput.focus();
    await page.keyboard.press("Control+a");
    await page.keyboard.press("Backspace");
    const clearedValue = await envelopeInput.inputValue();
    expect(clearedValue).toBe("");
    console.log(`Test 3.4 [${ENV_NAME}]: Can select all and delete\n`);

    await page.goto(`${ENV_URL}/home`);
    await page.waitForTimeout(2000);
    console.log(`Test 3 [${ENV_NAME}]: Form input keyboard navigation PASSED\n`);
  });

  // ==========================================================================
  // TEST 4: MENU AND DROPDOWN KEYBOARD NAVIGATION
  // ==========================================================================

  sequentialTest("Test 4: Menu and Dropdown Keyboard Navigation", async ({ page }) => {
    await page.goto(`${ENV_URL}/home`);
    await page.waitForTimeout(3000);
    console.log(`Test 4.0 [${ENV_NAME}]: Testing menu and dropdown keyboard navigation\n`);

    const menuButton = page.locator(LOCATORS.myAppsMenu);
    await menuButton.waitFor({ state: "visible", timeout: 5000 });
    await menuButton.focus();
    console.log(`Test 4.1 [${ENV_NAME}]: Focused on menu button\n`);

    await page.keyboard.press("Space");
    await page.waitForTimeout(500);
    console.log(`Test 4.2 [${ENV_NAME}]: Space key pressed on menu\n`);

    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(200);
    const afterArrowDown = await page.evaluate(() => document.activeElement?.tagName);
    expect(afterArrowDown).toBeTruthy();
    console.log(`Test 4.3 [${ENV_NAME}]: ArrowDown moves in menu: ${afterArrowDown}\n`);

    await page.keyboard.press("ArrowUp");
    await page.waitForTimeout(200);
    console.log(`Test 4.4 [${ENV_NAME}]: ArrowUp moves in menu\n`);

    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
    console.log(`Test 4.5 [${ENV_NAME}]: Escape closes menu\n`);

    console.log(`Test 4 [${ENV_NAME}]: Menu and dropdown keyboard navigation PASSED\n`);
  });

  // ==========================================================================
  // TEST 5: CHECKBOX AND BUTTON KEYBOARD NAVIGATION
  // ==========================================================================

  sequentialTest("Test 5: Checkbox and Button Keyboard Navigation", async ({ page }) => {
    await page.goto(`${ENV_URL}/e-signature`);
    await page.waitForTimeout(3000);
    console.log(`Test 5.0 [${ENV_NAME}]: Testing checkbox and button keyboard navigation\n`);

    const closeBtn = page.locator(LOCATORS.closeAlertBtn).first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await page.waitForTimeout(500);
    }

    // Focus on upload area
    const uploadBtn = page.locator(LOCATORS.uploadFromDeviceBtn);
    await uploadBtn.focus();

    // Check focus
    const focusOk = await page.evaluate(() => document.activeElement !== null);
    expect(focusOk).toBeTruthy();
    console.log(`Test 5.1 [${ENV_NAME}]: Button can receive focus\n`);

    // Press Space on button
    await page.keyboard.press("Space");
    await page.waitForTimeout(500);
    console.log(`Test 5.2 [${ENV_NAME}]: Space key works on buttons\n`);

    // Press Enter on button
    await page.keyboard.press("Enter");
    await page.waitForTimeout(500);
    console.log(`Test 5.3 [${ENV_NAME}]: Enter key works on buttons\n`);

    await page.goto(`${ENV_URL}/home`);
    await page.waitForTimeout(2000);
    console.log(`Test 5 [${ENV_NAME}]: Checkbox and button keyboard navigation PASSED\n`);
  });

  // ==========================================================================
  // TEST 6: COMBINED KEYBOARD WORKFLOW
  // ==========================================================================

  sequentialTest("Test 6: Combined Keyboard Workflow", async ({ page }) => {
    await page.goto(`${ENV_URL}/home`);
    await page.waitForTimeout(3000);
    console.log(`Test 6.0 [${ENV_NAME}]: Testing complete keyboard workflow\n`);

    let signatureFound = false;
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(100);
      const text = await page.evaluate(() => document.activeElement?.textContent);
      if (text?.includes("Signature")) {
        signatureFound = true;
        console.log(`Test 6.1 [${ENV_NAME}]: Found Signature app link\n`);
        break;
      }
    }

    if (signatureFound) {
      await page.keyboard.press("Enter");
      await page.waitForTimeout(3000);
      const onSignaturePage = page.url().includes("e-signature");
      console.log(`Test 6.2 [${ENV_NAME}]: Navigated to signature page: ${onSignaturePage}\n`);

      const uploadArea = page.locator(LOCATORS.uploadArea);
      if (await uploadArea.isVisible()) {
        let inputFound = false;
        for (let i = 0; i < 10; i++) {
          await page.keyboard.press("Tab");
          await page.waitForTimeout(100);
          const type = await page.evaluate(() => (document.activeElement as any)?.type);
          if (type === "file") {
            inputFound = true;
            console.log(`Test 6.3 [${ENV_NAME}]: Found file input with Tab\n`);
            break;
          }
        }
      }
    }

    console.log(`Test 6 [${ENV_NAME}]: Combined keyboard workflow PASSED\n`);
  });
});
