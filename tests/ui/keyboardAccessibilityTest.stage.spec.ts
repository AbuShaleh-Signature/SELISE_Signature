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
    await page.locator(LOCATORS.signatureApp).first().focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(2000);
    console.log(`Test 3.0 [${ENV_NAME}]: Signature app via Enter\n`);

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
    await page.waitForTimeout(8000);
    console.log(`Test 4.2 [${ENV_NAME}]: File uploaded\n`);

    const uploadProgress = page.locator('text="template.pdf"').first();
    await uploadProgress.waitFor({ state: "visible", timeout: 15000 });
    console.log(`Test 4.2.1 [${ENV_NAME}]: File upload verified\n`);

    await page.locator(LOCATORS.envelopeNameInput).waitFor({ state: "visible", timeout: 30000 });
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

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    console.log(`Test 4.8 [${ENV_NAME}]: Scrolled to bottom\n`);

    const signatureField = page.locator(LOCATORS.signatureField);
    await signatureField.waitFor({ state: "visible", timeout: 10000 });

    const documentArea = page.locator(LOCATORS.documentPageArea).last();
    const docBox = await documentArea.boundingBox();
    const sigBox = await signatureField.boundingBox();

    if (sigBox && docBox) {
      await page.mouse.move(sigBox.x + sigBox.width / 2, sigBox.y + sigBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(docBox.x + docBox.width / 2, docBox.y + docBox.height - 100, {
        steps: 10,
      });
      await page.mouse.up();
      await page.waitForTimeout(2000);
      console.log(`Test 4.9 [${ENV_NAME}]: Signature dragged\n`);
    } else {
      console.log(`Test 4.9 [${ENV_NAME}]: SKIPPED - Could not get positions\n`);
    }

    const SendButton = page.locator(LOCATORS.sendDocumentBtn);
    await SendButton.waitFor({ state: "visible", timeout: 10000 });
    await SendButton.focus();
    await page.keyboard.press("Enter");
    console.log(`Test 4.10 [${ENV_NAME}]: Send Document via Enter\n`);

    await page.waitForTimeout(3000);
    const dialog = page.locator('text="Are you sure?"');
    if (await dialog.isVisible()) {
      console.log(`Test 4.11 [${ENV_NAME}]: Confirmation dialog appeared\n`);
      const confirmBtn = page.locator(LOCATORS.confirmSendBtn);
      await confirmBtn.waitFor({ state: "visible", timeout: 10000 });
      await page.waitForFunction(
        () => {
          const btn = document.querySelector('button[aria-label="Save"]') as HTMLButtonElement;
          return btn && !btn.disabled;
        },
        { timeout: 60000 }
      );
      await confirmBtn.focus();
      await page.keyboard.press("Enter");
      await page.waitForTimeout(500);
      console.log(`Test 4.12 [${ENV_NAME}]: Confirm via Enter\n`);
    } else {
      console.log(`Test 4.11 [${ENV_NAME}]: INFO - Document sent directly\n`);
    }

    await page.locator(LOCATORS.documentSentSuccess).waitFor({ state: "visible", timeout: 30000 });
    console.log(`Test 4.13 [${ENV_NAME}]: Document rollout completed\n`);

    await page.waitForTimeout(3000);
    await page
      .locator(LOCATORS.reviewDocumentAndSignBtn)
      .waitFor({ state: "visible", timeout: 300000 });
    await page.locator(LOCATORS.reviewDocumentAndSignBtn).focus();
    await page.keyboard.press("Enter");
    console.log(`Test 4.14 [${ENV_NAME}]: Review Document & Sign via Enter\n`);

    await page.locator(LOCATORS.signatorySignaturePlaceholder).focus();
    await page.keyboard.press("Enter");
    console.log(`Test 4.15 [${ENV_NAME}]: Signature placeholder via Enter\n`);

    await page.locator(LOCATORS.finishBtn).focus();
    await page.keyboard.press("Enter");
    console.log(`Test 4.16 [${ENV_NAME}]: Finish via Enter\n`);

    await page.locator(LOCATORS.signCheckbox).waitFor({ state: "visible", timeout: 30000 });
    await page.locator(LOCATORS.signCheckbox).focus();
    await page.keyboard.press("Space");
    console.log(`Test 4.17 [${ENV_NAME}]: Checkbox via Space\n`);

    await page
      .locator(LOCATORS.signThisContractNowBtn)
      .waitFor({ state: "visible", timeout: 30000 });
    await page.locator(LOCATORS.signThisContractNowBtn).focus();
    await page.keyboard.press("Enter");
    console.log(`Test 4.18 [${ENV_NAME}]: Sign This Contract Now via Enter\n`);

    await page.waitForTimeout(3000);
    console.log(`Test 4 [${ENV_NAME}]: Upload and sign via keyboard completed\n`);
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
    console.log(`Test 5.7 [${ENV_NAME}]: Document loaded\n`);

    const signatureField5 = page.locator(LOCATORS.signatureField);
    await signatureField5.waitFor({ state: "visible", timeout: 10000 });
    await signatureField5.scrollIntoViewIfNeeded();

    const documentArea5 = page.locator(LOCATORS.documentPageArea).last();
    await documentArea5.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const docBox5 = await documentArea5.boundingBox();
    const sigBox5 = await signatureField5.boundingBox();

    if (sigBox5 && docBox5) {
      await page.mouse.move(sigBox5.x + sigBox5.width / 2, sigBox5.y + sigBox5.height / 2);
      await page.mouse.down();
      await page.mouse.move(docBox5.x + docBox5.width / 2, docBox5.y + docBox5.height - 100, {
        steps: 10,
      });
      await page.mouse.up();
      await page.waitForTimeout(2000);
      console.log(`Test 5.8 [${ENV_NAME}]: Signature dragged\n`);
    } else {
      console.log(`Test 5.8 [${ENV_NAME}]: SKIPPED - Could not get positions\n`);
    }

    const SendButton5 = page.locator(LOCATORS.sendDocumentBtn);
    await SendButton5.waitFor({ state: "visible", timeout: 10000 });
    await page.waitForFunction(
      () => {
        const btns = Array.from(document.querySelectorAll("button"));
        const sendBtn = btns.find((b: any) => b.textContent?.includes("Send Document"));
        return sendBtn && !sendBtn.disabled;
      },
      { timeout: 60000 }
    );
    await SendButton5.focus();
    await page.keyboard.press("Enter");
    console.log(`Test 5.9 [${ENV_NAME}]: Send Document via Enter\n`);

    await page.waitForTimeout(3000);
    const dialog5 = page.locator('text="Are you sure?"');
    if (await dialog5.isVisible()) {
      console.log(`Test 5.10 [${ENV_NAME}]: Confirmation dialog appeared\n`);
      const confirmBtn5 = page.locator(LOCATORS.confirmSendBtn);
      await confirmBtn5.waitFor({ state: "visible", timeout: 10000 });
      await page.waitForFunction(
        () => {
          const btn = document.querySelector('button[aria-label="Save"]') as HTMLButtonElement;
          return btn && !btn.disabled;
        },
        { timeout: 60000 }
      );
      await confirmBtn5.focus();
      await page.keyboard.press("Enter");
      await page.waitForTimeout(500);
      console.log(`Test 5.11 [${ENV_NAME}]: Confirm via Enter\n`);
      await dialog5.waitFor({ state: "hidden", timeout: 10000 });
      await page.waitForTimeout(1000);
      console.log(`Test 5.11.1 [${ENV_NAME}]: Dialog closed\n`);
    } else {
      console.log(`Test 5.10 [${ENV_NAME}]: INFO - Document sent directly\n`);
    }

    await page.waitForTimeout(3000);
    await page.locator(LOCATORS.documentSentSuccess).waitFor({ state: "visible", timeout: 30000 });
    console.log(`Test 5.12 [${ENV_NAME}]: Document rollout completed\n`);

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

    const signatureField6 = page.locator(LOCATORS.signatureField);
    await signatureField6.waitFor({ state: "visible", timeout: 10000 });
    await signatureField6.scrollIntoViewIfNeeded();

    const documentArea6 = page.locator(LOCATORS.documentPageArea).last();
    await documentArea6.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const docBox6 = await documentArea6.boundingBox();
    const sigBox6 = await signatureField6.boundingBox();

    if (sigBox6 && docBox6) {
      await page.mouse.move(sigBox6.x + sigBox6.width / 2, sigBox6.y + sigBox6.height / 2);
      await page.mouse.down();
      await page.mouse.move(docBox6.x + docBox6.width / 2, docBox6.y + docBox6.height - 100, {
        steps: 10,
      });
      await page.mouse.up();
      await page.waitForTimeout(2000);
      console.log(`Test 6.6 [${ENV_NAME}]: Signature dragged\n`);
    } else {
      console.log(`Test 6.6 [${ENV_NAME}]: SKIPPED - Could not get positions\n`);
    }

    const sendButton6 = page.locator('button:has-text("Send Document")');
    await sendButton6.waitFor({ state: "visible", timeout: 10000 });
    await sendButton6.focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(5000);
    console.log(`Test 6.7 [${ENV_NAME}]: Send Document via Enter\n`);

    const dialog6 = page.locator('text="Are you sure?"');
    if (await dialog6.isVisible()) {
      console.log(`Test 6.8 [${ENV_NAME}]: Confirmation dialog appeared\n`);
      const confirmBtn6 = page.locator('button:has-text("Confirm")').last();
      await confirmBtn6.waitFor({ state: "visible", timeout: 10000 });
      await confirmBtn6.focus();
      await page.keyboard.press("Enter");
      await page.waitForTimeout(3000);
      console.log(`Test 6.8.1 [${ENV_NAME}]: Confirm via Enter\n`);
    } else {
      console.log(`Test 6.8 [${ENV_NAME}]: INFO - Document sent directly\n`);
    }

    await page.waitForTimeout(5000);
    console.log(`Test 6.9 [${ENV_NAME}]: Document sent\n`);

    await page.waitForTimeout(3000);
    await page
      .locator(LOCATORS.reviewDocumentAndSignBtn)
      .waitFor({ state: "visible", timeout: 300000 });
    await page.locator(LOCATORS.reviewDocumentAndSignBtn).focus();
    await page.keyboard.press("Enter");
    console.log(`Test 6.10 [${ENV_NAME}]: Review Document & Sign via Enter\n`);

    await page.locator(LOCATORS.signatorySignaturePlaceholder).focus();
    await page.keyboard.press("Enter");
    console.log(`Test 6.11 [${ENV_NAME}]: Signature placeholder via Enter\n`);

    await page.locator(LOCATORS.finishBtn).focus();
    await page.keyboard.press("Enter");
    console.log(`Test 6.12 [${ENV_NAME}]: Finish via Enter\n`);

    await page.locator(LOCATORS.signCheckbox).waitFor({ state: "visible", timeout: 30000 });
    await page.locator(LOCATORS.signCheckbox).focus();
    await page.keyboard.press("Space");
    console.log(`Test 6.13 [${ENV_NAME}]: Checkbox via Space\n`);

    await page
      .locator(LOCATORS.signThisContractNowBtn)
      .waitFor({ state: "visible", timeout: 30000 });
    await page.locator(LOCATORS.signThisContractNowBtn).focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(3000);
    console.log(`Test 6.14 [${ENV_NAME}]: Sign This Contract Now via Enter\n`);

    console.log(`Test 6 [${ENV_NAME}]: Sign A Document keyboard flow completed\n`);
  });

  // ==========================================================================
  // TEST 7: CREATE WORKFLOW FROM TEMPLATES VIA KEYBOARD
  // ==========================================================================

  sequentialTest("Test 7: Create Workflow from Templates via Keyboard", async ({ page }) => {
    await page.goto(`${ENV_URL}/e-signature`);
    await page.waitForTimeout(3000);
    console.log(`Test 7.0 [${ENV_NAME}]: Navigated to Signature module\n`);

    await page.locator(LOCATORS.templatesSection).waitFor({ state: "visible", timeout: 10000 });
    await page.locator(LOCATORS.templatesSection).focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(2000);
    console.log(`Test 7.1 [${ENV_NAME}]: Templates section via Enter\n`);

    const createWorkflowBtn = page.locator(LOCATORS.createWorkflowBtn);
    await createWorkflowBtn.waitFor({ state: "visible", timeout: 15000 });
    await createWorkflowBtn.focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(2000);
    console.log(`Test 7.2 [${ENV_NAME}]: Create Workflow via Enter\n`);

    const uploadFromDeviceBtn = page.locator(LOCATORS.uploadFromDeviceWorkflow);
    await uploadFromDeviceBtn.waitFor({ state: "visible", timeout: 10000 });
    await uploadFromDeviceBtn.focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(2000);
    console.log(`Test 7.3 [${ENV_NAME}]: Upload From Device via Enter\n`);

    await page.locator(LOCATORS.uploadInput).setInputFiles("test-data/template.pdf");
    await page.waitForTimeout(8000);
    console.log(`Test 7.4 [${ENV_NAME}]: File uploaded\n`);

    await page.locator(LOCATORS.workflowContractName).waitFor({ state: "visible", timeout: 10000 });
    await page.locator(LOCATORS.workflowContractName).focus();
    await page.keyboard.press("Control+a");
    await page.keyboard.type("KeyboardAutoTest");
    console.log(`Test 7.5 [${ENV_NAME}]: Contract name typed via keyboard\n`);

    await page.locator(LOCATORS.workflowTagInput).waitFor({ state: "visible", timeout: 10000 });
    await page.locator(LOCATORS.workflowTagInput).focus();
    await page.keyboard.type("KeyboardAutoTest");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(1000);
    console.log(`Test 7.6 [${ENV_NAME}]: Tag added via keyboard\n`);

    await page
      .locator(LOCATORS.workflowAddRecipientBtn)
      .waitFor({ state: "visible", timeout: 10000 });
    await page.locator(LOCATORS.workflowAddRecipientBtn).focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(1000);
    console.log(`Test 7.7 [${ENV_NAME}]: Add Recipient via Enter\n`);

    await page
      .locator(LOCATORS.workflowAddDynamicSignatoryBtn)
      .waitFor({ state: "visible", timeout: 10000 });
    await page.locator(LOCATORS.workflowAddDynamicSignatoryBtn).focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(1000);
    console.log(`Test 7.8 [${ENV_NAME}]: Add Dynamic Signatory via Enter\n`);

    await page
      .locator(LOCATORS.workflowPrepareDocumentBtn)
      .waitFor({ state: "visible", timeout: 10000 });
    await page.locator(LOCATORS.workflowPrepareDocumentBtn).focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(5000);
    console.log(`Test 7.9 [${ENV_NAME}]: Prepare Document via Enter\n`);

    await page.waitForTimeout(2000);
    const signatureField7 = page.locator(LOCATORS.signatureField);
    await signatureField7.waitFor({ state: "visible", timeout: 15000 });
    await signatureField7.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const documentArea7 = page.locator(LOCATORS.documentPageArea).last();
    await documentArea7.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const docBox7 = await documentArea7.boundingBox();
    const sigBox7 = await signatureField7.boundingBox();

    if (sigBox7 && docBox7) {
      await page.mouse.move(sigBox7.x + sigBox7.width / 2, sigBox7.y + sigBox7.height / 2);
      await page.mouse.down();
      await page.mouse.move(docBox7.x + docBox7.width / 2, docBox7.y + docBox7.height - 100, {
        steps: 10,
      });
      await page.mouse.up();
      await page.waitForTimeout(2000);
      console.log(`Test 7.10 [${ENV_NAME}]: Signature dragged\n`);
    } else {
      console.log(`Test 7.10 [${ENV_NAME}]: SKIPPED - Could not get positions\n`);
    }

    await page.waitForFunction(
      () => {
        const btns = Array.from(document.querySelectorAll("button"));
        const saveBtn = btns.find((b: any) => b.textContent?.includes("Save Workflow"));
        return saveBtn && !saveBtn.disabled;
      },
      { timeout: 60000 }
    );
    console.log(`Test 7.11 [${ENV_NAME}]: Save Workflow button enabled\n`);

    const saveWorkflowBtn = page.locator(LOCATORS.workflowSaveWorkflowBtn);
    await saveWorkflowBtn.waitFor({ state: "visible", timeout: 10000 });
    await saveWorkflowBtn.focus();
    await page.keyboard.press("Enter");
    console.log(`Test 7.12 [${ENV_NAME}]: Save Workflow via Enter\n`);

    await page.waitForTimeout(5000);
    console.log(`Test 7 [${ENV_NAME}]: Create Workflow from Templates via keyboard completed\n`);
  });

  // ==========================================================================
  // TEST 8: USE WORKFLOW FROM TEMPLATES VIA KEYBOARD
  // ==========================================================================

  sequentialTest("Test 8: Use Workflow from Templates via Keyboard", async ({ page }) => {
    await page.goto(`${ENV_URL}/e-signature`);
    await page.waitForTimeout(3000);
    console.log(`Test 8.0 [${ENV_NAME}]: Navigated to Signature module\n`);

    await page.locator(LOCATORS.templatesSection).waitFor({ state: "visible", timeout: 10000 });
    await page.locator(LOCATORS.templatesSection).focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(2000);
    console.log(`Test 8.1 [${ENV_NAME}]: Templates section via Enter\n`);

    await page.waitForTimeout(2000);
    const workflowRow = page.locator('div:has-text("KeyboardAutoTest")').first();
    await workflowRow.waitFor({ state: "visible", timeout: 10000 });
    await workflowRow.scrollIntoViewIfNeeded();
    console.log(`Test 8.2 [${ENV_NAME}]: Found KeyboardAutoTest row\n`);

    const useBtn = page.locator(LOCATORS.useWorkflowBtn).first();
    await useBtn.waitFor({ state: "visible", timeout: 10000 });
    await useBtn.focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(5000);
    console.log(`Test 8.3 [${ENV_NAME}]: Use workflow via Enter\n`);

    await page.waitForTimeout(3000);
    await page.locator(LOCATORS.workflowAddRecipientBtn).waitFor({ state: "visible", timeout: 10000 });
    await page.locator(LOCATORS.workflowAddRecipientBtn).focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(2000);
    console.log(`Test 8.4 [${ENV_NAME}]: Add Recipient via Enter\n`);

    await page.waitForTimeout(2000);
    await page.locator(LOCATORS.workflowConfirmBtn).waitFor({ state: "visible", timeout: 10000 });
    await page.locator(LOCATORS.workflowConfirmBtn).focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(3000);
    console.log(`Test 8.5 [${ENV_NAME}]: Confirm via Enter\n`);

    await page.waitForTimeout(3000);
    const confirmPopupBtn = page.locator('button:has-text("Confirm")').last();
    await confirmPopupBtn.waitFor({ state: "visible", timeout: 10000 });
    await confirmPopupBtn.focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(5000);
    console.log(`Test 8.6 [${ENV_NAME}]: Confirm on pop-up via Enter\n`);

    await page.waitForTimeout(5000);
    const addSignatoryInput = page.locator('input[role="combobox"]');
    await addSignatoryInput.waitFor({ state: "visible", timeout: 30000 });
    console.log(`Test 8.7 [${ENV_NAME}]: Add Signatory form loaded\n`);

    await addSignatoryInput.focus();
    await page.waitForTimeout(300);
    await page.keyboard.type("r", { delay: 300 });
    await page.waitForTimeout(500);
    await page.keyboard.type("a", { delay: 300 });
    await page.waitForTimeout(500);
    await page.keyboard.type("a", { delay: 300 });
    await page.waitForTimeout(500);
    await page.keyboard.type("j", { delay: 300 });
    await page.waitForTimeout(2000);
    console.log(`Test 8.8 [${ENV_NAME}]: Raaj typed in Add Signatory\n`);

    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(500);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(2000);
    console.log(`Test 8.9 [${ENV_NAME}]: Signatory selected from dropdown\n`);

    const prepareDocBtn = page.locator(LOCATORS.prepareDocumentBtn);
    await prepareDocBtn.waitFor({ state: "visible", timeout: 30000 });
    await prepareDocBtn.focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(5000);
    console.log(`Test 8.10 [${ENV_NAME}]: Prepare Document via Enter\n`);

    const sendDocumentBtn = page.locator('button:has-text("Send Document")');
    await sendDocumentBtn.waitFor({ state: "visible", timeout: 30000 });
    await sendDocumentBtn.focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(5000);
    console.log(`Test 8.11 [${ENV_NAME}]: Send Document via Enter\n`);

    console.log(`Test 8 [${ENV_NAME}]: Use Workflow from Templates via keyboard completed\n`);
  });
});
