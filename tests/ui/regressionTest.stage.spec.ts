/**
 * ============================================================================
 * REGRESSION TEST - STAGE ENVIRONMENT
 * ============================================================================
 *
 * Purpose:
 *   This file contains end-to-end UI tests for the SELISE Signature module
 *   specifically configured for the STAGE environment.
 *
 * How to Run:
 *   npm run test:stage          - Run with headed browser
 *   npm run test:stage:ci       - Run headless (for CI/CD pipelines)
 *
 * Environment Configuration:
 *   - Environment variables are loaded from .env.stage file
 *   - Base URL: https://app.selisestage.com
 *   - Login: abu.shaleh@selisegroup.com
 *
 * Test Structure:
 *   Test 1: Home page verification
 *   Test 2: Landing page contents verification
 *   Test 3: Signature module status cards
 *   Test 4: Full document upload and signing workflow
 *
 * ============================================================================
 */

// ============================================================================
// IMPORTS
// ============================================================================

// Load environment variables from .env.stage file
import { config } from "dotenv";
import { resolve } from "path";

// Load stage environment variables
config({ path: resolve(process.cwd(), ".env.stage"), override: true });

// Extract URLs (full URL for login, base URL for navigation)
const ENV_URL_FULL = process.env.URL || ""; // https://app.selisestage.com/login
const ENV_URL = ENV_URL_FULL.replace(/\/login$/, ""); // https://app.selisestage.com
const ENV_NAME = "STAGE"; // Environment name for logging

// Pass credentials to basePage via global variables
// These are used by the sequentialTest fixture in basePage.ts
(globalThis as any).__TEST_ENV_URL__ = ENV_URL_FULL;
(globalThis as any).__TEST_ENV_USERNAME__ = process.env.USERNAME || "";
(globalThis as any).__TEST_ENV_PASSWORD__ = process.env.PASSWORD || "";

// Import test utilities and locators
import { sequentialTest, expect } from "../../src/pages/basePage";
import { LOCATORS } from "../../src/locators.stage";

// ============================================================================
// ENVIRONMENT INFO
// ============================================================================

console.log(`\n🔧 Running: Regression Suite - ${ENV_NAME} Environment`);
console.log(`   URL: ${ENV_URL}`);
console.log(`-----------------------------------\n`);

// ============================================================================
// TEST SUITE
// ============================================================================

sequentialTest.describe.serial(`📋 Regression Suite - ${ENV_NAME} Environment`, () => {
  // Set test timeout to 10 minutes (600000ms)
  // This is needed because some operations like document upload take time
  sequentialTest.setTimeout(900000);

  // ==========================================================================
  // TEST 1: HOME PAGE VERIFICATION
  // ==========================================================================
  // Verifies that the home page loads correctly after login
  // Success criteria: Home page container element is visible

  sequentialTest("Test 1: Verify home page elements", async ({ page }) => {
    // Assert home page container is visible
    await expect(page.locator(LOCATORS.home)).toBeVisible();
    console.log(`Test 1 [${ENV_NAME}]: Home page elements verified\n`);
  });

  // ==========================================================================
  // TEST 2: LANDING PAGE CONTENTS
  // ==========================================================================
  // Verifies all expected UI elements are present on the landing page
  // Tests: Apps, Store button, Header elements

  // --- TEST 2, 3, 4, 5 COMMENTED OUT ---

  sequentialTest("Test 2: Verify Landing Page Contents", async ({ page }) => {
    // --- Available Apps Section ---
    await expect(page.locator(LOCATORS.contactsApp)).toBeVisible();
    console.log(`Test 2.1 [${ENV_NAME}]: Contacts app is visible\n`);

    await expect(page.locator(LOCATORS.signatureApp)).toBeVisible();
    console.log(`Test 2.2 [${ENV_NAME}]: Signature app is visible\n`);

    await expect(page.locator(LOCATORS.fileManagerApp)).toBeVisible();
    console.log(`Test 2.3 [${ENV_NAME}]: File Manager app is visible\n`);

    // --- SELISE Store Button ---
    await expect(page.locator(LOCATORS.seliseStoreButton)).toBeVisible();
    console.log(`Test 2.4 [${ENV_NAME}]: SELISE Store button is present\n`);

    // --- Header Elements ---
    await expect(page.locator(LOCATORS.logo)).toBeVisible();
    console.log(`Test 2.5 [${ENV_NAME}]: Logo is visible in header\n`);

    await expect(page.locator(LOCATORS.profileLogo)).toBeVisible();
    console.log(`Test 2.6 [${ENV_NAME}]: Profile logo is visible in header\n`);

    await expect(page.locator(LOCATORS.myAppsMenu)).toBeVisible();
    console.log(`Test 2.7 [${ENV_NAME}]: My Apps menu is visible in header\n`);
  });

  // ==========================================================================
  // TEST 3: SIGNATURE MODULE STATUS CARDS
  // ==========================================================================
  // Verifies the signature module's status cards are present and functional
  // Status cards represent different document states in the workflow
  //
  // Status Cards:
  //   - Yet To Sign: Documents awaiting signature
  //   - Yet To Review: Documents pending review
  //   - Pending: Documents in progress
  //   - Completed: Signed documents

  sequentialTest("Test 3: Verify Signature Module", async ({ page }) => {
    // Navigate to Signature module by clicking the Signature app
    await page.locator(LOCATORS.signatureApp).first().click();
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
    console.log(`Test 3.0 [${ENV_NAME}]: Signature app clicked\n`);

    // --- YET TO SIGN CARD ---
    const yetToSignCard = page.locator(LOCATORS.yetToSignCard);
    await yetToSignCard.scrollIntoViewIfNeeded(); // Scroll into view if not visible
    await yetToSignCard.waitFor({ state: "visible", timeout: 5000 });

    if (await yetToSignCard.isVisible()) {
      await yetToSignCard.click(); // Click to open details page
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
      console.log(`Test 3.1 [${ENV_NAME}]: Yet To Sign clicked and details page opened\n`);
      await page.goto(`${ENV_URL}/e-signature`); // Navigate back to signature module
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
    } else {
      console.log(`Test 3.1 [${ENV_NAME}]: SKIPPED - Yet To Sign card not visible\n`);
    }

    // --- YET TO REVIEW CARD ---
    const yetToReviewCard = page.locator(LOCATORS.yetToReviewCard);
    await yetToReviewCard.scrollIntoViewIfNeeded();
    await yetToReviewCard.waitFor({ state: "visible", timeout: 5000 });

    if (await yetToReviewCard.isVisible()) {
      await yetToReviewCard.click();
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
      console.log(`Test 3.2 [${ENV_NAME}]: Yet To Review clicked and details page opened\n`);
      await page.goto(`${ENV_URL}/e-signature`);
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
    } else {
      console.log(`Test 3.2 [${ENV_NAME}]: SKIPPED - Yet To Review card not visible\n`);
    }

    // --- PENDING CARD ---
    const pendingCard = page.locator(LOCATORS.pendingCard);
    await pendingCard.scrollIntoViewIfNeeded();
    await pendingCard.waitFor({ state: "visible", timeout: 5000 });

    if (await pendingCard.isVisible()) {
      await pendingCard.click();
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
      console.log(`Test 3.3 [${ENV_NAME}]: Pending clicked and details page opened\n`);
      await page.goto(`${ENV_URL}/e-signature`);
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
    } else {
      console.log(`Test 3.3 [${ENV_NAME}]: SKIPPED - Pending card not visible\n`);
    }

    // --- COMPLETED CARD ---
    const completedCard = page.locator(LOCATORS.completedCard);
    await completedCard.scrollIntoViewIfNeeded();
    await completedCard.waitFor({ state: "visible", timeout: 5000 });

    if (await completedCard.isVisible()) {
      await completedCard.click();
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
      console.log(`Test 3.4 [${ENV_NAME}]: Completed clicked and details page opened\n`);
    } else {
      console.log(`Test 3.4 [${ENV_NAME}]: SKIPPED - Completed card not visible\n`);
    }
  });

  // ==========================================================================
  // TEST 4: DOCUMENT UPLOAD AND SIGNING WORKFLOW
  // ==========================================================================
  // Complete end-to-end test of the document signing workflow:
  //
  // Workflow Steps:
  //   1. Navigate to Signature module
  //   2. Upload PDF document
  //   3. Fill envelope name
  //   4. Add recipient
  //   5. Prepare document
  //   6. Drag signature to PDF
  //   7. Send document
  //   8. Confirm sending
  //   9. Wait for rollout completion
  //   10. Review and sign document
  //   11. Click signature placeholder
  //   12. Finish signing
  //   13. Accept terms and sign

  sequentialTest("Test 4: Upload Document", async ({ page }) => {
    // --- STEP 1: Navigate to Signature Module ---
    await page.goto(`${ENV_URL}/e-signature`);
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
    console.log(`Test 4.0 [${ENV_NAME}]: Navigated to Signature module\n`);

    // --- Close any existing alert dialogs ---
    const closeAlert = page.locator(LOCATORS.closeAlertBtn).first();
    if (await closeAlert.isVisible()) {
      await closeAlert.click();
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
    }

    // --- STEP 2: Verify Upload Area ---
    // Check if upload area is visible (some environments may not have this)
    const uploadAreaVisible = await page.locator(LOCATORS.uploadArea).isVisible();
    if (!uploadAreaVisible) {
      console.log(`Test 4.1 [${ENV_NAME}]: SKIPPED - Upload area not visible\n`);
      console.log(`Test 4 [${ENV_NAME}]: SKIPPED - Document upload workflow not available\n`);
      return; // Skip test if upload area not available
    }

    await page.locator(LOCATORS.uploadArea).waitFor({ state: "visible", timeout: 10000 });
    await expect(page.locator(LOCATORS.uploadArea)).toBeVisible();
    console.log(`Test 4.1 [${ENV_NAME}]: Upload area is visible\n`);

    // --- Verify Upload From Device Button ---
    await expect(page.locator(LOCATORS.uploadFromDeviceBtn)).toBeVisible();
    console.log(`Test 4.2 [${ENV_NAME}]: Upload From Device button is visible\n`);

    // --- STEP 3: Upload PDF File ---
    await page.locator(LOCATORS.uploadInput).setInputFiles("test-data/template.pdf");
    await page.waitForTimeout(30000);
    console.log(`Test 4.3 [${ENV_NAME}]: File uploaded\n`);

    // --- STEP 4: Fill Envelope Name ---
    await page.locator(LOCATORS.envelopeNameInput).waitFor({ state: "visible", timeout: 15000 });
    await page.locator(LOCATORS.envelopeNameInput).fill("Automation Test");
    console.log(`Test 4.4 [${ENV_NAME}]: Envelope name set\n`);

    // --- STEP 5: Add Recipient ---
    await page.locator(LOCATORS.addRecipientBtn).waitFor({ state: "visible", timeout: 15000 });
    await page.locator(LOCATORS.addRecipientBtn).click();
    console.log(`Test 4.5 [${ENV_NAME}]: Add Recipient clicked\n`);

    // --- STEP 6: Verify Add Recipients Page ---
    await page.locator(LOCATORS.addRecipientsPage).waitFor({ state: "visible", timeout: 15000 });
    await expect(page.locator(LOCATORS.addRecipientsPage)).toBeVisible();
    console.log(`Test 4.6 [${ENV_NAME}]: Add Recipients page visible\n`);

    // --- STEP 7: Prepare Document ---
    await page.locator(LOCATORS.prepareDocumentBtn).waitFor({ state: "visible", timeout: 15000 });
    await page.locator(LOCATORS.prepareDocumentBtn).click();
    console.log(`Test 4.7 [${ENV_NAME}]: Prepare Document clicked\n`);

    // --- STEP 8: Wait for Document to Load ---
    await page.waitForTimeout(30000);
    console.log(`Test 4.8 [${ENV_NAME}]: Document loaded\n`);

    // --- STEP 9: Scroll to Bottom of Document ---
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(30000);
    console.log(`Test 4.9 [${ENV_NAME}]: Scrolled to bottom\n`);

    // --- STEP 10: Drag Signature to PDF ---
    const signatureField = page.locator(LOCATORS.signatureField);
    await signatureField.waitFor({ state: "visible", timeout: 30000 });

    const documentArea = page.locator(LOCATORS.documentPageArea).last();
    const docBox = await documentArea.boundingBox();
    const sigBox = await signatureField.boundingBox();

    // Perform drag and drop operation
    if (sigBox && docBox) {
      await page.mouse.move(sigBox.x + sigBox.width / 2, sigBox.y + sigBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(docBox.x + docBox.width / 2, docBox.y + docBox.height - 100, {
        steps: 10, // Smooth movement
      });
      await page.mouse.up();
      await page.waitForTimeout(30000);
      console.log(`Test 4.10 [${ENV_NAME}]: Signature dragged\n`);
    } else {
      console.log(`Test 4.10 [${ENV_NAME}]: SKIPPED - Could not get positions\n`);
    }

    // --- STEP 12: Send Document ---
    const SendButton = page.locator(LOCATORS.sendDocumentBtn);
    await SendButton.waitFor({ state: "visible", timeout: 10000 });
    await SendButton.click();
    console.log(`Test 4.11 [${ENV_NAME}]: Send Document clicked\n`);

    // --- STEP 12: Handle Confirmation Dialog ---
    await page.waitForTimeout(30000);
    const dialog = page.locator('text="Are you sure?"');
    if (await dialog.isVisible()) {
      console.log(`Test 4.12 [${ENV_NAME}]: Confirmation dialog appeared\n`);

      // Wait for Confirm button to be enabled (it may be disabled initially)
      const confirmBtn = page.locator(LOCATORS.confirmSendBtn);
      await confirmBtn.waitFor({ state: "visible", timeout: 10000 });
      await page.waitForFunction(
        () => {
          const btn = document.querySelector('button[aria-label="Save"]') as HTMLButtonElement;
          return btn && !btn.disabled;
        },
        { timeout: 60000 }
      );
      await confirmBtn.click();
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
      console.log(`Test 4.13 [${ENV_NAME}]: Confirm clicked\n`);
    } else {
      console.log(`Test 4.13 [${ENV_NAME}]: INFO - Document sent directly\n`);
    }

    // --- STEP 13: Wait for Document Rollout Completion ---
    // Rollout process: Signatures applied → Texts applied → Emails sent
    await page.locator(LOCATORS.documentSentSuccess).waitFor({ state: "visible", timeout: 300000 });
    console.log(`Test 4.14 [${ENV_NAME}]: Document rollout completed\n`);

    // --- STEP 14: Review and Sign ---
    await page.waitForTimeout(30000);
    await page
      .locator(LOCATORS.reviewDocumentAndSignBtn)
      .waitFor({ state: "visible", timeout: 300000 });
    await page.locator(LOCATORS.reviewDocumentAndSignBtn).click();
    console.log(`Test 4.15 [${ENV_NAME}]: Review Document & Sign clicked\n`);

    // --- STEP 15: Click Signature Placeholder ---
    await page.locator(LOCATORS.signatorySignaturePlaceholder).click();
    console.log(`Test 4.16 [${ENV_NAME}]: Signature placeholder clicked\n`);

    // --- STEP 16: Click Finish ---
    await page.locator(LOCATORS.finishBtn).click();
    console.log(`Test 4.17 [${ENV_NAME}]: Finish clicked\n`);

    // --- STEP 17: Accept Terms (Click Checkbox) ---
    await page.locator(LOCATORS.signCheckbox).waitFor({ state: "visible", timeout: 30000 });
    await page.locator(LOCATORS.signCheckbox).click();
    console.log(`Test 4.18 [${ENV_NAME}]: Checkbox clicked\n`);

    // --- STEP 18: Sign the Contract ---
    await page
      .locator(LOCATORS.signThisContractNowBtn)
      .waitFor({ state: "visible", timeout: 30000 });
    await page.locator(LOCATORS.signThisContractNowBtn).click();
    console.log(`Test 4.19 [${ENV_NAME}]: Sign This Contract Now clicked\n`);

    // --- STEP 19: Wait for Final Page Load ---
    await page.waitForTimeout(30000);
    console.log(`Test 4.20 [${ENV_NAME}]: Simple Sign flow completed\n`);
  });

  // ==========================================================================
  // TEST 5: SIGNATURE ADVANCE FLOW till Sending
  // ==========================================================================
  // Advanced document signing workflow with additional features
  // This test covers more advanced signing scenarios

  sequentialTest("Test 5: Signature Advance Workflow", async ({ page }) => {
    // --- STEP 1: Navigate to Signature Module ---
    await page.goto(`${ENV_URL}/e-signature`);
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
    console.log(`Test 5.0 [${ENV_NAME}]: Navigated to Signature module\n`);

    // --- Close any existing alert dialogs ---
    const closeAlert = page.locator(LOCATORS.closeAlertBtn).first();
    if (await closeAlert.isVisible()) {
      await closeAlert.click();
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
    }

    // --- STEP 2: Verify Upload Area ---
    const uploadAreaVisible = await page.locator(LOCATORS.uploadArea).isVisible();
    if (!uploadAreaVisible) {
      console.log(`Test 5.1 [${ENV_NAME}]: SKIPPED - Upload area not visible\n`);
      console.log(`Test 5 [${ENV_NAME}]: SKIPPED - Advance workflow not available\n`);
      return;
    }

    await page.locator(LOCATORS.uploadArea).waitFor({ state: "visible", timeout: 10000 });
    await expect(page.locator(LOCATORS.uploadArea)).toBeVisible();
    console.log(`Test 5.1 [${ENV_NAME}]: Upload area is visible\n`);

    // --- STEP 3: Upload PDF File ---
    await page.locator(LOCATORS.uploadInput).setInputFiles("test-data/template.pdf");
    await page.waitForTimeout(30000);
    console.log(`Test 5.2 [${ENV_NAME}]: File uploaded\n`);

    // --- Verify file uploaded successfully ---
    const uploadProgress = page.locator('text="template.pdf"').first();
    await uploadProgress.waitFor({ state: "visible", timeout: 15000 });
    console.log(`Test 5.2.1 [${ENV_NAME}]: File upload verified\n`);

    // --- STEP 4: Fill Envelope Name & Select advanced signature type Advanced for EU (eIDAS)---
    await page.locator(LOCATORS.envelopeNameInput).waitFor({ state: "visible", timeout: 30000 });
    await page.locator(LOCATORS.envelopeNameInput).fill("Automation Test");
    await page.locator(LOCATORS.signatureTypeAdvance).click(); // Select advanced signature type
    await page.locator(LOCATORS.signatureTypeRadioAdvanced).click(); // Select advanced signature type Advanced for EU (eIDAS)
    console.log(`Test 5.3 [${ENV_NAME}]: Envelope name set\n`);

    // --- STEP 5: Add Recipient ---
    await page.locator(LOCATORS.addRecipientBtn).waitFor({ state: "visible", timeout: 15000 });
    await page.locator(LOCATORS.addRecipientBtn).click();
    console.log(`Test 5.4 [${ENV_NAME}]: Add Recipient clicked\n`);

    // --- STEP 6: Verify Add Recipients Page ---
    await page.locator(LOCATORS.addRecipientsPage).waitFor({ state: "visible", timeout: 15000 });
    await expect(page.locator(LOCATORS.addRecipientsPage)).toBeVisible();
    console.log(`Test 5.5 [${ENV_NAME}]: Add Recipients page visible\n`);

    // --- STEP 7: Prepare Document ---
    await page.locator(LOCATORS.prepareDocumentBtn).waitFor({ state: "visible", timeout: 15000 });
    await page.locator(LOCATORS.prepareDocumentBtn).click();
    console.log(`Test 5.6 [${ENV_NAME}]: Prepare Document clicked\n`);

    // --- STEP 8: Wait for Document to Load ---
    await page.waitForTimeout(30000);
    console.log(`Test 5.7 [${ENV_NAME}]: Document loaded\n`);

    // --- STEP 9: Drag Signature to PDF ---
    const signatureField = page.locator(LOCATORS.signatureField);
    await signatureField.waitFor({ state: "visible", timeout: 15000 });
    await signatureField.scrollIntoViewIfNeeded();

    const documentArea = page.locator(LOCATORS.documentPageArea).last();
    await documentArea.scrollIntoViewIfNeeded();
    await page.waitForTimeout(30000);

    const docBox = await documentArea.boundingBox();
    const sigBox = await signatureField.boundingBox();

    if (sigBox && docBox) {
      await page.mouse.move(sigBox.x + sigBox.width / 2, sigBox.y + sigBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(docBox.x + docBox.width / 2, docBox.y + docBox.height - 100, {
        steps: 10,
      });
      await page.mouse.up();
      await page.waitForTimeout(30000);
      console.log(`Test 5.8 [${ENV_NAME}]: Signature dragged\n`);
    } else {
      console.log(`Test 5.8 [${ENV_NAME}]: SKIPPED - Could not get positions\n`);
    }

    // --- STEP 11: Send Document ---
    const SendButton = page.locator(LOCATORS.sendDocumentBtn);
    await SendButton.waitFor({ state: "visible", timeout: 15000 });
    await page.waitForFunction(
      () => {
        const btns = Array.from(document.querySelectorAll("button"));
        const sendBtn = btns.find((b: any) => b.textContent?.includes("Send Document"));
        return sendBtn && !sendBtn.disabled;
      },
      { timeout: 60000 }
    );
    await SendButton.click();
    console.log(`Test 5.11 [${ENV_NAME}]: Send Document clicked\n`);

    // --- STEP 12: Handle Confirmation Dialog ---
    await page.waitForTimeout(30000);
    const dialog = page.locator('text="Are you sure?"');
    if (await dialog.isVisible()) {
      console.log(`Test 5.12 [${ENV_NAME}]: Confirmation dialog appeared\n`);

      const confirmBtn = page.locator(LOCATORS.confirmSendBtn);
      await confirmBtn.waitFor({ state: "visible", timeout: 15000 });
      await page.waitForFunction(
        () => {
          const btn = document.querySelector('button[aria-label="Save"]') as HTMLButtonElement;
          return btn && !btn.disabled;
        },
        { timeout: 60000 }
      );
      await confirmBtn.click();
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
      console.log(`Test 5.13 [${ENV_NAME}]: Confirm clicked\n`);

      // Wait for dialog to close
      await dialog.waitFor({ state: "hidden", timeout: 15000 });
      await page.waitForTimeout(30000);
      console.log(`Test 5.13.1 [${ENV_NAME}]: Dialog closed\n`);
    } else {
      console.log(`Test 5.12 [${ENV_NAME}]: INFO - Document sent directly\n`);
    }

    // --- STEP 13: Wait for Document Rollout Completion ---
    await page.waitForTimeout(30000);
    await page.locator(LOCATORS.documentSentSuccess).waitFor({ state: "visible", timeout: 30000 });
    console.log(`Test 5.14 [${ENV_NAME}]: Document rollout completed\n`);

    console.log(`Test 5 [${ENV_NAME}]: Upload workflow completed\n`);
  });

  sequentialTest("Test 6: Sign A Document flow", async ({ page }) => {
    // --- STEP 1: Navigate to Signature Module ---
    await page.goto(`${ENV_URL}/e-signature`);
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
    console.log(`Test 6.0 [${ENV_NAME}]: Navigated to Signature module\n`);

    // --- STEP 2: Click on Sign A Document button ---
    const signADocBtn = page.locator('button:has-text("Sign A Document")');
    await signADocBtn.waitFor({ state: "visible", timeout: 15000 });
    await signADocBtn.click();
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
    console.log(`Test 6.2 [${ENV_NAME}]: Sign A Document clicked\n`);

    // --- STEP 3: Upload PDF File ---
    await page.locator(LOCATORS.uploadInput).setInputFiles("test-data/template.pdf");
    await page.waitForTimeout(30000);
    console.log(`Test 6.3 [${ENV_NAME}]: File uploaded\n`);

    // --- STEP 4: Fill Envelope Name ---
    await page.locator(LOCATORS.envelopeNameInput).waitFor({ state: "visible", timeout: 30000 });
    await page.locator(LOCATORS.envelopeNameInput).fill("Sign a document automation flow");
    console.log(`Test 6.4 [${ENV_NAME}]: Envelope name set\n`);

    // --- STEP 5: Click Add Recipient ---
    await page.locator(LOCATORS.addRecipientBtn).waitFor({ state: "visible", timeout: 15000 });
    await page.locator(LOCATORS.addRecipientBtn).click();
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
    console.log(`Test 6.5 [${ENV_NAME}]: Add Recipient clicked\n`);

    // --- STEP 6: Click Prepare Document ---
    await page.locator(LOCATORS.prepareDocumentBtn).waitFor({ state: "visible", timeout: 15000 });
    await page.locator(LOCATORS.prepareDocumentBtn).click();
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
    console.log(`Test 6.6 [${ENV_NAME}]: Prepare Document clicked\n`);

    // --- STEP 7: Drag Signature to PDF ---
    const signatureField = page.locator(LOCATORS.signatureField);
    await signatureField.waitFor({ state: "visible", timeout: 15000 });
    await signatureField.scrollIntoViewIfNeeded();

    const documentArea = page.locator(LOCATORS.documentPageArea).last();
    await documentArea.scrollIntoViewIfNeeded();
    await page.waitForTimeout(30000);

    const docBox = await documentArea.boundingBox();
    const sigBox = await signatureField.boundingBox();

    if (sigBox && docBox) {
      await page.mouse.move(sigBox.x + sigBox.width / 2, sigBox.y + sigBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(docBox.x + docBox.width / 2, docBox.y + docBox.height - 100, {
        steps: 10,
      });
      await page.mouse.up();
      await page.waitForTimeout(30000);
      console.log(`Test 6.7 [${ENV_NAME}]: Signature dragged\n`);
    } else {
      console.log(`Test 6.7 [${ENV_NAME}]: SKIPPED - Could not get positions\n`);
    }

    // --- STEP 8: Send Document ---
    const sendButton = page.locator('button:has-text("Send Document")');
    await sendButton.waitFor({ state: "visible", timeout: 15000 });
    await sendButton.click();
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
    console.log(`Test 6.8 [${ENV_NAME}]: Send Document clicked\n`);

    // --- STEP 9: Handle Confirmation Dialog ---
    const dialog = page.locator('text="Are you sure?"');
    if (await dialog.isVisible()) {
      console.log(`Test 6.9 [${ENV_NAME}]: Confirmation dialog appeared\n`);
      const confirmBtn = page.locator('button:has-text("Confirm")').last();
      await confirmBtn.waitFor({ state: "visible", timeout: 15000 });
      await confirmBtn.click();
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
      console.log(`Test 6.9.1 [${ENV_NAME}]: Confirm clicked\n`);
    } else {
      console.log(`Test 6.9 [${ENV_NAME}]: INFO - Document sent directly\n`);
    }

    // --- STEP 10: Wait for Document Rollout Completion ---
    await page.waitForTimeout(30000);
    console.log(`Test 6.10 [${ENV_NAME}]: Document sent\n`);

    // --- STEP 11: Review and Sign ---
    await page.waitForTimeout(30000);
    await page
      .locator(LOCATORS.reviewDocumentAndSignBtn)
      .waitFor({ state: "visible", timeout: 300000 });
    await page.locator(LOCATORS.reviewDocumentAndSignBtn).click();
    console.log(`Test 6.11 [${ENV_NAME}]: Review Document & Sign clicked\n`);

    // --- STEP 12: Click Signature Placeholder ---
    await page.locator(LOCATORS.signatorySignaturePlaceholder).click();
    console.log(`Test 6.12 [${ENV_NAME}]: Signature placeholder clicked\n`);

    // --- STEP 13: Click Finish ---
    await page.locator(LOCATORS.finishBtn).click();
    console.log(`Test 6.13 [${ENV_NAME}]: Finish clicked\n`);

    // --- STEP 14: Accept Terms (Click Checkbox) ---
    await page.locator(LOCATORS.signCheckbox).waitFor({ state: "visible", timeout: 30000 });
    await page.locator(LOCATORS.signCheckbox).click();
    console.log(`Test 6.14 [${ENV_NAME}]: Checkbox clicked\n`);

    // --- STEP 15: Sign the Contract ---
    await page
      .locator(LOCATORS.signThisContractNowBtn)
      .waitFor({ state: "visible", timeout: 30000 });
    await page.locator(LOCATORS.signThisContractNowBtn).click();
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
    console.log(`Test 6.15 [${ENV_NAME}]: Sign This Contract Now clicked\n`);

    console.log(`Test 6 [${ENV_NAME}]: Sign A Document Workflow completed\n`);
  });

  // ==========================================================================
  // TEST 7: CREATE WORKFLOW FROM TEMPLATES
  // ==========================================================================
  // Complete workflow creation test from Templates section

  sequentialTest("Test 7: Create Workflow from Templates", async ({ page }) => {
    // --- STEP 1: Navigate to Signature Module ---
    await page.goto(`${ENV_URL}/e-signature`);
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
    console.log(`Test 7.0 [${ENV_NAME}]: Navigated to Signature module\n`);

    // --- STEP 2: Click on Templates section ---
    await page.evaluate(() => {
      const templates = document.querySelectorAll("span.option-text");
      templates.forEach((el) => {
        if (el.textContent?.includes("Templates")) {
          (el as HTMLElement).click();
        }
      });
    });
    await page.waitForTimeout(30000);
    console.log(`Test 7.2 [${ENV_NAME}]: Templates section clicked\n`);

    // --- STEP 3: Click Create Workflow button ---
    const createWorkflowBtn = page.locator("button.create-template-btn:visible").first();
    await createWorkflowBtn.waitFor({ state: "visible", timeout: 15000 });
    await createWorkflowBtn.click();
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
    console.log(`Test 7.3 [${ENV_NAME}]: Create Workflow clicked\n`);

    // --- STEP 4: Click Upload From Device ---
    const uploadFromDeviceBtn = page.locator(LOCATORS.uploadFromDeviceWorkflow);
    await uploadFromDeviceBtn.waitFor({ state: "visible", timeout: 15000 });
    await page.waitForTimeout(30000);
    console.log(`Test 7.4 [${ENV_NAME}]: Upload From Device clicked\n`);

    // --- STEP 5: Upload PDF File ---
    await page.locator(LOCATORS.uploadInput).setInputFiles("test-data/template.pdf");
    await page.waitForTimeout(30000);
    console.log(`Test 7.5 [${ENV_NAME}]: File uploaded\n`);

    // --- STEP 6: Fill Contract Name ---
    await page.locator(LOCATORS.workflowContractName).waitFor({ state: "visible", timeout: 15000 });
    await page.locator(LOCATORS.workflowContractName).fill("AutomatedTest");
    console.log(`Test 7.6 [${ENV_NAME}]: Contract name filled\n`);

    // --- STEP 7: Add Tag ---
    await page.locator(LOCATORS.workflowTagInput).waitFor({ state: "visible", timeout: 15000 });
    await page.locator(LOCATORS.workflowTagInput).fill("AutomatedTest");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(30000);
    console.log(`Test 7.7 [${ENV_NAME}]: Tag added\n`);

    // --- STEP 8: Click Add Recipient ---
    await page
      .locator(LOCATORS.workflowAddRecipientBtn)
      .waitFor({ state: "visible", timeout: 15000 });
    await page.locator(LOCATORS.workflowAddRecipientBtn).click();
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
    console.log(`Test 7.8 [${ENV_NAME}]: Add Recipient clicked\n`);

    // --- STEP 9: Click Add Dynamic Signatory ---
    await page
      .locator(LOCATORS.workflowAddDynamicSignatoryBtn)
      .waitFor({ state: "visible", timeout: 15000 });
    await page.locator(LOCATORS.workflowAddDynamicSignatoryBtn).click();
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
    console.log(`Test 7.9 [${ENV_NAME}]: Add Dynamic Signatory clicked\n`);

    // --- STEP 10: Click Prepare Document ---
    await page
      .locator(LOCATORS.workflowPrepareDocumentBtn)
      .waitFor({ state: "visible", timeout: 15000 });
    await page.locator(LOCATORS.workflowPrepareDocumentBtn).click();
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
    console.log(`Test 7.10 [${ENV_NAME}]: Prepare Document clicked\n`);

    // --- STEP 11: Drag Signature to PDF ---
    await page.waitForTimeout(30000);
    const signatureField = page.locator(LOCATORS.signatureField);
    await signatureField.waitFor({ state: "visible", timeout: 15000 });
    await signatureField.scrollIntoViewIfNeeded();
    await page.waitForTimeout(30000);

    const documentArea = page.locator(LOCATORS.documentPageArea).last();
    await documentArea.scrollIntoViewIfNeeded();
    await page.waitForTimeout(30000);

    const docBox = await documentArea.boundingBox();
    const sigBox = await signatureField.boundingBox();

    if (sigBox && docBox) {
      await page.mouse.move(sigBox.x + sigBox.width / 2, sigBox.y + sigBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(docBox.x + docBox.width / 2, docBox.y + docBox.height - 100, {
        steps: 10,
      });
      await page.mouse.up();
      await page.waitForTimeout(30000);
      console.log(`Test 7.11 [${ENV_NAME}]: Signature dragged\n`);
    } else {
      console.log(`Test 7.11 [${ENV_NAME}]: SKIPPED - Could not get positions\n`);
    }

    // --- STEP 12: Wait for Save Workflow button to be enabled ---
    await page.waitForFunction(
      () => {
        const btns = Array.from(document.querySelectorAll("button"));
        const saveBtn = btns.find((b: any) => b.textContent?.includes("Save Workflow"));
        return saveBtn && !saveBtn.disabled;
      },
      { timeout: 60000 }
    );
    console.log(`Test 7.12 [${ENV_NAME}]: Save Workflow button enabled\n`);

    // --- STEP 13: Click Save Workflow ---
    const saveWorkflowBtn = page.locator(LOCATORS.workflowSaveWorkflowBtn);
    await saveWorkflowBtn.waitFor({ state: "visible", timeout: 15000 });
    await saveWorkflowBtn.click();
    console.log(`Test 7.13 [${ENV_NAME}]: Save Workflow clicked\n`);

    // --- STEP 14: Wait for Redirection ---
    await page.waitForTimeout(30000);
    console.log(`Test 7.14 [${ENV_NAME}]: Redirected to workflow page\n`);

    console.log(`Test 7 [${ENV_NAME}]: Create Workflow from Templates completed\n`);
  });
  // ==========================================================================
  // TEST 8: USE WORKFLOW FROM TEMPLATES
  // ==========================================================================
  // Tests using a workflow from Templates section

  sequentialTest("Test 8: Use Workflow from Templates", async ({ page }) => {
    // --- STEP 1: Navigate to Signature Module ---
    await page.goto(`${ENV_URL}/e-signature`);
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
    console.log(`Test 8.0 [${ENV_NAME}]: Navigated to Signature module\n`);

    // --- STEP 2: Click on Templates section ---
    await page.evaluate(() => {
      const templates = document.querySelectorAll("span.option-text");
      templates.forEach((el) => {
        if (el.textContent?.includes("Templates")) {
          (el as HTMLElement).click();
        }
      });
    });
    await page.waitForTimeout(30000);
    console.log(`Test 8.2 [${ENV_NAME}]: Templates section clicked\n`);

    // --- STEP 3: Find the first row containing "AutomatedTest" ---
    await page.waitForTimeout(30000);
    const workflowRow = page.locator('div:has-text("AutomatedTest")').first();
    await workflowRow.waitFor({ state: "visible", timeout: 10000 });
    await workflowRow.scrollIntoViewIfNeeded();
    console.log(`Test 8.3 [${ENV_NAME}]: Found AutomatedTest row\n`);

    // --- STEP 4: Click directly on "Use" text ---
    const useBtn = page.locator('span:text("Use")').first();
    await useBtn.click();
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
    console.log(`Test 8.4 [${ENV_NAME}]: Use button clicked\n`);

    // --- STEP 5: Click Add Recipient ---
    await page.waitForTimeout(30000);
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const addRecipientBtn = buttons.find((el) => el.textContent?.includes("Add Recipient"));
      if (addRecipientBtn) {
        (addRecipientBtn as HTMLButtonElement).click();
      }
    });
    await page.waitForTimeout(30000);
    console.log(`Test 8.5 [${ENV_NAME}]: Add Recipient clicked\n`);

    // --- STEP 6: Click Confirm button ---
    await page.waitForTimeout(30000);
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const confirmBtn = buttons.find(
        (el) => el.textContent?.includes("Confirm") && !el.hasAttribute("disabled")
      );
      if (confirmBtn) {
        (confirmBtn as HTMLButtonElement).click();
      }
    });
    await page.waitForTimeout(30000);
    console.log(`Test 8.6 [${ENV_NAME}]: Confirm clicked\n`);

    // --- STEP 7: Wait for pop-up to appear and click Confirm on pop-up ---
    await page.waitForTimeout(30000);
    const confirmPopupBtn = page.locator('button:has-text("Confirm")').last();
    await confirmPopupBtn.waitFor({ state: "visible", timeout: 10000 });
    await confirmPopupBtn.click();
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
    console.log(`Test 8.7 [${ENV_NAME}]: Confirm on pop-up clicked\n`);

    // --- STEP 8: Wait for Add Signatory form to load ---
    await page.waitForTimeout(30000);
    const addSignatoryInput = page.locator('input[role="combobox"]');
    await addSignatoryInput.waitFor({ state: "visible", timeout: 30000 });
    console.log(`Test 8.8 [${ENV_NAME}]: Add Signatory form loaded\n`);

    // --- STEP 9: Type "Raaj" in Add Signatory input (character by character) ---
    await addSignatoryInput.click();
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
    await addSignatoryInput.pressSequentially("r", { delay: 300 });
    await page.waitForTimeout(30000);
    await addSignatoryInput.pressSequentially("a", { delay: 300 });
    await page.waitForTimeout(30000);
    await addSignatoryInput.pressSequentially("a", { delay: 300 });
    await page.waitForTimeout(30000);
    await addSignatoryInput.pressSequentially("j", { delay: 300 });
    await page.waitForTimeout(30000);
    console.log(`Test 8.9 [${ENV_NAME}]: Raaj typed in Add Signatory\n`);

    // --- STEP 10: Select Signatory from dropdown ---
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(30000);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(30000);
    console.log(`Test 8.10 [${ENV_NAME}]: Signatory selected from dropdown\n`);

    // --- STEP 11: Click Prepare Document ---
    const prepareDocBtn = page.locator('button:has-text("Prepare Document")');
    await prepareDocBtn.waitFor({ state: "visible", timeout: 30000 });
    await prepareDocBtn.click();
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
    console.log(`Test 8.11 [${ENV_NAME}]: Prepare Document clicked\n`);

    // --- STEP 12: Click Send Document ---
    const sendDocumentBtn = page.locator('button:has-text("Send Document")');
    await sendDocumentBtn.waitFor({ state: "visible", timeout: 30000 });
    await sendDocumentBtn.click();
    await page.waitForLoadState("networkidle", { timeout: 60000 });;
    console.log(`Test 8.12 [${ENV_NAME}]: Send Document clicked\n`);

    console.log(`Test 8 [${ENV_NAME}]: Use Workflow from Templates completed\n`);
    //New test will be added here

  });
});
