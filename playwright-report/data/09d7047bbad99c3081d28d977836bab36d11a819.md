# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\keyboardAccessibilityTest.stage.spec.ts >> ⌨️  Keyboard Navigation Suite - STAGE >> Test 6: Sign A Document via Keyboard
- Location: tests\ui\keyboardAccessibilityTest.stage.spec.ts:436:3

# Error details

```
TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Prepare Document")') to be visible

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e8]:
    - generic [ref=e10]:
      - generic [ref=e11]:
        - img [ref=e13] [cursor=pointer]: cancel
        - generic [ref=e15]: New Document
        - generic [ref=e18]:
          - generic [ref=e19] [cursor=pointer]:
            - generic [ref=e20]: "1"
            - generic [ref=e21]: Document Details
          - generic [ref=e23]:
            - generic [ref=e24]: "2"
            - generic [ref=e25]: Add
          - generic [ref=e27]:
            - generic [ref=e28]: "3"
            - generic [ref=e29]: Prepare
        - generic [ref=e31]:
          - button "Add Recipient" [disabled]: Add Recipient
      - text: 
    - generic [ref=e37]:
      - progressbar [ref=e38]:
        - img [ref=e39]
      - generic [ref=e45]:
        - generic:
          - generic:
            - heading "Document Details" [level=1]
            - paragraph: Assign a name to the envelope and select the access rights, storage location, and shipping method for the document.
          - generic:
            - generic:
              - generic:
                - generic: Upload Document
                - button:
                  - generic:
                    - img: help_outline
              - generic:
                - generic:
                  - generic:
                    - button "template.pdf 99.43 KB Upload From Device":
                      - generic:
                        - generic:
                          - generic:
                            - generic:
                              - generic:
                                - generic:
                                  - generic:
                                    - img: drag_indicator
                                    - generic:
                                      - generic: template.pdf
                                      - generic: 99.43 KB
                                  - generic:
                                    - button:
                                      - generic:
                                        - img: edit
                                    - button:
                                      - generic:
                                        - img: close
                          - generic:
                            - button "Upload From Device":
                              - generic:
                                - paragraph: Upload From Device
                            - button:
                              - generic:
                                - img: keyboard_arrow_down
            - generic:
              - generic:
                - heading "Name of Envelope" [level=1]
                - button:
                  - generic:
                    - img: help_outline
              - generic:
                - generic:
                  - generic:
                    - generic:
                      - textbox "Enter contract name": Sign Doc Keyboard Test
            - generic:
              - generic:
                - heading "Document Type" [level=1]
                - button:
                  - generic:
                    - img: help_outline
              - generic:
                - button "Personal Document": Personal Document
                - generic:
                  - button "Organizational Document": Organizational Document
            - generic:
              - generic:
                - heading "Shipping method" [level=1]
                - button:
                  - generic:
                    - img: help_outline
              - generic:
                - button "Single Shipping": Single Shipping
                - button "Bulk Documents": Bulk Documents
            - generic:
              - generic:
                - heading "Signature Type" [level=1]
                - button:
                  - generic:
                    - img: help_outline
              - generic:
                - generic:
                  - generic:
                    - generic:
                      - generic:
                        - button "Simple":
                          - generic:
                            - generic:
                              - button:
                                - img: gesture
                            - text: Simple
                      - generic:
                        - button "Simple+":
                          - generic:
                            - generic:
                              - button:
                                - img: gesture
                            - text: Simple+
                      - generic:
                        - button "Advanced":
                          - generic:
                            - generic:
                              - button:
                                - img: https
                            - text: Advanced
                      - generic:
                        - button "Qualified":
                          - generic:
                            - generic:
                              - button:
                                - img: verified_user
                            - text: Qualified
                      - generic:
                        - button "Web3 on Fantom":
                          - generic:
                            - generic:
                              - button:
                                - img: extension
                            - text: Web3 on Fantom
                      - generic:
                        - button "DHI SSI Signature":
                          - generic:
                            - generic:
                              - button:
                                - img: badge
                            - text: DHI SSI Signature
                      - generic:
                        - button "Basic for BD":
                          - generic:
                            - generic:
                              - button:
                                - img: badge
                            - text: Basic for BD
                    - generic:
                      - paragraph: The simple e-signature ensures document integrity and traceability by adding and storing user log within SELISE Signature but does not authenticate the signatory via two-factor authentication and no certificate is added.
            - generic:
              - generic:
                - heading "Save this contract to" [level=1]
                - button:
                  - generic:
                    - img: help_outline
              - generic [ref=e46] [cursor=pointer]:
                - img [ref=e48]: folder
                - generic [ref=e50]: My Contracts
  - generic:
    - generic: 
  - generic:
    - generic:   
  - generic "Support" [ref=e53] [cursor=pointer]:
    - img [ref=e55]: contact_support
  - generic [ref=e56]:
    - generic:
      - alert
    - alert [ref=e58]:
      - generic [ref=e60]:
        - img [ref=e61]: check_circle
        - generic [ref=e63]: Document added successfully
        - button [ref=e64] [cursor=pointer]:
          - img [ref=e66]: close
```

# Test source

```ts
  361 | 
  362 |     await page.waitForTimeout(5000);
  363 |     console.log(`Test 5.7 [${ENV_NAME}]: Document loaded\n`);
  364 | 
  365 |     const signatureField5 = page.locator(LOCATORS.signatureField);
  366 |     await signatureField5.waitFor({ state: "visible", timeout: 10000 });
  367 |     await signatureField5.scrollIntoViewIfNeeded();
  368 | 
  369 |     const documentArea5 = page.locator(LOCATORS.documentPageArea).last();
  370 |     await documentArea5.scrollIntoViewIfNeeded();
  371 |     await page.waitForTimeout(1000);
  372 | 
  373 |     const docBox5 = await documentArea5.boundingBox();
  374 |     const sigBox5 = await signatureField5.boundingBox();
  375 | 
  376 |     if (sigBox5 && docBox5) {
  377 |       await page.mouse.move(sigBox5.x + sigBox5.width / 2, sigBox5.y + sigBox5.height / 2);
  378 |       await page.mouse.down();
  379 |       await page.mouse.move(docBox5.x + docBox5.width / 2, docBox5.y + docBox5.height - 100, {
  380 |         steps: 10,
  381 |       });
  382 |       await page.mouse.up();
  383 |       await page.waitForTimeout(2000);
  384 |       console.log(`Test 5.8 [${ENV_NAME}]: Signature dragged\n`);
  385 |     } else {
  386 |       console.log(`Test 5.8 [${ENV_NAME}]: SKIPPED - Could not get positions\n`);
  387 |     }
  388 | 
  389 |     const SendButton5 = page.locator(LOCATORS.sendDocumentBtn);
  390 |     await SendButton5.waitFor({ state: "visible", timeout: 10000 });
  391 |     await page.waitForFunction(
  392 |       () => {
  393 |         const btns = Array.from(document.querySelectorAll("button"));
  394 |         const sendBtn = btns.find((b: any) => b.textContent?.includes("Send Document"));
  395 |         return sendBtn && !sendBtn.disabled;
  396 |       },
  397 |       { timeout: 60000 }
  398 |     );
  399 |     await SendButton5.click();
  400 |     console.log(`Test 5.9 [${ENV_NAME}]: Send Document clicked\n`);
  401 | 
  402 |     await page.waitForTimeout(3000);
  403 |     const dialog5 = page.locator('text="Are you sure?"');
  404 |     if (await dialog5.isVisible()) {
  405 |       console.log(`Test 5.10 [${ENV_NAME}]: Confirmation dialog appeared\n`);
  406 |       const confirmBtn5 = page.locator(LOCATORS.confirmSendBtn);
  407 |       await confirmBtn5.waitFor({ state: "visible", timeout: 10000 });
  408 |       await page.waitForFunction(
  409 |         () => {
  410 |           const btn = document.querySelector('button[aria-label="Save"]') as HTMLButtonElement;
  411 |           return btn && !btn.disabled;
  412 |         },
  413 |         { timeout: 60000 }
  414 |       );
  415 |       await confirmBtn5.click();
  416 |       await page.waitForTimeout(500);
  417 |       console.log(`Test 5.11 [${ENV_NAME}]: Confirm clicked\n`);
  418 |       await dialog5.waitFor({ state: "hidden", timeout: 10000 });
  419 |       await page.waitForTimeout(1000);
  420 |       console.log(`Test 5.11.1 [${ENV_NAME}]: Dialog closed\n`);
  421 |     } else {
  422 |       console.log(`Test 5.10 [${ENV_NAME}]: INFO - Document sent directly\n`);
  423 |     }
  424 | 
  425 |     await page.waitForTimeout(3000);
  426 |     await page.locator(LOCATORS.documentSentSuccess).waitFor({ state: "visible", timeout: 30000 });
  427 |     console.log(`Test 5.12 [${ENV_NAME}]: Document rollout completed\n`);
  428 | 
  429 |     console.log(`Test 5 [${ENV_NAME}]: Advance keyboard workflow completed\n`);
  430 |   });
  431 | 
  432 |   // ==========================================================================
  433 |   // TEST 6: SIGN A DOCUMENT VIA KEYBOARD
  434 |   // ==========================================================================
  435 | 
  436 |   sequentialTest("Test 6: Sign A Document via Keyboard", async ({ page }) => {
  437 |     await page.goto(`${ENV_URL}/e-signature`);
  438 |     await page.waitForTimeout(3000);
  439 |     console.log(`Test 6.0 [${ENV_NAME}]: Navigated to Signature module\n`);
  440 | 
  441 |     const signADocBtn = page.locator('button:has-text("Sign A Document")');
  442 |     await signADocBtn.waitFor({ state: "visible", timeout: 10000 });
  443 |     await signADocBtn.click();
  444 |     await page.waitForTimeout(2000);
  445 |     console.log(`Test 6.1 [${ENV_NAME}]: Sign A Document clicked\n`);
  446 | 
  447 |     await page.locator(LOCATORS.uploadInput).setInputFiles("test-data/template.pdf");
  448 |     await page.waitForTimeout(8000);
  449 |     console.log(`Test 6.2 [${ENV_NAME}]: File uploaded\n`);
  450 | 
  451 |     await page.locator(LOCATORS.envelopeNameInput).waitFor({ state: "visible", timeout: 30000 });
  452 |     await page.locator(LOCATORS.envelopeNameInput).focus();
  453 |     await page.keyboard.press("Control+a");
  454 |     await page.keyboard.type("Sign Doc Keyboard Test");
  455 |     console.log(`Test 6.3 [${ENV_NAME}]: Envelope name typed\n`);
  456 | 
  457 |     await page.locator(LOCATORS.addRecipientBtn).waitFor({ state: "visible", timeout: 10000 });
  458 |     await page.locator(LOCATORS.addRecipientBtn).click();
  459 |     console.log(`Test 6.4 [${ENV_NAME}]: Add Recipient clicked\n`);
  460 | 
> 461 |     await page.locator(LOCATORS.prepareDocumentBtn).waitFor({ state: "visible", timeout: 10000 });
      |                                                     ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  462 |     await page.locator(LOCATORS.prepareDocumentBtn).click();
  463 |     await page.waitForTimeout(5000);
  464 |     console.log(`Test 6.5 [${ENV_NAME}]: Prepare Document clicked\n`);
  465 | 
  466 |     const signatureField6 = page.locator(LOCATORS.signatureField);
  467 |     await signatureField6.waitFor({ state: "visible", timeout: 10000 });
  468 |     await signatureField6.scrollIntoViewIfNeeded();
  469 | 
  470 |     const documentArea6 = page.locator(LOCATORS.documentPageArea).last();
  471 |     await documentArea6.scrollIntoViewIfNeeded();
  472 |     await page.waitForTimeout(1000);
  473 | 
  474 |     const docBox6 = await documentArea6.boundingBox();
  475 |     const sigBox6 = await signatureField6.boundingBox();
  476 | 
  477 |     if (sigBox6 && docBox6) {
  478 |       await page.mouse.move(sigBox6.x + sigBox6.width / 2, sigBox6.y + sigBox6.height / 2);
  479 |       await page.mouse.down();
  480 |       await page.mouse.move(docBox6.x + docBox6.width / 2, docBox6.y + docBox6.height - 100, {
  481 |         steps: 10,
  482 |       });
  483 |       await page.mouse.up();
  484 |       await page.waitForTimeout(2000);
  485 |       console.log(`Test 6.6 [${ENV_NAME}]: Signature dragged\n`);
  486 |     } else {
  487 |       console.log(`Test 6.6 [${ENV_NAME}]: SKIPPED - Could not get positions\n`);
  488 |     }
  489 | 
  490 |     const sendButton6 = page.locator('button:has-text("Send Document")');
  491 |     await sendButton6.waitFor({ state: "visible", timeout: 10000 });
  492 |     await sendButton6.click();
  493 |     await page.waitForTimeout(5000);
  494 |     console.log(`Test 6.7 [${ENV_NAME}]: Send Document clicked\n`);
  495 | 
  496 |     const dialog6 = page.locator('text="Are you sure?"');
  497 |     if (await dialog6.isVisible()) {
  498 |       console.log(`Test 6.8 [${ENV_NAME}]: Confirmation dialog appeared\n`);
  499 |       const confirmBtn6 = page.locator('button:has-text("Confirm")').last();
  500 |       await confirmBtn6.waitFor({ state: "visible", timeout: 10000 });
  501 |       await confirmBtn6.click();
  502 |       await page.waitForTimeout(3000);
  503 |       console.log(`Test 6.8.1 [${ENV_NAME}]: Confirm clicked\n`);
  504 |     } else {
  505 |       console.log(`Test 6.8 [${ENV_NAME}]: INFO - Document sent directly\n`);
  506 |     }
  507 | 
  508 |     await page.waitForTimeout(5000);
  509 |     console.log(`Test 6.9 [${ENV_NAME}]: Document sent\n`);
  510 | 
  511 |     await page.waitForTimeout(3000);
  512 |     await page
  513 |       .locator(LOCATORS.reviewDocumentAndSignBtn)
  514 |       .waitFor({ state: "visible", timeout: 300000 });
  515 |     await page.locator(LOCATORS.reviewDocumentAndSignBtn).click();
  516 |     console.log(`Test 6.10 [${ENV_NAME}]: Review Document & Sign clicked\n`);
  517 | 
  518 |     await page.locator(LOCATORS.signatorySignaturePlaceholder).click();
  519 |     console.log(`Test 6.11 [${ENV_NAME}]: Signature placeholder clicked\n`);
  520 | 
  521 |     await page.locator(LOCATORS.finishBtn).click();
  522 |     console.log(`Test 6.12 [${ENV_NAME}]: Finish clicked\n`);
  523 | 
  524 |     await page.locator(LOCATORS.signCheckbox).waitFor({ state: "visible", timeout: 30000 });
  525 |     await page.locator(LOCATORS.signCheckbox).focus();
  526 |     await page.keyboard.press("Space");
  527 |     console.log(`Test 6.13 [${ENV_NAME}]: Checkbox via Space\n`);
  528 | 
  529 |     await page
  530 |       .locator(LOCATORS.signThisContractNowBtn)
  531 |       .waitFor({ state: "visible", timeout: 30000 });
  532 |     await page.locator(LOCATORS.signThisContractNowBtn).click();
  533 |     await page.waitForTimeout(3000);
  534 |     console.log(`Test 6.14 [${ENV_NAME}]: Sign This Contract Now clicked\n`);
  535 | 
  536 |     console.log(`Test 6 [${ENV_NAME}]: Sign A Document keyboard flow completed\n`);
  537 |   });
  538 | 
  539 |   // ==========================================================================
  540 |   // TEST 7: CREATE WORKFLOW FROM TEMPLATES VIA KEYBOARD
  541 |   // ==========================================================================
  542 | 
  543 |   sequentialTest("Test 7: Create Workflow from Templates via Keyboard", async ({ page }) => {
  544 |     await page.goto(`${ENV_URL}/e-signature`);
  545 |     await page.waitForTimeout(3000);
  546 |     console.log(`Test 7.0 [${ENV_NAME}]: Navigated to Signature module\n`);
  547 | 
  548 |     await page.locator(LOCATORS.templatesSection).waitFor({ state: "visible", timeout: 10000 });
  549 |     await page.locator(LOCATORS.templatesSection).click();
  550 |     await page.waitForTimeout(2000);
  551 |     console.log(`Test 7.1 [${ENV_NAME}]: Templates section clicked\n`);
  552 | 
  553 |     const createWorkflowBtn = page.locator(LOCATORS.createWorkflowBtn);
  554 |     await createWorkflowBtn.waitFor({ state: "visible", timeout: 15000 });
  555 |     await createWorkflowBtn.click();
  556 |     await page.waitForTimeout(2000);
  557 |     console.log(`Test 7.2 [${ENV_NAME}]: Create Workflow clicked\n`);
  558 | 
  559 |     const uploadFromDeviceBtn = page.locator(LOCATORS.uploadFromDeviceWorkflow);
  560 |     await uploadFromDeviceBtn.waitFor({ state: "visible", timeout: 10000 });
  561 |     await uploadFromDeviceBtn.click();
```