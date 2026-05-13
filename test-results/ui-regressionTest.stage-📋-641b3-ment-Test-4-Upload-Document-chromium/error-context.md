# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\regressionTest.stage.spec.ts >> 📋 Regression Suite - STAGE Environment >> Test 4: Upload Document
- Location: tests\ui\regressionTest.stage.spec.ts:214:3

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
      - button [ref=e12] [cursor=pointer]:
        - img [ref=e14]: menu
      - generic [ref=e15]:
        - link [ref=e19] [cursor=pointer]:
          - /url: /home
        - generic [ref=e20]:
          - button [ref=e21] [cursor=pointer]:
            - img [ref=e23]: 
          - button "Org logo User profile" [ref=e24] [cursor=pointer]:
            - generic [ref=e26]:
              - img "Org logo" [ref=e28]
              - img "User profile" [ref=e30]
    - generic [ref=e34]:
      - generic [ref=e38]:
        - button [ref=e46] [cursor=pointer]
        - link [ref=e52] [cursor=pointer]:
          - /url: /e-signature
          - img [ref=e56]: home
        - generic [ref=e58]:
          - generic [ref=e62]:
            - link [ref=e65] [cursor=pointer]:
              - /url: /e-signature/contracts
              - img [ref=e69]: send
            - link [ref=e71] [cursor=pointer]:
              - /url: /e-signature/received
              - img [ref=e75]: inbox
            - link [ref=e77] [cursor=pointer]:
              - /url: /e-signature/organizationals
              - img [ref=e81]: domain
            - link [ref=e84] [cursor=pointer]:
              - /url: /e-signature/drafts
              - img [ref=e88]: description
            - link [ref=e91] [cursor=pointer]:
              - /url: /e-signature/archived
              - img [ref=e95]: archive
          - separator [ref=e96]
        - generic [ref=e99]:
          - generic [ref=e103]:
            - link [ref=e105] [cursor=pointer]:
              - /url: /e-signature/template
              - img [ref=e109]: wysiwyg
            - link [ref=e111] [cursor=pointer]:
              - /url: /e-signature/template/drafts
              - img [ref=e115]: description
            - link [ref=e117] [cursor=pointer]:
              - /url: /e-signature/template/archived
              - img [ref=e121]: archive
          - separator [ref=e122]
        - img [ref=e132] [cursor=pointer]: card_giftcard
      - generic [ref=e135]:
        - generic [ref=e136]:
          - generic [ref=e137]:
            - link "Yet To Sign 52" [ref=e138] [cursor=pointer]:
              - /url: /e-signature/yettosign
              - generic [ref=e141]: Yet To Sign
              - generic [ref=e142]:
                - generic [ref=e143]: "52"
                - img [ref=e145]: trending_flat
            - generic [ref=e146] [cursor=pointer]:
              - paragraph [ref=e147]: "Organizational :"
              - paragraph [ref=e148]: "0"
              - img [ref=e149]: trending_flat
          - generic [ref=e150]:
            - link "Yet To Review 0" [ref=e151] [cursor=pointer]:
              - /url: /e-signature/yettoreview
              - generic [ref=e154]: Yet To Review
              - generic [ref=e155]:
                - generic [ref=e156]: "0"
                - img [ref=e158]: trending_flat
            - generic [ref=e159] [cursor=pointer]:
              - paragraph [ref=e160]: "Organizational :"
              - paragraph [ref=e161]: "0"
              - img [ref=e162]: trending_flat
          - generic [ref=e163]:
            - link "Pending 462" [ref=e164] [cursor=pointer]:
              - /url: /e-signature/pending
              - generic [ref=e167]: Pending
              - generic [ref=e168]:
                - generic [ref=e169]: "462"
                - img [ref=e171]: trending_flat
            - generic [ref=e172] [cursor=pointer]:
              - paragraph [ref=e173]: "Organizational :"
              - paragraph [ref=e174]: "1"
              - img [ref=e175]: trending_flat
          - generic [ref=e176]:
            - link "Completed 63" [ref=e177] [cursor=pointer]:
              - /url: /e-signature/completed
              - generic [ref=e180]: Completed
              - generic [ref=e181]:
                - generic [ref=e182]: "63"
                - img [ref=e184]: trending_flat
            - generic [ref=e185] [cursor=pointer]:
              - paragraph [ref=e186]: "Organizational :"
              - paragraph [ref=e187]: "2"
              - img [ref=e188]: trending_flat
        - generic [ref=e192]:
          - generic [ref=e194]: What can I help with?
          - search [ref=e195]:
            - textbox "Chat input" [ref=e196]:
              - /placeholder: Ask anything
            - button [ref=e197] [cursor=pointer]:
              - img [ref=e199]: arrow_upward
        - generic [ref=e203]:
          - generic [ref=e204]:
            - button "Drag and drop your documents here (single shipping) PDF or DOC/DOCX (maximum 200 MB in total per process for individual or multiple documents)":
              - generic:
                - generic:
                  - img
                  - paragraph: Drag and drop your documents here (single shipping)
                  - paragraph: PDF or DOC/DOCX (maximum 200 MB in total per process for individual or multiple documents)
                  - progressbar:
                    - img
          - generic [ref=e206]: template.pdf (99.43 KB)
  - generic:
    - generic: 
  - generic:
    - generic:   
  - generic "Support" [ref=e207] [cursor=pointer]:
    - img [ref=e209]: contact_support
```

# Test source

```ts
  150 |     // --- YET TO REVIEW CARD ---
  151 |     const yetToReviewCard = page.locator(LOCATORS.yetToReviewCard);
  152 |     await yetToReviewCard.scrollIntoViewIfNeeded();
  153 |     await yetToReviewCard.waitFor({ state: "visible", timeout: 5000 });
  154 | 
  155 |     if (await yetToReviewCard.isVisible()) {
  156 |       await yetToReviewCard.click();
  157 |       await page.waitForTimeout(2000);
  158 |       console.log(`Test 3.2 [${ENV_NAME}]: Yet To Review clicked and details page opened\n`);
  159 |       await page.goto(`${ENV_URL}/e-signature`);
  160 |       await page.waitForTimeout(2000);
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
  172 |       await page.waitForTimeout(2000);
  173 |       console.log(`Test 3.3 [${ENV_NAME}]: Pending clicked and details page opened\n`);
  174 |       await page.goto(`${ENV_URL}/e-signature`);
  175 |       await page.waitForTimeout(2000);
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
  187 |       await page.waitForTimeout(2000);
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
  217 |     await page.waitForTimeout(3000);
  218 |     console.log(`Test 4.0 [${ENV_NAME}]: Navigated to Signature module\n`);
  219 | 
  220 |     // --- Close any existing alert dialogs ---
  221 |     const closeAlert = page.locator(LOCATORS.closeAlertBtn).first();
  222 |     if (await closeAlert.isVisible()) {
  223 |       await closeAlert.click();
  224 |       await page.waitForTimeout(500);
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
  246 |     await page.waitForTimeout(5000);
  247 |     console.log(`Test 4.3 [${ENV_NAME}]: File uploaded\n`);
  248 | 
  249 |     // --- STEP 4: Fill Envelope Name ---
> 250 |     await page.locator(LOCATORS.envelopeNameInput).waitFor({ state: "visible", timeout: 10000 });
      |                                                    ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  251 |     await page.locator(LOCATORS.envelopeNameInput).fill("Automation Test");
  252 |     console.log(`Test 4.4 [${ENV_NAME}]: Envelope name set\n`);
  253 | 
  254 |     // --- STEP 5: Add Recipient ---
  255 |     await page.locator(LOCATORS.addRecipientBtn).waitFor({ state: "visible", timeout: 10000 });
  256 |     await page.locator(LOCATORS.addRecipientBtn).click();
  257 |     console.log(`Test 4.5 [${ENV_NAME}]: Add Recipient clicked\n`);
  258 | 
  259 |     // --- STEP 6: Verify Add Recipients Page ---
  260 |     await page.locator(LOCATORS.addRecipientsPage).waitFor({ state: "visible", timeout: 10000 });
  261 |     await expect(page.locator(LOCATORS.addRecipientsPage)).toBeVisible();
  262 |     console.log(`Test 4.6 [${ENV_NAME}]: Add Recipients page visible\n`);
  263 | 
  264 |     // --- STEP 7: Prepare Document ---
  265 |     await page.locator(LOCATORS.prepareDocumentBtn).waitFor({ state: "visible", timeout: 10000 });
  266 |     await page.locator(LOCATORS.prepareDocumentBtn).click();
  267 |     console.log(`Test 4.7 [${ENV_NAME}]: Prepare Document clicked\n`);
  268 | 
  269 |     // --- STEP 8: Wait for Document to Load ---
  270 |     await page.waitForTimeout(3000);
  271 |     console.log(`Test 4.8 [${ENV_NAME}]: Document loaded\n`);
  272 | 
  273 |     // --- STEP 9: Scroll to Bottom of Document ---
  274 |     await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  275 |     await page.waitForTimeout(1000);
  276 |     console.log(`Test 4.9 [${ENV_NAME}]: Scrolled to bottom\n`);
  277 | 
  278 |     // --- STEP 10: Drag Signature to PDF ---
  279 |     const signatureField = page.locator(LOCATORS.signatureField);
  280 |     await signatureField.waitFor({ state: "visible", timeout: 10000 });
  281 | 
  282 |     const documentArea = page.locator(LOCATORS.documentPageArea).last();
  283 |     const docBox = await documentArea.boundingBox();
  284 |     const sigBox = await signatureField.boundingBox();
  285 | 
  286 |     // Perform drag and drop operation
  287 |     if (sigBox && docBox) {
  288 |       await page.mouse.move(sigBox.x + sigBox.width / 2, sigBox.y + sigBox.height / 2);
  289 |       await page.mouse.down();
  290 |       await page.mouse.move(docBox.x + docBox.width / 2, docBox.y + docBox.height - 100, {
  291 |         steps: 10, // Smooth movement
  292 |       });
  293 |       await page.mouse.up();
  294 |       await page.waitForTimeout(2000);
  295 |       console.log(`Test 4.10 [${ENV_NAME}]: Signature dragged\n`);
  296 |     } else {
  297 |       console.log(`Test 4.10 [${ENV_NAME}]: SKIPPED - Could not get positions\n`);
  298 |     }
  299 | 
  300 |     // --- STEP 12: Send Document ---
  301 |     const SendButton = page.locator(LOCATORS.sendDocumentBtn);
  302 |     await SendButton.waitFor({ state: "visible", timeout: 10000 });
  303 |     await SendButton.click();
  304 |     console.log(`Test 4.11 [${ENV_NAME}]: Send Document clicked\n`);
  305 | 
  306 |     // --- STEP 12: Handle Confirmation Dialog ---
  307 |     await page.waitForTimeout(3000);
  308 |     const dialog = page.locator('text="Are you sure?"');
  309 |     if (await dialog.isVisible()) {
  310 |       console.log(`Test 4.12 [${ENV_NAME}]: Confirmation dialog appeared\n`);
  311 | 
  312 |       // Wait for Confirm button to be enabled (it may be disabled initially)
  313 |       const confirmBtn = page.locator(LOCATORS.confirmSendBtn);
  314 |       await confirmBtn.waitFor({ state: "visible", timeout: 10000 });
  315 |       await page.waitForFunction(
  316 |         () => {
  317 |           const btn = document.querySelector('button[aria-label="Save"]') as HTMLButtonElement;
  318 |           return btn && !btn.disabled;
  319 |         },
  320 |         { timeout: 60000 }
  321 |       );
  322 |       await confirmBtn.click();
  323 |       await page.waitForTimeout(500);
  324 |       console.log(`Test 4.13 [${ENV_NAME}]: Confirm clicked\n`);
  325 |     } else {
  326 |       console.log(`Test 4.12 [${ENV_NAME}]: INFO - Document sent directly\n`);
  327 |     }
  328 | 
  329 |     // --- STEP 13: Wait for Document Rollout Completion ---
  330 |     // Rollout process: Signatures applied → Texts applied → Emails sent
  331 |     await page.locator(LOCATORS.documentSentSuccess).waitFor({ state: "visible", timeout: 30000 });
  332 |     console.log(`Test 4.14 [${ENV_NAME}]: Document rollout completed\n`);
  333 | 
  334 |     // --- STEP 14: Review and Sign ---
  335 |     await page.waitForTimeout(3000);
  336 |     await page
  337 |       .locator(LOCATORS.reviewDocumentAndSignBtn)
  338 |       .waitFor({ state: "visible", timeout: 300000 });
  339 |     await page.locator(LOCATORS.reviewDocumentAndSignBtn).click();
  340 |     console.log(`Test 4.15 [${ENV_NAME}]: Review Document & Sign clicked\n`);
  341 | 
  342 |     // --- STEP 15: Click Signature Placeholder ---
  343 |     await page.locator(LOCATORS.signatorySignaturePlaceholder).click();
  344 |     console.log(`Test 4.16 [${ENV_NAME}]: Signature placeholder clicked\n`);
  345 | 
  346 |     // --- STEP 16: Click Finish ---
  347 |     await page.locator(LOCATORS.finishBtn).click();
  348 |     console.log(`Test 4.17 [${ENV_NAME}]: Finish clicked\n`);
  349 | 
  350 |     // --- STEP 17: Accept Terms (Click Checkbox) ---
```