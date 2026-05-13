# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\keyboardAccessibilityTest.stage.spec.ts >> ⌨️  Keyboard Navigation Suite - STAGE >> Test 3: Signature Module Keyboard Navigation
- Location: tests\ui\keyboardAccessibilityTest.stage.spec.ts:105:3

# Error details

```
Error: page.waitForTimeout: Target page, context or browser has been closed
```

# Test source

```ts
  16  | 
  17  | import { config } from "dotenv";
  18  | import { resolve } from "path";
  19  | 
  20  | config({ path: resolve(process.cwd(), ".env.stage"), override: true });
  21  | 
  22  | const ENV_URL_FULL = process.env.URL || "";
  23  | const ENV_URL = ENV_URL_FULL.replace(/\/login$/, "");
  24  | const ENV_NAME = "STAGE";
  25  | 
  26  | (globalThis as any).__TEST_ENV_URL__ = ENV_URL_FULL;
  27  | (globalThis as any).__TEST_ENV_USERNAME__ = process.env.USERNAME || "";
  28  | (globalThis as any).__TEST_ENV_PASSWORD__ = process.env.PASSWORD || "";
  29  | 
  30  | import { sequentialTest, expect } from "../../src/pages/basePage";
  31  | import { LOCATORS } from "../../src/locators.stage";
  32  | 
  33  | console.log(`\n⌨️  Running: Keyboard Navigation Suite - ${ENV_NAME} Environment`);
  34  | console.log(`   URL: ${ENV_URL}`);
  35  | console.log(`-----------------------------------\n`);
  36  | 
  37  | sequentialTest.describe.serial(`⌨️  Keyboard Navigation Suite - ${ENV_NAME}`, () => {
  38  |   sequentialTest.setTimeout(900000);
  39  | 
  40  |   // ==========================================================================
  41  |   // TEST 1: HOME PAGE KEYBOARD NAVIGATION
  42  |   // ==========================================================================
  43  | 
  44  |   sequentialTest("Test 1: Home Page Keyboard Navigation", async ({ page }) => {
  45  |     await expect(page.locator(LOCATORS.home)).toBeVisible();
  46  |     console.log(`Test 1.0 [${ENV_NAME}]: Home page loaded\n`);
  47  | 
  48  |     const focusableCount = await page.evaluate(() => {
  49  |       return document.querySelectorAll(
  50  |         'a[href], button:not([disabled]), input:not([disabled]), [tabindex="0"]'
  51  |       ).length;
  52  |     });
  53  |     expect(focusableCount).toBeGreaterThan(0);
  54  |     console.log(`Test 1.1 [${ENV_NAME}]: Focusable elements found: ${focusableCount}\n`);
  55  | 
  56  |     let tabCount = 0;
  57  |     for (let i = 0; i < 10; i++) {
  58  |       await page.keyboard.press("Tab");
  59  |       await page.waitForTimeout(100);
  60  |       const tag = await page.evaluate(() => document.activeElement?.tagName);
  61  |       if (tag) tabCount++;
  62  |     }
  63  |     console.log(`Test 1.2 [${ENV_NAME}]: Tabbed through ${tabCount} elements\n`);
  64  | 
  65  |     await page.keyboard.press("Shift+Tab");
  66  |     await page.waitForTimeout(200);
  67  |     const previousElement = await page.evaluate(() => document.activeElement?.tagName);
  68  |     expect(previousElement).toBeTruthy();
  69  |     console.log(`Test 1.3 [${ENV_NAME}]: Shift+Tab works: ${previousElement}\n`);
  70  | 
  71  |     console.log(`Test 1 [${ENV_NAME}]: Home page keyboard navigation PASSED\n`);
  72  |   });
  73  | 
  74  |   // ==========================================================================
  75  |   // TEST 2: LANDING PAGE KEYBOARD NAVIGATION
  76  |   // ==========================================================================
  77  | 
  78  |   sequentialTest("Test 2: Landing Page Keyboard Navigation", async ({ page }) => {
  79  |     await expect(page.locator(LOCATORS.contactsApp)).toBeVisible();
  80  |     console.log(`Test 2.1 [${ENV_NAME}]: Contacts app is visible\n`);
  81  | 
  82  |     await expect(page.locator(LOCATORS.signatureApp)).toBeVisible();
  83  |     console.log(`Test 2.2 [${ENV_NAME}]: Signature app is visible\n`);
  84  | 
  85  |     await expect(page.locator(LOCATORS.fileManagerApp)).toBeVisible();
  86  |     console.log(`Test 2.3 [${ENV_NAME}]: File Manager app is visible\n`);
  87  | 
  88  |     await expect(page.locator(LOCATORS.seliseStoreButton)).toBeVisible();
  89  |     console.log(`Test 2.4 [${ENV_NAME}]: SELISE Store button is present\n`);
  90  | 
  91  |     await expect(page.locator(LOCATORS.logo)).toBeVisible();
  92  |     console.log(`Test 2.5 [${ENV_NAME}]: Logo is visible in header\n`);
  93  | 
  94  |     await expect(page.locator(LOCATORS.profileLogo)).toBeVisible();
  95  |     console.log(`Test 2.6 [${ENV_NAME}]: Profile logo is visible in header\n`);
  96  | 
  97  |     await expect(page.locator(LOCATORS.myAppsMenu)).toBeVisible();
  98  |     console.log(`Test 2.7 [${ENV_NAME}]: My Apps menu is visible in header\n`);
  99  |   });
  100 | 
  101 |   // ==========================================================================
  102 |   // TEST 3: SIGNATURE MODULE KEYBOARD NAVIGATION
  103 |   // ==========================================================================
  104 | 
  105 |   sequentialTest("Test 3: Signature Module Keyboard Navigation", async ({ page }) => {
  106 |     await page.locator(LOCATORS.signatureApp).first().click();
  107 |     await page.waitForTimeout(2000);
  108 |     console.log(`Test 3.0 [${ENV_NAME}]: Signature app clicked\n`);
  109 | 
  110 |     const yetToSignCard = page.locator(LOCATORS.yetToSignCard);
  111 |     await yetToSignCard.scrollIntoViewIfNeeded();
  112 |     await yetToSignCard.waitFor({ state: "visible", timeout: 5000 });
  113 |     if (await yetToSignCard.isVisible()) {
  114 |       await yetToSignCard.focus();
  115 |       await page.keyboard.press("Enter");
> 116 |       await page.waitForTimeout(2000);
      |                  ^ Error: page.waitForTimeout: Target page, context or browser has been closed
  117 |       console.log(`Test 3.1 [${ENV_NAME}]: Yet To Sign opened via Enter\n`);
  118 |       await page.goto(`${ENV_URL}/e-signature`);
  119 |       await page.waitForTimeout(2000);
  120 |     }
  121 | 
  122 |     const yetToReviewCard = page.locator(LOCATORS.yetToReviewCard);
  123 |     await yetToReviewCard.scrollIntoViewIfNeeded();
  124 |     await yetToReviewCard.waitFor({ state: "visible", timeout: 5000 });
  125 |     if (await yetToReviewCard.isVisible()) {
  126 |       await yetToReviewCard.focus();
  127 |       await page.keyboard.press("Enter");
  128 |       await page.waitForTimeout(2000);
  129 |       console.log(`Test 3.2 [${ENV_NAME}]: Yet To Review opened via Enter\n`);
  130 |       await page.goto(`${ENV_URL}/e-signature`);
  131 |       await page.waitForTimeout(2000);
  132 |     }
  133 | 
  134 |     const pendingCard = page.locator(LOCATORS.pendingCard);
  135 |     await pendingCard.scrollIntoViewIfNeeded();
  136 |     await pendingCard.waitFor({ state: "visible", timeout: 5000 });
  137 |     if (await pendingCard.isVisible()) {
  138 |       await pendingCard.focus();
  139 |       await page.keyboard.press("Enter");
  140 |       await page.waitForTimeout(2000);
  141 |       console.log(`Test 3.3 [${ENV_NAME}]: Pending opened via Enter\n`);
  142 |       await page.goto(`${ENV_URL}/e-signature`);
  143 |       await page.waitForTimeout(2000);
  144 |     }
  145 | 
  146 |     const completedCard = page.locator(LOCATORS.completedCard);
  147 |     await completedCard.scrollIntoViewIfNeeded();
  148 |     await completedCard.waitFor({ state: "visible", timeout: 5000 });
  149 |     if (await completedCard.isVisible()) {
  150 |       await completedCard.focus();
  151 |       await page.keyboard.press("Enter");
  152 |       await page.waitForTimeout(2000);
  153 |       console.log(`Test 3.4 [${ENV_NAME}]: Completed opened via Enter\n`);
  154 |     }
  155 |   });
  156 | 
  157 |   // ==========================================================================
  158 |   // TEST 4: DOCUMENT UPLOAD VIA KEYBOARD
  159 |   // ==========================================================================
  160 | 
  161 |   sequentialTest("Test 4: Upload Document via Keyboard", async ({ page }) => {
  162 |     await page.goto(`${ENV_URL}/e-signature`);
  163 |     await page.waitForTimeout(5000);
  164 |     console.log(`Test 4.0 [${ENV_NAME}]: Navigated to Signature module\n`);
  165 | 
  166 |     const closeAlert = page.locator(LOCATORS.closeAlertBtn).first();
  167 |     if (await closeAlert.isVisible()) {
  168 |       await closeAlert.click();
  169 |       await page.waitForTimeout(500);
  170 |     }
  171 | 
  172 |     let uploadAreaVisible = await page.locator(LOCATORS.uploadArea).isVisible();
  173 |     if (!uploadAreaVisible) {
  174 |       await page.reload();
  175 |       await page.waitForTimeout(5000);
  176 |       uploadAreaVisible = await page.locator(LOCATORS.uploadArea).isVisible();
  177 |     }
  178 |     if (!uploadAreaVisible) {
  179 |       console.log(`Test 4.1 [${ENV_NAME}]: SKIPPED - Upload area not visible\n`);
  180 |       console.log(`Test 4 [${ENV_NAME}]: SKIPPED - Upload workflow not available\n`);
  181 |       return;
  182 |     }
  183 | 
  184 |     await page.locator(LOCATORS.uploadArea).waitFor({ state: "visible", timeout: 10000 });
  185 |     await expect(page.locator(LOCATORS.uploadArea)).toBeVisible();
  186 |     console.log(`Test 4.1 [${ENV_NAME}]: Upload area is visible\n`);
  187 | 
  188 |     await page.locator(LOCATORS.uploadInput).setInputFiles("test-data/template.pdf");
  189 |     await page.waitForTimeout(5000);
  190 |     console.log(`Test 4.2 [${ENV_NAME}]: File uploaded\n`);
  191 | 
  192 |     await page.locator(LOCATORS.envelopeNameInput).waitFor({ state: "visible", timeout: 60000 });
  193 |     await page.locator(LOCATORS.envelopeNameInput).fill("Keyboard Test");
  194 |     await page.waitForTimeout(1000);
  195 |     console.log(`Test 4.3 [${ENV_NAME}]: Envelope name filled\n`);
  196 | 
  197 |     await page.locator(LOCATORS.addRecipientBtn).waitFor({ state: "visible", timeout: 10000 });
  198 |     await page.locator(LOCATORS.addRecipientBtn).click();
  199 |     await page.waitForTimeout(3000);
  200 |     console.log(`Test 4.4 [${ENV_NAME}]: Add Recipient clicked\n`);
  201 | 
  202 |     await page.locator(LOCATORS.addRecipientsPage).waitFor({ state: "visible", timeout: 30000 });
  203 |     await expect(page.locator(LOCATORS.addRecipientsPage)).toBeVisible();
  204 |     console.log(`Test 4.5 [${ENV_NAME}]: Add Recipients page visible\n`);
  205 | 
  206 |     await page.locator(LOCATORS.prepareDocumentBtn).waitFor({ state: "visible", timeout: 10000 });
  207 |     await page.locator(LOCATORS.prepareDocumentBtn).click();
  208 |     console.log(`Test 4.6 [${ENV_NAME}]: Prepare Document clicked\n`);
  209 | 
  210 |     await page.waitForTimeout(3000);
  211 |     console.log(`Test 4.7 [${ENV_NAME}]: Document loaded\n`);
  212 | 
  213 |     await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  214 |     await page.waitForTimeout(3000);
  215 |     console.log(`Test 4.8 [${ENV_NAME}]: Scrolled to bottom\n`);
  216 | 
```