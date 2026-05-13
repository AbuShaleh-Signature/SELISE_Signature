# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\keyboardAccessibilityTest.stage.spec.ts >> ⌨️  Keyboard Navigation Suite - STAGE >> Test 5: Signature Advance Workflow via Keyboard
- Location: tests\ui\keyboardAccessibilityTest.stage.spec.ts:222:3

# Error details

```
Error: locator.waitFor: Target page, context or browser has been closed
Call log:
  - waiting for locator('text="Add Recipients"') to be visible

```

# Test source

```ts
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
  185 |     await page.waitForTimeout(8000);
  186 |     console.log(`Test 4.2 [${ENV_NAME}]: File uploaded\n`);
  187 | 
  188 |     const uploadProgress = page.locator('text="template.pdf"').first();
  189 |     await uploadProgress.waitFor({ state: "visible", timeout: 15000 });
  190 |     console.log(`Test 4.2.1 [${ENV_NAME}]: File upload verified\n`);
  191 | 
  192 |     await page.locator(LOCATORS.envelopeNameInput).waitFor({ state: "visible", timeout: 30000 });
  193 |     await page.locator(LOCATORS.envelopeNameInput).focus();
  194 |     await page.keyboard.press("Control+a");
  195 |     await page.keyboard.type("Keyboard Test");
  196 |     console.log(`Test 4.3 [${ENV_NAME}]: Envelope name typed via keyboard\n`);
  197 | 
  198 |     await page.locator(LOCATORS.addRecipientBtn).waitFor({ state: "visible", timeout: 10000 });
  199 |     await page.locator(LOCATORS.addRecipientBtn).focus();
  200 |     await page.keyboard.press("Enter");
  201 |     console.log(`Test 4.4 [${ENV_NAME}]: Add Recipient via Enter\n`);
  202 | 
  203 |     await page.locator(LOCATORS.addRecipientsPage).waitFor({ state: "visible", timeout: 10000 });
  204 |     await expect(page.locator(LOCATORS.addRecipientsPage)).toBeVisible();
  205 |     console.log(`Test 4.5 [${ENV_NAME}]: Add Recipients page visible\n`);
  206 | 
  207 |     await page.locator(LOCATORS.prepareDocumentBtn).waitFor({ state: "visible", timeout: 10000 });
  208 |     await page.locator(LOCATORS.prepareDocumentBtn).focus();
  209 |     await page.keyboard.press("Enter");
  210 |     console.log(`Test 4.6 [${ENV_NAME}]: Prepare Document via Enter\n`);
  211 | 
  212 |     await page.waitForTimeout(3000);
  213 |     console.log(`Test 4.7 [${ENV_NAME}]: Document loaded\n`);
  214 | 
  215 |     console.log(`Test 4 [${ENV_NAME}]: Upload via keyboard completed\n`);
  216 |   });
  217 | 
  218 |   // ==========================================================================
  219 |   // TEST 5: SIGNATURE ADVANCE WORKFLOW VIA KEYBOARD
  220 |   // ==========================================================================
  221 | 
  222 |   sequentialTest("Test 5: Signature Advance Workflow via Keyboard", async ({ page }) => {
  223 |     await page.goto(`${ENV_URL}/e-signature`);
  224 |     await page.waitForTimeout(3000);
  225 |     console.log(`Test 5.0 [${ENV_NAME}]: Navigated to Signature module\n`);
  226 | 
  227 |     const closeAlert = page.locator(LOCATORS.closeAlertBtn).first();
  228 |     if (await closeAlert.isVisible()) {
  229 |       await closeAlert.focus();
  230 |       await page.keyboard.press("Enter");
  231 |       await page.waitForTimeout(500);
  232 |     }
  233 | 
  234 |     const uploadAreaVisible = await page.locator(LOCATORS.uploadArea).isVisible();
  235 |     if (!uploadAreaVisible) {
  236 |       console.log(`Test 5.1 [${ENV_NAME}]: SKIPPED - Upload area not visible\n`);
  237 |       console.log(`Test 5 [${ENV_NAME}]: SKIPPED - Advance workflow not available\n`);
  238 |       return;
  239 |     }
  240 | 
  241 |     await page.locator(LOCATORS.uploadArea).waitFor({ state: "visible", timeout: 10000 });
  242 |     console.log(`Test 5.1 [${ENV_NAME}]: Upload area is visible\n`);
  243 | 
  244 |     await page.locator(LOCATORS.uploadInput).setInputFiles("test-data/template.pdf");
  245 |     await page.waitForTimeout(8000);
  246 |     console.log(`Test 5.2 [${ENV_NAME}]: File uploaded\n`);
  247 | 
  248 |     const uploadProgress = page.locator('text="template.pdf"').first();
  249 |     await uploadProgress.waitFor({ state: "visible", timeout: 15000 });
  250 |     console.log(`Test 5.2.1 [${ENV_NAME}]: File upload verified\n`);
  251 | 
  252 |     await page.locator(LOCATORS.envelopeNameInput).waitFor({ state: "visible", timeout: 30000 });
  253 |     await page.locator(LOCATORS.envelopeNameInput).focus();
  254 |     await page.keyboard.press("Control+a");
  255 |     await page.keyboard.type("Advance Keyboard Test");
  256 | 
  257 |     await page.locator(LOCATORS.signatureTypeAdvance).focus();
  258 |     await page.keyboard.press("Enter");
  259 |     await page.waitForTimeout(500);
  260 |     await page.keyboard.press("Tab");
  261 |     await page.keyboard.press("Tab");
  262 |     await page.keyboard.press("Enter");
  263 |     console.log(`Test 5.3 [${ENV_NAME}]: Signature type selected via keyboard\n`);
  264 | 
  265 |     await page.locator(LOCATORS.addRecipientBtn).waitFor({ state: "visible", timeout: 10000 });
  266 |     await page.locator(LOCATORS.addRecipientBtn).focus();
  267 |     await page.keyboard.press("Enter");
  268 |     console.log(`Test 5.4 [${ENV_NAME}]: Add Recipient via Enter\n`);
  269 | 
> 270 |     await page.locator(LOCATORS.addRecipientsPage).waitFor({ state: "visible", timeout: 10000 });
      |                                                    ^ Error: locator.waitFor: Target page, context or browser has been closed
  271 |     await expect(page.locator(LOCATORS.addRecipientsPage)).toBeVisible();
  272 |     console.log(`Test 5.5 [${ENV_NAME}]: Add Recipients page visible\n`);
  273 | 
  274 |     await page.locator(LOCATORS.prepareDocumentBtn).waitFor({ state: "visible", timeout: 10000 });
  275 |     await page.locator(LOCATORS.prepareDocumentBtn).focus();
  276 |     await page.keyboard.press("Enter");
  277 |     console.log(`Test 5.6 [${ENV_NAME}]: Prepare Document via Enter\n`);
  278 | 
  279 |     await page.waitForTimeout(5000);
  280 |     console.log(`Test 5 [${ENV_NAME}]: Advance keyboard workflow completed\n`);
  281 |   });
  282 | 
  283 |   // ==========================================================================
  284 |   // TEST 6: SIGN A DOCUMENT VIA KEYBOARD
  285 |   // ==========================================================================
  286 | 
  287 |   sequentialTest("Test 6: Sign A Document via Keyboard", async ({ page }) => {
  288 |     await page.goto(`${ENV_URL}/e-signature`);
  289 |     await page.waitForTimeout(3000);
  290 |     console.log(`Test 6.0 [${ENV_NAME}]: Navigated to Signature module\n`);
  291 | 
  292 |     const signADocBtn = page.locator('button:has-text("Sign A Document")');
  293 |     await signADocBtn.waitFor({ state: "visible", timeout: 10000 });
  294 |     await signADocBtn.focus();
  295 |     await page.keyboard.press("Enter");
  296 |     await page.waitForTimeout(2000);
  297 |     console.log(`Test 6.1 [${ENV_NAME}]: Sign A Document via Enter\n`);
  298 | 
  299 |     await page.locator(LOCATORS.uploadInput).setInputFiles("test-data/template.pdf");
  300 |     await page.waitForTimeout(8000);
  301 |     console.log(`Test 6.2 [${ENV_NAME}]: File uploaded\n`);
  302 | 
  303 |     await page.locator(LOCATORS.envelopeNameInput).waitFor({ state: "visible", timeout: 30000 });
  304 |     await page.locator(LOCATORS.envelopeNameInput).focus();
  305 |     await page.keyboard.press("Control+a");
  306 |     await page.keyboard.type("Sign Doc Keyboard Test");
  307 |     console.log(`Test 6.3 [${ENV_NAME}]: Envelope name typed\n`);
  308 | 
  309 |     await page.locator(LOCATORS.addRecipientBtn).waitFor({ state: "visible", timeout: 10000 });
  310 |     await page.locator(LOCATORS.addRecipientBtn).focus();
  311 |     await page.keyboard.press("Enter");
  312 |     console.log(`Test 6.4 [${ENV_NAME}]: Add Recipient via Enter\n`);
  313 | 
  314 |     await page.locator(LOCATORS.prepareDocumentBtn).waitFor({ state: "visible", timeout: 10000 });
  315 |     await page.locator(LOCATORS.prepareDocumentBtn).focus();
  316 |     await page.keyboard.press("Enter");
  317 |     await page.waitForTimeout(5000);
  318 |     console.log(`Test 6.5 [${ENV_NAME}]: Prepare Document via Enter\n`);
  319 | 
  320 |     console.log(`Test 6 [${ENV_NAME}]: Sign A Document keyboard flow completed\n`);
  321 |   });
  322 | 
  323 |   // ==========================================================================
  324 |   // TEST 7: MENU AND DROPDOWN KEYBOARD NAVIGATION
  325 |   // ==========================================================================
  326 | 
  327 |   sequentialTest("Test 7: Menu and Dropdown Keyboard Navigation", async ({ page }) => {
  328 |     await page.goto(`${ENV_URL}/home`);
  329 |     await page.waitForTimeout(3000);
  330 |     console.log(`Test 7.0 [${ENV_NAME}]: Testing menu keyboard navigation\n`);
  331 | 
  332 |     const menuButton = page.locator(LOCATORS.myAppsMenu);
  333 |     await menuButton.waitFor({ state: "visible", timeout: 5000 });
  334 |     await menuButton.focus();
  335 |     console.log(`Test 7.1 [${ENV_NAME}]: Focused on menu button\n`);
  336 | 
  337 |     await page.keyboard.press("Space");
  338 |     await page.waitForTimeout(500);
  339 |     console.log(`Test 7.2 [${ENV_NAME}]: Space key pressed on menu\n`);
  340 | 
  341 |     await page.keyboard.press("ArrowDown");
  342 |     await page.waitForTimeout(200);
  343 |     const afterArrowDown = await page.evaluate(() => document.activeElement?.tagName);
  344 |     expect(afterArrowDown).toBeTruthy();
  345 |     console.log(`Test 7.3 [${ENV_NAME}]: ArrowDown moves in menu: ${afterArrowDown}\n`);
  346 | 
  347 |     await page.keyboard.press("ArrowUp");
  348 |     await page.waitForTimeout(200);
  349 |     console.log(`Test 7.4 [${ENV_NAME}]: ArrowUp moves in menu\n`);
  350 | 
  351 |     await page.keyboard.press("Escape");
  352 |     await page.waitForTimeout(500);
  353 |     console.log(`Test 7.5 [${ENV_NAME}]: Escape closes menu\n`);
  354 |   });
  355 | 
  356 |   // ==========================================================================
  357 |   // TEST 8: COMBINED KEYBOARD WORKFLOW
  358 |   // ==========================================================================
  359 | 
  360 |   sequentialTest("Test 8: Combined Keyboard Workflow", async ({ page }) => {
  361 |     await page.goto(`${ENV_URL}/home`);
  362 |     await page.waitForTimeout(3000);
  363 |     console.log(`Test 8.0 [${ENV_NAME}]: Testing complete keyboard workflow\n`);
  364 | 
  365 |     let signatureFound = false;
  366 |     for (let i = 0; i < 30; i++) {
  367 |       await page.keyboard.press("Tab");
  368 |       await page.waitForTimeout(100);
  369 |       const text = await page.evaluate(() => document.activeElement?.textContent);
  370 |       if (text?.includes("Signature")) {
```