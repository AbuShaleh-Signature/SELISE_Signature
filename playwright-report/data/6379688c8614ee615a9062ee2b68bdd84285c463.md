# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\keyboardAccessibilityTest.stage.spec.ts >> ⌨️  Keyboard Navigation Suite - STAGE >> Test 4: Upload Document via Keyboard
- Location: tests\ui\keyboardAccessibilityTest.stage.spec.ts:161:3

# Error details

```
TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('input[placeholder="Enter contract name"]') to be visible

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e8]:
    - generic [ref=e10]:
      - img [ref=e13] [cursor=pointer]: cancel
      - text: 
    - generic [ref=e19]:
      - progressbar [ref=e20]:
        - img [ref=e21]
      - progressbar [ref=e26]:
        - img [ref=e27]
  - generic:
    - generic: 
  - generic:
    - generic:   
  - generic "Support" [ref=e29] [cursor=pointer]:
    - img [ref=e31]: contact_support
```

# Test source

```ts
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
  116 |       await page.waitForTimeout(2000);
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
  163 |     await page.waitForTimeout(3000);
  164 |     console.log(`Test 4.0 [${ENV_NAME}]: Navigated to Signature module\n`);
  165 | 
  166 |     const closeAlert = page.locator(LOCATORS.closeAlertBtn).first();
  167 |     if (await closeAlert.isVisible()) {
  168 |       await closeAlert.focus();
  169 |       await page.keyboard.press("Enter");
  170 |       await page.waitForTimeout(500);
  171 |     }
  172 | 
  173 |     const uploadAreaVisible = await page.locator(LOCATORS.uploadArea).isVisible();
  174 |     if (!uploadAreaVisible) {
  175 |       console.log(`Test 4.1 [${ENV_NAME}]: SKIPPED - Upload area not visible\n`);
  176 |       console.log(`Test 4 [${ENV_NAME}]: SKIPPED - Upload workflow not available\n`);
  177 |       return;
  178 |     }
  179 | 
  180 |     await page.locator(LOCATORS.uploadArea).waitFor({ state: "visible", timeout: 10000 });
  181 |     await expect(page.locator(LOCATORS.uploadArea)).toBeVisible();
  182 |     console.log(`Test 4.1 [${ENV_NAME}]: Upload area is visible\n`);
  183 | 
  184 |     await page.locator(LOCATORS.uploadInput).setInputFiles("test-data/template.pdf");
  185 |     await page.waitForTimeout(5000);
  186 |     console.log(`Test 4.2 [${ENV_NAME}]: File uploaded\n`);
  187 | 
> 188 |     await page.locator(LOCATORS.envelopeNameInput).waitFor({ state: "visible", timeout: 10000 });
      |                                                    ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  189 |     await page.locator(LOCATORS.envelopeNameInput).focus();
  190 |     await page.keyboard.press("Control+a");
  191 |     await page.keyboard.type("Keyboard Test");
  192 |     console.log(`Test 4.3 [${ENV_NAME}]: Envelope name typed via keyboard\n`);
  193 | 
  194 |     await page.locator(LOCATORS.addRecipientBtn).waitFor({ state: "visible", timeout: 10000 });
  195 |     await page.locator(LOCATORS.addRecipientBtn).focus();
  196 |     await page.keyboard.press("Enter");
  197 |     console.log(`Test 4.4 [${ENV_NAME}]: Add Recipient via Enter\n`);
  198 | 
  199 |     await page.locator(LOCATORS.addRecipientsPage).waitFor({ state: "visible", timeout: 10000 });
  200 |     await expect(page.locator(LOCATORS.addRecipientsPage)).toBeVisible();
  201 |     console.log(`Test 4.5 [${ENV_NAME}]: Add Recipients page visible\n`);
  202 | 
  203 |     await page.locator(LOCATORS.prepareDocumentBtn).waitFor({ state: "visible", timeout: 10000 });
  204 |     await page.locator(LOCATORS.prepareDocumentBtn).focus();
  205 |     await page.keyboard.press("Enter");
  206 |     console.log(`Test 4.6 [${ENV_NAME}]: Prepare Document via Enter\n`);
  207 | 
  208 |     await page.waitForTimeout(3000);
  209 |     console.log(`Test 4.7 [${ENV_NAME}]: Document loaded\n`);
  210 | 
  211 |     console.log(`Test 4 [${ENV_NAME}]: Upload via keyboard completed\n`);
  212 |   });
  213 | 
  214 |   // ==========================================================================
  215 |   // TEST 5: SIGNATURE ADVANCE WORKFLOW VIA KEYBOARD
  216 |   // ==========================================================================
  217 | 
  218 |   sequentialTest("Test 5: Signature Advance Workflow via Keyboard", async ({ page }) => {
  219 |     await page.goto(`${ENV_URL}/e-signature`);
  220 |     await page.waitForTimeout(3000);
  221 |     console.log(`Test 5.0 [${ENV_NAME}]: Navigated to Signature module\n`);
  222 | 
  223 |     const closeAlert = page.locator(LOCATORS.closeAlertBtn).first();
  224 |     if (await closeAlert.isVisible()) {
  225 |       await closeAlert.focus();
  226 |       await page.keyboard.press("Enter");
  227 |       await page.waitForTimeout(500);
  228 |     }
  229 | 
  230 |     const uploadAreaVisible = await page.locator(LOCATORS.uploadArea).isVisible();
  231 |     if (!uploadAreaVisible) {
  232 |       console.log(`Test 5.1 [${ENV_NAME}]: SKIPPED - Upload area not visible\n`);
  233 |       console.log(`Test 5 [${ENV_NAME}]: SKIPPED - Advance workflow not available\n`);
  234 |       return;
  235 |     }
  236 | 
  237 |     await page.locator(LOCATORS.uploadArea).waitFor({ state: "visible", timeout: 10000 });
  238 |     console.log(`Test 5.1 [${ENV_NAME}]: Upload area is visible\n`);
  239 | 
  240 |     await page.locator(LOCATORS.uploadInput).setInputFiles("test-data/template.pdf");
  241 |     await page.waitForTimeout(8000);
  242 |     console.log(`Test 5.2 [${ENV_NAME}]: File uploaded\n`);
  243 | 
  244 |     const uploadProgress = page.locator('text="template.pdf"').first();
  245 |     await uploadProgress.waitFor({ state: "visible", timeout: 15000 });
  246 |     console.log(`Test 5.2.1 [${ENV_NAME}]: File upload verified\n`);
  247 | 
  248 |     await page.locator(LOCATORS.envelopeNameInput).waitFor({ state: "visible", timeout: 30000 });
  249 |     await page.locator(LOCATORS.envelopeNameInput).focus();
  250 |     await page.keyboard.press("Control+a");
  251 |     await page.keyboard.type("Advance Keyboard Test");
  252 | 
  253 |     await page.locator(LOCATORS.signatureTypeAdvance).focus();
  254 |     await page.keyboard.press("Enter");
  255 |     await page.waitForTimeout(500);
  256 |     await page.keyboard.press("Tab");
  257 |     await page.keyboard.press("Tab");
  258 |     await page.keyboard.press("Enter");
  259 |     console.log(`Test 5.3 [${ENV_NAME}]: Signature type selected via keyboard\n`);
  260 | 
  261 |     await page.locator(LOCATORS.addRecipientBtn).waitFor({ state: "visible", timeout: 10000 });
  262 |     await page.locator(LOCATORS.addRecipientBtn).focus();
  263 |     await page.keyboard.press("Enter");
  264 |     console.log(`Test 5.4 [${ENV_NAME}]: Add Recipient via Enter\n`);
  265 | 
  266 |     await page.locator(LOCATORS.addRecipientsPage).waitFor({ state: "visible", timeout: 10000 });
  267 |     await expect(page.locator(LOCATORS.addRecipientsPage)).toBeVisible();
  268 |     console.log(`Test 5.5 [${ENV_NAME}]: Add Recipients page visible\n`);
  269 | 
  270 |     await page.locator(LOCATORS.prepareDocumentBtn).waitFor({ state: "visible", timeout: 10000 });
  271 |     await page.locator(LOCATORS.prepareDocumentBtn).focus();
  272 |     await page.keyboard.press("Enter");
  273 |     console.log(`Test 5.6 [${ENV_NAME}]: Prepare Document via Enter\n`);
  274 | 
  275 |     await page.waitForTimeout(5000);
  276 |     console.log(`Test 5 [${ENV_NAME}]: Advance keyboard workflow completed\n`);
  277 |   });
  278 | 
  279 |   // ==========================================================================
  280 |   // TEST 6: SIGN A DOCUMENT VIA KEYBOARD
  281 |   // ==========================================================================
  282 | 
  283 |   sequentialTest("Test 6: Sign A Document via Keyboard", async ({ page }) => {
  284 |     await page.goto(`${ENV_URL}/e-signature`);
  285 |     await page.waitForTimeout(3000);
  286 |     console.log(`Test 6.0 [${ENV_NAME}]: Navigated to Signature module\n`);
  287 | 
  288 |     const signADocBtn = page.locator('button:has-text("Sign A Document")');
```