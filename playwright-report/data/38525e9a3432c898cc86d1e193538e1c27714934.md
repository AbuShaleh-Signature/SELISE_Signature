# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\regressionTest.stage.spec.ts >> 📋 Regression Suite - STAGE Environment >> Test 3: Verify Signature Module
- Location: tests\ui\regressionTest.stage.spec.ts:129:3

# Error details

```
Error: page.waitForTimeout: Target page, context or browser has been closed
```

# Test source

```ts
  72  |   // TEST 1: HOME PAGE VERIFICATION
  73  |   // ==========================================================================
  74  |   // Verifies that the home page loads correctly after login
  75  |   // Success criteria: Home page container element is visible
  76  | 
  77  |   sequentialTest("Test 1: Verify home page elements", async ({ page }) => {
  78  |     // Assert home page container is visible
  79  |     await expect(page.locator(LOCATORS.home)).toBeVisible();
  80  |     console.log(`Test 1 [${ENV_NAME}]: Home page elements verified\n`);
  81  |   });
  82  | 
  83  |   // ==========================================================================
  84  |   // TEST 2: LANDING PAGE CONTENTS
  85  |   // ==========================================================================
  86  |   // Verifies all expected UI elements are present on the landing page
  87  |   // Tests: Apps, Store button, Header elements
  88  | 
  89  |   // --- TEST 2, 3, 4, 5 COMMENTED OUT ---
  90  | 
  91  |   sequentialTest("Test 2: Verify Landing Page Contents", async ({ page }) => {
  92  |     // --- Available Apps Section ---
  93  |     await expect(page.locator(LOCATORS.contactsApp)).toBeVisible();
  94  |     console.log(`Test 2.1 [${ENV_NAME}]: Contacts app is visible\n`);
  95  | 
  96  |     await expect(page.locator(LOCATORS.signatureApp)).toBeVisible();
  97  |     console.log(`Test 2.2 [${ENV_NAME}]: Signature app is visible\n`);
  98  | 
  99  |     await expect(page.locator(LOCATORS.fileManagerApp)).toBeVisible();
  100 |     console.log(`Test 2.3 [${ENV_NAME}]: File Manager app is visible\n`);
  101 | 
  102 |     // --- SELISE Store Button ---
  103 |     await expect(page.locator(LOCATORS.seliseStoreButton)).toBeVisible();
  104 |     console.log(`Test 2.4 [${ENV_NAME}]: SELISE Store button is present\n`);
  105 | 
  106 |     // --- Header Elements ---
  107 |     await expect(page.locator(LOCATORS.logo)).toBeVisible();
  108 |     console.log(`Test 2.5 [${ENV_NAME}]: Logo is visible in header\n`);
  109 | 
  110 |     await expect(page.locator(LOCATORS.profileLogo)).toBeVisible();
  111 |     console.log(`Test 2.6 [${ENV_NAME}]: Profile logo is visible in header\n`);
  112 | 
  113 |     await expect(page.locator(LOCATORS.myAppsMenu)).toBeVisible();
  114 |     console.log(`Test 2.7 [${ENV_NAME}]: My Apps menu is visible in header\n`);
  115 |   });
  116 | 
  117 |   // ==========================================================================
  118 |   // TEST 3: SIGNATURE MODULE STATUS CARDS
  119 |   // ==========================================================================
  120 |   // Verifies the signature module's status cards are present and functional
  121 |   // Status cards represent different document states in the workflow
  122 |   //
  123 |   // Status Cards:
  124 |   //   - Yet To Sign: Documents awaiting signature
  125 |   //   - Yet To Review: Documents pending review
  126 |   //   - Pending: Documents in progress
  127 |   //   - Completed: Signed documents
  128 | 
  129 |   sequentialTest("Test 3: Verify Signature Module", async ({ page }) => {
  130 |     // Navigate to Signature module by clicking the Signature app
  131 |     await page.locator(LOCATORS.signatureApp).first().click();
  132 |     await page.waitForTimeout(30000);
  133 |     console.log(`Test 3.0 [${ENV_NAME}]: Signature app clicked\n`);
  134 | 
  135 |     // --- YET TO SIGN CARD ---
  136 |     const yetToSignCard = page.locator(LOCATORS.yetToSignCard);
  137 |     await yetToSignCard.scrollIntoViewIfNeeded(); // Scroll into view if not visible
  138 |     await yetToSignCard.waitFor({ state: "visible", timeout: 5000 });
  139 | 
  140 |     if (await yetToSignCard.isVisible()) {
  141 |       await yetToSignCard.click(); // Click to open details page
  142 |       await page.waitForTimeout(30000);
  143 |       console.log(`Test 3.1 [${ENV_NAME}]: Yet To Sign clicked and details page opened\n`);
  144 |       await page.goto(`${ENV_URL}/e-signature`); // Navigate back to signature module
  145 |       await page.waitForTimeout(30000);
  146 |     } else {
  147 |       console.log(`Test 3.1 [${ENV_NAME}]: SKIPPED - Yet To Sign card not visible\n`);
  148 |     }
  149 | 
  150 |     // --- YET TO REVIEW CARD ---
  151 |     const yetToReviewCard = page.locator(LOCATORS.yetToReviewCard);
  152 |     await yetToReviewCard.scrollIntoViewIfNeeded();
  153 |     await yetToReviewCard.waitFor({ state: "visible", timeout: 5000 });
  154 | 
  155 |     if (await yetToReviewCard.isVisible()) {
  156 |       await yetToReviewCard.click();
  157 |       await page.waitForTimeout(30000);
  158 |       console.log(`Test 3.2 [${ENV_NAME}]: Yet To Review clicked and details page opened\n`);
  159 |       await page.goto(`${ENV_URL}/e-signature`);
  160 |       await page.waitForTimeout(30000);
  161 |     } else {
  162 |       console.log(`Test 3.2 [${ENV_NAME}]: SKIPPED - Yet To Review card not visible\n`);
  163 |     }
  164 | 
  165 |     // --- PENDING CARD ---
  166 |     const pendingCard = page.locator(LOCATORS.pendingCard);
  167 |     await pendingCard.scrollIntoViewIfNeeded();
  168 |     await pendingCard.waitFor({ state: "visible", timeout: 5000 });
  169 | 
  170 |     if (await pendingCard.isVisible()) {
  171 |       await pendingCard.click();
> 172 |       await page.waitForTimeout(30000);
      |                  ^ Error: page.waitForTimeout: Target page, context or browser has been closed
  173 |       console.log(`Test 3.3 [${ENV_NAME}]: Pending clicked and details page opened\n`);
  174 |       await page.goto(`${ENV_URL}/e-signature`);
  175 |       await page.waitForTimeout(30000);
  176 |     } else {
  177 |       console.log(`Test 3.3 [${ENV_NAME}]: SKIPPED - Pending card not visible\n`);
  178 |     }
  179 | 
  180 |     // --- COMPLETED CARD ---
  181 |     const completedCard = page.locator(LOCATORS.completedCard);
  182 |     await completedCard.scrollIntoViewIfNeeded();
  183 |     await completedCard.waitFor({ state: "visible", timeout: 5000 });
  184 | 
  185 |     if (await completedCard.isVisible()) {
  186 |       await completedCard.click();
  187 |       await page.waitForTimeout(30000);
  188 |       console.log(`Test 3.4 [${ENV_NAME}]: Completed clicked and details page opened\n`);
  189 |     } else {
  190 |       console.log(`Test 3.4 [${ENV_NAME}]: SKIPPED - Completed card not visible\n`);
  191 |     }
  192 |   });
  193 | 
  194 |   // ==========================================================================
  195 |   // TEST 4: DOCUMENT UPLOAD AND SIGNING WORKFLOW
  196 |   // ==========================================================================
  197 |   // Complete end-to-end test of the document signing workflow:
  198 |   //
  199 |   // Workflow Steps:
  200 |   //   1. Navigate to Signature module
  201 |   //   2. Upload PDF document
  202 |   //   3. Fill envelope name
  203 |   //   4. Add recipient
  204 |   //   5. Prepare document
  205 |   //   6. Drag signature to PDF
  206 |   //   7. Send document
  207 |   //   8. Confirm sending
  208 |   //   9. Wait for rollout completion
  209 |   //   10. Review and sign document
  210 |   //   11. Click signature placeholder
  211 |   //   12. Finish signing
  212 |   //   13. Accept terms and sign
  213 | 
  214 |   sequentialTest("Test 4: Upload Document", async ({ page }) => {
  215 |     // --- STEP 1: Navigate to Signature Module ---
  216 |     await page.goto(`${ENV_URL}/e-signature`);
  217 |     await page.waitForTimeout(30000);
  218 |     console.log(`Test 4.0 [${ENV_NAME}]: Navigated to Signature module\n`);
  219 | 
  220 |     // --- Close any existing alert dialogs ---
  221 |     const closeAlert = page.locator(LOCATORS.closeAlertBtn).first();
  222 |     if (await closeAlert.isVisible()) {
  223 |       await closeAlert.click();
  224 |       await page.waitForTimeout(30000);
  225 |     }
  226 | 
  227 |     // --- STEP 2: Verify Upload Area ---
  228 |     // Check if upload area is visible (some environments may not have this)
  229 |     const uploadAreaVisible = await page.locator(LOCATORS.uploadArea).isVisible();
  230 |     if (!uploadAreaVisible) {
  231 |       console.log(`Test 4.1 [${ENV_NAME}]: SKIPPED - Upload area not visible\n`);
  232 |       console.log(`Test 4 [${ENV_NAME}]: SKIPPED - Document upload workflow not available\n`);
  233 |       return; // Skip test if upload area not available
  234 |     }
  235 | 
  236 |     await page.locator(LOCATORS.uploadArea).waitFor({ state: "visible", timeout: 10000 });
  237 |     await expect(page.locator(LOCATORS.uploadArea)).toBeVisible();
  238 |     console.log(`Test 4.1 [${ENV_NAME}]: Upload area is visible\n`);
  239 | 
  240 |     // --- Verify Upload From Device Button ---
  241 |     await expect(page.locator(LOCATORS.uploadFromDeviceBtn)).toBeVisible();
  242 |     console.log(`Test 4.2 [${ENV_NAME}]: Upload From Device button is visible\n`);
  243 | 
  244 |     // --- STEP 3: Upload PDF File ---
  245 |     await page.locator(LOCATORS.uploadInput).setInputFiles("test-data/template.pdf");
  246 |     await page.waitForTimeout(30000);
  247 |     console.log(`Test 4.3 [${ENV_NAME}]: File uploaded\n`);
  248 | 
  249 |     // --- STEP 4: Fill Envelope Name ---
  250 |     await page.locator(LOCATORS.envelopeNameInput).waitFor({ state: "visible", timeout: 15000 });
  251 |     await page.locator(LOCATORS.envelopeNameInput).fill("Automation Test");
  252 |     console.log(`Test 4.4 [${ENV_NAME}]: Envelope name set\n`);
  253 | 
  254 |     // --- STEP 5: Add Recipient ---
  255 |     await page.locator(LOCATORS.addRecipientBtn).waitFor({ state: "visible", timeout: 15000 });
  256 |     await page.locator(LOCATORS.addRecipientBtn).click();
  257 |     console.log(`Test 4.5 [${ENV_NAME}]: Add Recipient clicked\n`);
  258 | 
  259 |     // --- STEP 6: Verify Add Recipients Page ---
  260 |     await page.locator(LOCATORS.addRecipientsPage).waitFor({ state: "visible", timeout: 15000 });
  261 |     await expect(page.locator(LOCATORS.addRecipientsPage)).toBeVisible();
  262 |     console.log(`Test 4.6 [${ENV_NAME}]: Add Recipients page visible\n`);
  263 | 
  264 |     // --- STEP 7: Prepare Document ---
  265 |     await page.locator(LOCATORS.prepareDocumentBtn).waitFor({ state: "visible", timeout: 15000 });
  266 |     await page.locator(LOCATORS.prepareDocumentBtn).click();
  267 |     console.log(`Test 4.7 [${ENV_NAME}]: Prepare Document clicked\n`);
  268 | 
  269 |     // --- STEP 8: Wait for Document to Load ---
  270 |     await page.waitForTimeout(30000);
  271 |     console.log(`Test 4.8 [${ENV_NAME}]: Document loaded\n`);
  272 | 
```