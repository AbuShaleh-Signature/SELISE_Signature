/**
 * ============================================================================
 * REGRESSION TEST - PROD ENVIRONMENT
 * ============================================================================
 *
 * Purpose:
 *   This file contains end-to-end UI tests for the SELISE Signature module
 *   specifically configured for the PRODUCTION environment.
 *
 * How to Run:
 *   npm run test:prod          - Run with headed browser
 *   npm run test:prod:ci       - Run headless (for CI/CD pipelines)
 *
 * Environment Configuration:
 *   - Environment variables are loaded from .env.prod file
 *   - Base URL: https://selise.app
 *   - Login: abu.shaleh@selisegroup.com
 *
 * Test Structure:
 *   Test 1: Home page verification
 *   Test 2: Landing page contents verification
 *   Test 3: Signature module status cards
 *   Test 4: Full document upload and signing workflow
 *
 * NOTE: This file has the same structure as regressionTest.stage.spec.ts
 *       but uses production environment variables and locators.
 *
 * ============================================================================
 */

// ============================================================================
// IMPORTS
// ============================================================================

// Load environment variables from .env.prod file
import { config } from "dotenv";
import { resolve } from "path";

// Load production environment variables
config({ path: resolve(process.cwd(), ".env.prod"), override: true });

// Extract URLs and credentials from environment
const ENV_URL_FULL = process.env.URL || ""; // https://selise.app/login
const ENV_URL = ENV_URL_FULL.replace(/\/login$/, ""); // https://selise.app
const ENV_NAME = "PROD"; // Environment name for logging

// Pass credentials to basePage via global variables
// These are used by the sequentialTest fixture in basePage.ts
(globalThis as any).__TEST_ENV_URL__ = ENV_URL_FULL;
(globalThis as any).__TEST_ENV_USERNAME__ = process.env.USERNAME || "";
(globalThis as any).__TEST_ENV_PASSWORD__ = process.env.PASSWORD || "";

// Import test utilities and locators (production-specific)
import { sequentialTest, expect } from "../../src/pages/basePage";
import { LOCATORS } from "../../src/locators.prod";

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
  sequentialTest.setTimeout(600000);

  // ==========================================================================
  // TEST 1: HOME PAGE VERIFICATION
  // ==========================================================================
  // Verifies that the home page loads correctly after login

  sequentialTest("Test 1: Verify home page elements", async ({ page }) => {
    await expect(page.locator(LOCATORS.home)).toBeVisible();
    console.log(`Test 1 [${ENV_NAME}]: Home page elements verified\n`);
  });

  // ==========================================================================
  // TEST 2: LANDING PAGE CONTENTS
  // ==========================================================================
  // Verifies all expected UI elements are present on the landing page

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

  sequentialTest("Test 3: Verify Signature Module", async ({ page }) => {
    // Navigate to Signature module
    await page.locator(LOCATORS.signatureApp).first().click();
    await page.waitForTimeout(2000);
    console.log(`Test 3.0 [${ENV_NAME}]: Signature app clicked\n`);

    // --- YET TO SIGN CARD ---
    await page.locator(LOCATORS.yetToSignCard).waitFor({ state: "visible", timeout: 10000 });
    await expect(page.locator(LOCATORS.yetToSignCard)).toBeVisible();
    console.log(`Test 3.1 [${ENV_NAME}]: Yet To Sign card is visible\n`);
    await page.locator(LOCATORS.yetToSignCard).click();
    await page.waitForTimeout(1000);
    console.log(`Test 3.1.1 [${ENV_NAME}]: Yet To Sign details page clicked\n`);
    await page.goto(`${ENV_URL}/e-signature`);
    await page.waitForTimeout(2000);

    // --- YET TO REVIEW CARD ---
    await page.locator(LOCATORS.yetToReviewCard).waitFor({ state: "visible", timeout: 10000 });
    await expect(page.locator(LOCATORS.yetToReviewCard)).toBeVisible();
    console.log(`Test 3.2 [${ENV_NAME}]: Yet To Review card is visible\n`);
    await page.locator(LOCATORS.yetToReviewCard).click();
    await page.waitForTimeout(1000);
    console.log(`Test 3.2.1 [${ENV_NAME}]: Yet To Review details page clicked\n`);
    await page.goto(`${ENV_URL}/e-signature`);
    await page.waitForTimeout(2000);

    // --- PENDING CARD ---
    await page.locator(LOCATORS.pendingCard).waitFor({ state: "visible", timeout: 10000 });
    await expect(page.locator(LOCATORS.pendingCard)).toBeVisible();
    console.log(`Test 3.3 [${ENV_NAME}]: Pending card is visible\n`);
    await page.locator(LOCATORS.pendingCard).click();
    await page.waitForTimeout(1000);
    console.log(`Test 3.3.1 [${ENV_NAME}]: Pending details page clicked\n`);
    await page.goto(`${ENV_URL}/e-signature`);
    await page.waitForTimeout(2000);

    // --- COMPLETED CARD ---
    await page.locator(LOCATORS.completedCard).waitFor({ state: "visible", timeout: 10000 });
    await expect(page.locator(LOCATORS.completedCard)).toBeVisible();
    console.log(`Test 3.4 [${ENV_NAME}]: Completed card is visible\n`);
    await page.locator(LOCATORS.completedCard).click();
    await page.waitForTimeout(1000);
    console.log(`Test 3.4.1 [${ENV_NAME}]: Completed details page clicked\n`);
  });

  // ==========================================================================
  // TEST 4: DOCUMENT UPLOAD AND SIGNING WORKFLOW
  // ==========================================================================
  // Complete end-to-end test of the document signing workflow

  sequentialTest("Test 4: Upload Document", async ({ page }) => {
    // --- STEP 1: Navigate to Signature Module ---
    await page.goto(`${ENV_URL}/e-signature`);
    await page.waitForTimeout(2000);
    console.log(`Test 4.0 [${ENV_NAME}]: Navigated to Signature module\n`);

    // --- Close any existing alert dialogs ---
    const closeAlert = page.locator(LOCATORS.closeAlertBtn).first();
    if (await closeAlert.isVisible()) {
      await closeAlert.click();
      await page.waitForTimeout(500);
    }

    // --- STEP 2: Verify Upload Area ---
    await page.locator(LOCATORS.uploadArea).waitFor({ state: "visible", timeout: 10000 });
    await expect(page.locator(LOCATORS.uploadArea)).toBeVisible();
    console.log(`Test 4.1 [${ENV_NAME}]: Upload area is visible\n`);

    // --- STEP 3: Verify Upload From Device Button ---
    await expect(page.locator(LOCATORS.uploadFromDeviceBtn)).toBeVisible();
    console.log(`Test 4.2 [${ENV_NAME}]: Upload From Device button is visible\n`);

    // --- STEP 4: Upload PDF File ---
    await page.locator(LOCATORS.uploadInput).setInputFiles("test-data/template.pdf");
    await page.waitForTimeout(5000);
    console.log(`Test 4.3 [${ENV_NAME}]: File uploaded\n`);

    // --- STEP 5: Fill Envelope Name ---
    await page.locator(LOCATORS.envelopeNameInput).waitFor({ state: "visible", timeout: 10000 });
    await page.locator(LOCATORS.envelopeNameInput).fill("Automation Test");
    console.log(`Test 4.4 [${ENV_NAME}]: Envelope name set\n`);

    // --- STEP 6: Add Recipient ---
    await page.locator(LOCATORS.addRecipientBtn).waitFor({ state: "visible", timeout: 10000 });
    await page.locator(LOCATORS.addRecipientBtn).click();
    console.log(`Test 4.5 [${ENV_NAME}]: Add Recipient clicked\n`);

    // --- STEP 7: Verify Add Recipients Page ---
    await page.locator(LOCATORS.addRecipientsPage).waitFor({ state: "visible", timeout: 10000 });
    await expect(page.locator(LOCATORS.addRecipientsPage)).toBeVisible();
    console.log(`Test 4.6 [${ENV_NAME}]: Add Recipients page visible\n`);

    // --- STEP 8: Prepare Document ---
    await page.locator(LOCATORS.prepareDocumentBtn).waitFor({ state: "visible", timeout: 10000 });
    await page.locator(LOCATORS.prepareDocumentBtn).click();
    console.log(`Test 4.7 [${ENV_NAME}]: Prepare Document clicked\n`);

    // --- STEP 9: Wait for Document to Load ---
    await page.waitForTimeout(3000);
    console.log(`Test 4.8 [${ENV_NAME}]: Document loaded\n`);

    // --- STEP 10: Scroll to Bottom of Document ---
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    console.log(`Test 4.9 [${ENV_NAME}]: Scrolled to bottom\n`);

    // --- STEP 11: Drag Signature to PDF ---
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
      console.log(`Test 4.10 [${ENV_NAME}]: Signature dragged\n`);
    } else {
      console.log(`Test 4.10 [${ENV_NAME}]: SKIPPED - Could not get positions\n`);
    }

    // --- STEP 12: Send Document ---
    const SendButton = page.locator(LOCATORS.sendDocumentBtn);
    await SendButton.waitFor({ state: "visible", timeout: 10000 });
    await SendButton.click();
    console.log(`Test 4.11 [${ENV_NAME}]: Send Document clicked\n`);

    // --- STEP 13: Handle Confirmation Dialog ---
    await page.waitForTimeout(3000);
    const dialog = page.locator('text="Are you sure?"');
    if (await dialog.isVisible()) {
      console.log(`Test 4.12 [${ENV_NAME}]: Confirmation dialog appeared\n`);

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
      await page.waitForTimeout(500);
      console.log(`Test 4.13 [${ENV_NAME}]: Confirm clicked\n`);
    } else {
      console.log(`Test 4.12 [${ENV_NAME}]: INFO - Document sent directly\n`);
    }

    // --- STEP 14: Wait for Document Rollout Completion ---
    await page.locator(LOCATORS.documentSentSuccess).waitFor({ state: "visible", timeout: 30000 });
    console.log(`Test 4.14 [${ENV_NAME}]: Document rollout completed\n`);

    // --- STEP 15: Review and Sign ---
    await page
      .locator(LOCATORS.reviewDocumentAndSignBtn)
      .waitFor({ state: "visible", timeout: 300000 });
    await page.locator(LOCATORS.reviewDocumentAndSignBtn).click();
    console.log(`Test 4.15 [${ENV_NAME}]: Review Document & Sign clicked\n`);

    // --- STEP 16: Click Signature Placeholder ---
    await page.locator(LOCATORS.signatorySignaturePlaceholder).click();
    console.log(`Test 4.16 [${ENV_NAME}]: Signature placeholder clicked\n`);

    // --- STEP 17: Click Finish ---
    await page.locator(LOCATORS.finishBtn).click();
    console.log(`Test 4.17 [${ENV_NAME}]: Finish clicked\n`);

    // --- STEP 18: Accept Terms (Click Checkbox) ---
    await page.locator(LOCATORS.signCheckbox).waitFor({ state: "visible", timeout: 30000 });
    await page.locator(LOCATORS.signCheckbox).click();
    console.log(`Test 4.18 [${ENV_NAME}]: Checkbox clicked\n`);

    // --- STEP 19: Sign the Contract ---
    await page
      .locator(LOCATORS.signThisContractNowBtn)
      .waitFor({ state: "visible", timeout: 30000 });
    await page.locator(LOCATORS.signThisContractNowBtn).click();
    console.log(`Test 4.19 [${ENV_NAME}]: Sign This Contract Now clicked\n`);

    // --- STEP 20: Wait for Final Page Load ---
    await page.waitForTimeout(3000);
    console.log(`Test 4.20 [${ENV_NAME}]: Document loaded\n`);
  });
});
