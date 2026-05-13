# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\keyboardAccessibilityTest.stage.spec.ts >> ⌨️  Keyboard Navigation Suite - STAGE >> Test 4: Upload Document via Keyboard
- Location: tests\ui\keyboardAccessibilityTest.stage.spec.ts:161:3

# Error details

```
TimeoutError: locator.waitFor: Timeout 300000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Review Document & Sign")') to be visible

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e8]:
    - generic [ref=e10]:
      - generic [ref=e11]:
        - img [ref=e13] [cursor=pointer]: cancel
        - generic [ref=e15]: Keyboard Test
        - generic [ref=e18]:
          - generic [ref=e19] [cursor=pointer]:
            - img [ref=e20]: check_circle
            - generic [ref=e21]: Document Details
          - generic [ref=e23] [cursor=pointer]:
            - img [ref=e24]: check_circle
            - generic [ref=e25]: Add
          - generic [ref=e27] [cursor=pointer]:
            - generic [ref=e28]: "3"
            - generic [ref=e29]: Prepare
        - button "Send Document" [active] [ref=e32] [cursor=pointer]: Send Document
      - text: 
    - generic [ref=e43]:
      - generic [ref=e46]:
        - generic [ref=e47]:
          - generic [ref=e48]:
            - generic [ref=e49]:
              - text: Signatories
              - button [ref=e50] [cursor=pointer]:
                - img [ref=e52]: help_outline
            - generic [ref=e53]: Added 1/1
          - button "A Abu Shaleh Signatory" [ref=e57] [cursor=pointer]:
            - generic [ref=e58]:
              - generic [ref=e61]: A
              - generic [ref=e62]:
                - generic [ref=e65]: Abu Shaleh
                - generic [ref=e66]: Signatory
            - button [ref=e67]:
              - img [ref=e69]: arrow_drop_down
        - generic [ref=e70]:
          - generic [ref=e71]:
            - generic [ref=e72]:
              - generic [ref=e73]:
                - text: BASIC FIELDS
                - img [ref=e75]: drag_indicator
              - generic [ref=e76]:
                - generic [ref=e77]: Preview
                - switch [ref=e81]
            - generic [ref=e84]:
              - img [ref=e87] [cursor=pointer]: drag_indicator
              - generic [ref=e88]:
                - generic [ref=e89]:
                  - generic [ref=e90]: Signature
                  - generic [ref=e92]: "1"
                - img [ref=e93]: gesture
            - generic [ref=e94]:
              - img [ref=e97] [cursor=pointer]: drag_indicator
              - generic [ref=e98]:
                - generic [ref=e100]: Name
                - img [ref=e102]: person
            - generic [ref=e103]:
              - img [ref=e106] [cursor=pointer]: drag_indicator
              - generic [ref=e107]:
                - generic [ref=e109]: Date
                - img [ref=e111]: date_range
            - generic [ref=e112]:
              - img [ref=e115] [cursor=pointer]: drag_indicator
              - generic [ref=e116]:
                - generic [ref=e118]: IP Location
                - img [ref=e120]: map
            - generic [ref=e122]:
              - text: BLOCKS
              - img [ref=e124]: drag_indicator
            - generic [ref=e125]:
              - img [ref=e128] [cursor=pointer]: drag_indicator
              - generic [ref=e129]:
                - generic [ref=e131]: Textbox
                - img [ref=e133]: notes
            - generic [ref=e134]:
              - img [ref=e137] [cursor=pointer]: drag_indicator
              - generic [ref=e138]:
                - generic [ref=e140]: Envelope ID
                - img [ref=e142]: description
            - generic [ref=e144]:
              - text: OTHER FIELDS
              - img [ref=e146]: drag_indicator
            - generic [ref=e147]:
              - img [ref=e150] [cursor=pointer]: drag_indicator
              - generic [ref=e151]:
                - generic [ref=e153]: Form field
                - img [ref=e155]: text_fields
            - generic [ref=e156]:
              - img [ref=e159] [cursor=pointer]: drag_indicator
              - generic [ref=e160]:
                - generic [ref=e162]: Initials
                - img [ref=e164]: create
            - generic [ref=e165]:
              - img [ref=e168] [cursor=pointer]: drag_indicator
              - generic [ref=e169]:
                - generic [ref=e171]: Photo
                - img [ref=e173]: insert_photo
            - generic [ref=e174]:
              - img [ref=e177] [cursor=pointer]: drag_indicator
              - generic [ref=e178]:
                - generic [ref=e180]: Checkbox
                - img [ref=e182]: check_box
            - generic [ref=e183]:
              - img [ref=e186] [cursor=pointer]: drag_indicator
              - generic [ref=e187]:
                - generic [ref=e189]: Radio
                - img [ref=e191]: radio_button_checked
            - generic [ref=e192]:
              - img [ref=e195] [cursor=pointer]: drag_indicator
              - generic [ref=e196]:
                - generic [ref=e198]: Dropdown
                - img [ref=e200]: arrow_drop_down_circle
          - generic:
            - generic [ref=e201] [cursor=pointer]:
              - generic:
                - generic:
                  - generic:
                    - generic:
                      - generic: Signature
                      - generic: (Abu Shaleh)
            - generic [ref=e202] [cursor=pointer]:
              - generic:
                - generic:
                  - generic:
                    - textbox [disabled]: Name (Abu Shaleh)
            - generic [ref=e203] [cursor=pointer]:
              - generic:
                - generic:
                  - generic:
                    - textbox [disabled]: YYYY.MM.DD (Abu Shaleh)
            - generic [ref=e204] [cursor=pointer]:
              - generic:
                - generic:
                  - generic:
                    - textbox [disabled]: IP Location (Abu Shaleh)
            - generic [ref=e205] [cursor=pointer]:
              - generic:
                - generic:
                  - generic:
                    - textbox [disabled]: Form field (Abu Shaleh)
            - generic [ref=e207] [cursor=pointer]:
              - generic:
                - generic:
                  - generic:
                    - generic:
                      - generic: Initials
                      - generic: (Abu Shaleh)
            - generic [ref=e208] [cursor=pointer]:
              - generic:
                - generic:
                  - generic:
                    - generic: Photo
                    - generic: (Abu Shaleh)
                    - img: upload
            - generic [ref=e209] [cursor=pointer]:
              - generic:
                - generic:
                  - generic:
                    - textbox [disabled]: Envelope ID
            - generic [ref=e210] [cursor=pointer]:
              - generic:
                - generic:
                  - generic:
                    - generic:
                      - generic:
                        - generic:
                          - checkbox [disabled]
                          - generic:
                            - img
            - generic [ref=e211] [cursor=pointer]:
              - generic:
                - generic:
                  - generic:
                    - radiogroup:
                      - generic:
                        - generic:
                          - generic:
                            - radio [disabled]
            - generic [ref=e212] [cursor=pointer]:
              - generic:
                - generic:
                  - generic:
                    - generic:
                      - generic:
                        - generic:
                          - generic:
                            - listbox "Enter value":
                              - generic:
                                - generic:
                                  - generic: Enter value
      - generic [ref=e218]:
        - generic [ref=e219]:
          - generic [ref=e221]:
            - tablist [ref=e224]:
              - tab "template" [selected] [ref=e226] [cursor=pointer]:
                - generic [ref=e228]: template
            - generic:
              - tabpanel "template"
          - img [ref=e231] [cursor=pointer]: settings
        - generic [ref=e232]:
          - generic [ref=e233]:
            - img [ref=e234] [cursor=pointer]: first_page
            - img [ref=e235] [cursor=pointer]: keyboard_double_arrow_left
            - img [ref=e236] [cursor=pointer]: keyboard_arrow_left
            - textbox [ref=e237]: "1"
            - generic [ref=e238]: / 2
            - img [ref=e239] [cursor=pointer]: keyboard_arrow_right
            - img [ref=e240] [cursor=pointer]: keyboard_double_arrow_right
            - img [ref=e241] [cursor=pointer]: last_page
          - generic [ref=e242] [cursor=pointer]:
            - img [ref=e244]: description
            - img [ref=e246]: tab_unselected
          - generic [ref=e247]:
            - img [ref=e248] [cursor=pointer]: remove
            - combobox [ref=e249]:
              - option "50%"
              - option "80%"
              - option "100%" [selected]
              - option "125%"
              - option "150%"
              - option "200%"
            - img [ref=e250] [cursor=pointer]: add
        - generic [ref=e260]:
          - region "Page ⁨1⁩" [ref=e261]:
            - generic [ref=e263]:
              - generic: Contract Proposal for Quality Assurance Testing
              - generic: "Date: [Insert Date]"
              - generic: "[Your Name]"
              - generic: "[Your Address]"
              - generic: "[City, State, Zip Code]"
              - generic: "[Your Email]"
              - generic: "[Your Phone Number]"
              - generic: "[Client's Name]"
              - generic: "[Client's Company]"
              - generic: "[Client's Address]"
              - generic: "[City, State, Zip Code]"
              - generic: Dear [Client's Name],
              - generic: We are pleased to submit this proposal for Quality Assurance Testing services to ensure your product meets the highest standards of quality and reliability.
              - generic: "Scope of Services:"
              - generic: •
              - generic: Functional Testing
              - generic: •
              - generic: Performance Testing
              - generic: •
              - generic: Security Testing
              - generic: •
              - generic: User Acceptance Testing
              - generic: "Timeline:"
              - generic: The testing phase will commence on [Start Date] and conclude by [End Date].
            - generic [ref=e269] [cursor=pointer]:
              - generic [ref=e270]: Signature
              - generic [ref=e271]: (Abu Shaleh)
          - region "Page ⁨2⁩" [ref=e272]:
            - generic [ref=e274]:
              - generic: "Cost:"
              - generic: The total cost for our services will be [Insert Amount].
              - generic: We look forward to the opportunity to work with you and help enhance the quality of your product. Please feel free to reach out if you have any questions or need further information.
              - generic: Sincerely,
              - generic: "[Your Name]"
              - generic: "[Your Position]"
              - generic: "[Your Company]"
  - generic:
    - generic: 
  - generic:
    - generic:   
  - generic "Support" [ref=e276] [cursor=pointer]:
    - img [ref=e278]: contact_support
```

# Test source

```ts
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
  214 |     await page.waitForTimeout(1000);
  215 |     console.log(`Test 4.8 [${ENV_NAME}]: Scrolled to bottom\n`);
  216 | 
  217 |     const signatureField = page.locator(LOCATORS.signatureField);
  218 |     await signatureField.waitFor({ state: "visible", timeout: 60000 });
  219 |     await signatureField.evaluate((el: any) => el.scrollIntoView({ block: "center" }));
  220 |     await page.waitForTimeout(500);
  221 | 
  222 |     const documentArea = page.locator(LOCATORS.documentPageArea).last();
  223 |     await documentArea.evaluate((el: any) => el.scrollIntoView({ block: "center" }));
  224 |     await page.waitForTimeout(500);
  225 | 
  226 |     let docBox = null;
  227 |     let sigBox = null;
  228 |     for (let attempt = 0; attempt < 5; attempt++) {
  229 |       sigBox = await signatureField.boundingBox();
  230 |       docBox = await documentArea.boundingBox();
  231 |       if (!sigBox) {
  232 |         sigBox = await signatureField.evaluate((el: any) => {
  233 |           const r = el.getBoundingClientRect();
  234 |           return r.width ? { x: r.x, y: r.y, width: r.width, height: r.height } : null;
  235 |         });
  236 |       }
  237 |       if (!docBox) {
  238 |         docBox = await documentArea.evaluate((el: any) => {
  239 |           const r = el.getBoundingClientRect();
  240 |           return r.width ? { x: r.x, y: r.y, width: r.width, height: r.height } : null;
  241 |         });
  242 |       }
  243 |       if (sigBox && docBox) break;
  244 |       await page.waitForTimeout(1000);
  245 |     }
  246 | 
  247 |     if (sigBox && docBox) {
  248 |       await page.mouse.move(sigBox.x + sigBox.width / 2, sigBox.y + sigBox.height / 2);
  249 |       await page.mouse.down();
  250 |       await page.mouse.move(docBox.x + docBox.width / 2, docBox.y + docBox.height - 100, {
  251 |         steps: 10,
  252 |       });
  253 |       await page.mouse.up();
  254 |       await page.waitForTimeout(2000);
  255 |       console.log(`Test 4.9 [${ENV_NAME}]: Signature dragged\n`);
  256 |     } else {
  257 |       console.log(`Test 4.9 [${ENV_NAME}]: SKIPPED - Could not get positions\n`);
  258 |     }
  259 | 
  260 |     const SendButton = page.locator(LOCATORS.sendDocumentBtn);
  261 |     await SendButton.waitFor({ state: "visible", timeout: 10000 });
  262 |     await SendButton.click();
  263 |     console.log(`Test 4.10 [${ENV_NAME}]: Send Document clicked\n`);
  264 | 
  265 |     await page.waitForTimeout(3000);
  266 |     const dialog = page.locator('text="Are you sure?"');
  267 |     if (await dialog.isVisible()) {
  268 |       console.log(`Test 4.11 [${ENV_NAME}]: Confirmation dialog appeared\n`);
  269 |       const confirmBtn = page.locator(LOCATORS.confirmSendBtn);
  270 |       await confirmBtn.waitFor({ state: "visible", timeout: 10000 });
  271 |       await page.waitForFunction(
  272 |         () => {
  273 |           const btn = document.querySelector('button[aria-label="Save"]') as HTMLButtonElement;
  274 |           return btn && !btn.disabled;
  275 |         },
  276 |         { timeout: 60000 }
  277 |       );
  278 |       await confirmBtn.click();
  279 |       await page.waitForTimeout(500);
  280 |       console.log(`Test 4.12 [${ENV_NAME}]: Confirm clicked\n`);
  281 |     } else {
  282 |       console.log(`Test 4.11 [${ENV_NAME}]: INFO - Document sent directly\n`);
  283 |     }
  284 | 
  285 |     await page.locator(LOCATORS.documentSentSuccess).waitFor({ state: "visible", timeout: 30000 });
  286 |     console.log(`Test 4.13 [${ENV_NAME}]: Document rollout completed\n`);
  287 | 
  288 |     await page.waitForTimeout(3000);
  289 |     await page
  290 |       .locator(LOCATORS.reviewDocumentAndSignBtn)
> 291 |       .waitFor({ state: "visible", timeout: 300000 });
      |        ^ TimeoutError: locator.waitFor: Timeout 300000ms exceeded.
  292 |     await page.locator(LOCATORS.reviewDocumentAndSignBtn).click();
  293 |     console.log(`Test 4.14 [${ENV_NAME}]: Review Document & Sign clicked\n`);
  294 | 
  295 |     await page.locator(LOCATORS.signatorySignaturePlaceholder).click();
  296 |     console.log(`Test 4.15 [${ENV_NAME}]: Signature placeholder clicked\n`);
  297 | 
  298 |     await page.locator(LOCATORS.finishBtn).click();
  299 |     console.log(`Test 4.16 [${ENV_NAME}]: Finish clicked\n`);
  300 | 
  301 |     await page.locator(LOCATORS.signCheckbox).waitFor({ state: "visible", timeout: 30000 });
  302 |     await page.locator(LOCATORS.signCheckbox).click();
  303 |     console.log(`Test 4.17 [${ENV_NAME}]: Checkbox clicked\n`);
  304 | 
  305 |     await page
  306 |       .locator(LOCATORS.signThisContractNowBtn)
  307 |       .waitFor({ state: "visible", timeout: 30000 });
  308 |     await page.locator(LOCATORS.signThisContractNowBtn).click();
  309 |     console.log(`Test 4.18 [${ENV_NAME}]: Sign This Contract Now clicked\n`);
  310 | 
  311 |     await page.waitForTimeout(3000);
  312 | 
  313 |     console.log(`Test 4 [${ENV_NAME}]: Upload and sign via keyboard completed\n`);
  314 |   });
  315 | 
  316 |   // ==========================================================================
  317 |   // TEST 5: SIGNATURE ADVANCE WORKFLOW VIA KEYBOARD
  318 |   // ==========================================================================
  319 | 
  320 |   sequentialTest("Test 5: Signature Advance Workflow via Keyboard", async ({ page }) => {
  321 |     await page.goto(`${ENV_URL}/e-signature`);
  322 |     await page.waitForTimeout(5000);
  323 |     console.log(`Test 5.0 [${ENV_NAME}]: Navigated to Signature module\n`);
  324 | 
  325 |     const closeAlert = page.locator(LOCATORS.closeAlertBtn).first();
  326 |     if (await closeAlert.isVisible()) {
  327 |       await closeAlert.click();
  328 |       await page.waitForTimeout(500);
  329 |     }
  330 | 
  331 |     let uploadAreaVisible = await page.locator(LOCATORS.uploadArea).isVisible();
  332 |     if (!uploadAreaVisible) {
  333 |       await page.reload();
  334 |       await page.waitForTimeout(5000);
  335 |       uploadAreaVisible = await page.locator(LOCATORS.uploadArea).isVisible();
  336 |     }
  337 |     if (!uploadAreaVisible) {
  338 |       console.log(`Test 5.1 [${ENV_NAME}]: SKIPPED - Upload area not visible\n`);
  339 |       console.log(`Test 5 [${ENV_NAME}]: SKIPPED - Advance workflow not available\n`);
  340 |       return;
  341 |     }
  342 | 
  343 |     await page.locator(LOCATORS.uploadArea).waitFor({ state: "visible", timeout: 10000 });
  344 |     console.log(`Test 5.1 [${ENV_NAME}]: Upload area is visible\n`);
  345 | 
  346 |     await page.locator(LOCATORS.uploadInput).setInputFiles("test-data/template.pdf");
  347 |     await page.waitForTimeout(8000);
  348 |     console.log(`Test 5.2 [${ENV_NAME}]: File uploaded\n`);
  349 | 
  350 |     await page.locator(LOCATORS.envelopeNameInput).waitFor({ state: "visible", timeout: 30000 });
  351 |     await page.locator(LOCATORS.envelopeNameInput).fill("Advance Keyboard Test");
  352 | 
  353 |     await page.locator(LOCATORS.signatureTypeAdvance).click();
  354 |     await page.locator(LOCATORS.signatureTypeRadioAdvanced).click();
  355 |     console.log(`Test 5.3 [${ENV_NAME}]: Signature type selected\n`);
  356 | 
  357 |     await page.locator(LOCATORS.addRecipientBtn).waitFor({ state: "visible", timeout: 10000 });
  358 |     await page.locator(LOCATORS.addRecipientBtn).click();
  359 |     await page.waitForTimeout(3000);
  360 |     console.log(`Test 5.4 [${ENV_NAME}]: Add Recipient clicked\n`);
  361 | 
  362 |     await page.locator(LOCATORS.addRecipientsPage).waitFor({ state: "visible", timeout: 15000 });
  363 |     await expect(page.locator(LOCATORS.addRecipientsPage)).toBeVisible();
  364 |     console.log(`Test 5.5 [${ENV_NAME}]: Add Recipients page visible\n`);
  365 | 
  366 |     await page.locator(LOCATORS.prepareDocumentBtn).waitFor({ state: "visible", timeout: 10000 });
  367 |     await page.locator(LOCATORS.prepareDocumentBtn).click();
  368 |     console.log(`Test 5.6 [${ENV_NAME}]: Prepare Document clicked\n`);
  369 | 
  370 |     await page.waitForTimeout(5000);
  371 |     console.log(`Test 5.7 [${ENV_NAME}]: Document loaded\n`);
  372 | 
  373 |     const signatureField5 = page.locator(LOCATORS.signatureField);
  374 |     await signatureField5.waitFor({ state: "visible", timeout: 30000 });
  375 |     await signatureField5.evaluate((el: any) => el.scrollIntoView({ block: "center" }));
  376 | 
  377 |     const documentArea5 = page.locator(LOCATORS.documentPageArea).last();
  378 |     await documentArea5.evaluate((el: any) => el.scrollIntoView({ block: "center" }));
  379 |     await page.waitForTimeout(1000);
  380 | 
  381 |     let docBox5 = await documentArea5.boundingBox();
  382 |     let sigBox5 = await signatureField5.boundingBox();
  383 | 
  384 |     if (!sigBox5) {
  385 |       sigBox5 = await signatureField5.evaluate((el: any) => {
  386 |         const r = el.getBoundingClientRect();
  387 |         return r.width ? { x: r.x, y: r.y, width: r.width, height: r.height } : null;
  388 |       });
  389 |     }
  390 |     if (!docBox5) {
  391 |       docBox5 = await documentArea5.evaluate((el: any) => {
```