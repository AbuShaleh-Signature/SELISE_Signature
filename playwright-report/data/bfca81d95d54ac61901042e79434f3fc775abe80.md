# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\keyboardAccessibilityTest.stage.spec.ts >> ⌨️  Keyboard Navigation Suite - STAGE >> Test 7: Create Workflow from Templates via Keyboard
- Location: tests\ui\keyboardAccessibilityTest.stage.spec.ts:539:3

# Error details

```
Error: page.waitForTimeout: Target page, context or browser has been closed
```

# Test source

```ts
  462 |     const signatureField6 = page.locator(LOCATORS.signatureField);
  463 |     const documentArea6 = page.locator(LOCATORS.documentPageArea).last();
  464 | 
  465 |     let sigBox6, docBox6;
  466 |     for (let attempt = 0; attempt < 10; attempt++) {
  467 |       await signatureField6.waitFor({ state: "visible", timeout: 60000 });
  468 |       sigBox6 = await signatureField6.boundingBox();
  469 |       docBox6 = await documentArea6.boundingBox();
  470 |       if (sigBox6 && docBox6) break;
  471 |       await page.waitForTimeout(2000);
  472 |     }
  473 | 
  474 |     if (sigBox6 && docBox6) {
  475 |       await page.mouse.move(sigBox6.x + sigBox6.width / 2, sigBox6.y + sigBox6.height / 2);
  476 |       await page.mouse.down();
  477 |       await page.mouse.move(docBox6.x + docBox6.width / 2, docBox6.y + docBox6.height - 100, {
  478 |         steps: 10,
  479 |       });
  480 |       await page.mouse.up();
  481 |       await page.waitForTimeout(2000);
  482 |       console.log(`Test 6.6 [${ENV_NAME}]: Signature dragged\n`);
  483 |     } else {
  484 |       console.log(`Test 6.6 [${ENV_NAME}]: SKIPPED - Could not get positions\n`);
  485 |     }
  486 | 
  487 |     const sendButton6 = page.locator('button:has-text("Send Document")');
  488 |     await sendButton6.waitFor({ state: "visible", timeout: 10000 });
  489 |     await sendButton6.click();
  490 |     await page.waitForTimeout(5000);
  491 |     console.log(`Test 6.7 [${ENV_NAME}]: Send Document clicked\n`);
  492 | 
  493 |     const dialog6 = page.locator('text="Are you sure?"');
  494 |     if (await dialog6.isVisible()) {
  495 |       console.log(`Test 6.8 [${ENV_NAME}]: Confirmation dialog appeared\n`);
  496 |       const confirmBtn6 = page.locator('button:has-text("Confirm")').last();
  497 |       await confirmBtn6.waitFor({ state: "visible", timeout: 10000 });
  498 |       await confirmBtn6.click();
  499 |       await page.waitForTimeout(3000);
  500 |       console.log(`Test 6.8.1 [${ENV_NAME}]: Confirm clicked\n`);
  501 |     } else {
  502 |       console.log(`Test 6.8 [${ENV_NAME}]: INFO - Document sent directly\n`);
  503 |     }
  504 | 
  505 |     await page.waitForTimeout(5000);
  506 |     console.log(`Test 6.9 [${ENV_NAME}]: Document sent\n`);
  507 | 
  508 |     await page.waitForTimeout(3000);
  509 |     await page
  510 |       .locator(LOCATORS.reviewDocumentAndSignBtn)
  511 |       .waitFor({ state: "visible", timeout: 300000 });
  512 |     await page.locator(LOCATORS.reviewDocumentAndSignBtn).click();
  513 |     console.log(`Test 6.10 [${ENV_NAME}]: Review Document & Sign clicked\n`);
  514 | 
  515 |     await page.locator(LOCATORS.signatorySignaturePlaceholder).click();
  516 |     console.log(`Test 6.11 [${ENV_NAME}]: Signature placeholder clicked\n`);
  517 | 
  518 |     await page.locator(LOCATORS.finishBtn).click();
  519 |     console.log(`Test 6.12 [${ENV_NAME}]: Finish clicked\n`);
  520 | 
  521 |     await page.locator(LOCATORS.signCheckbox).waitFor({ state: "visible", timeout: 30000 });
  522 |     await page.locator(LOCATORS.signCheckbox).click();
  523 |     console.log(`Test 6.13 [${ENV_NAME}]: Checkbox clicked\n`);
  524 | 
  525 |     await page
  526 |       .locator(LOCATORS.signThisContractNowBtn)
  527 |       .waitFor({ state: "visible", timeout: 30000 });
  528 |     await page.locator(LOCATORS.signThisContractNowBtn).click();
  529 |     await page.waitForTimeout(3000);
  530 |     console.log(`Test 6.14 [${ENV_NAME}]: Sign This Contract Now clicked\n`);
  531 | 
  532 |     console.log(`Test 6 [${ENV_NAME}]: Sign A Document keyboard flow completed\n`);
  533 |   });
  534 | 
  535 |   // ==========================================================================
  536 |   // TEST 7: CREATE WORKFLOW FROM TEMPLATES VIA KEYBOARD
  537 |   // ==========================================================================
  538 | 
  539 |   sequentialTest("Test 7: Create Workflow from Templates via Keyboard", async ({ page }) => {
  540 |     await page.goto(`${ENV_URL}/e-signature`);
  541 |     await page.waitForTimeout(5000);
  542 |     console.log(`Test 7.0 [${ENV_NAME}]: Navigated to Signature module\n`);
  543 | 
  544 |     await page.locator(LOCATORS.templatesSection).waitFor({ state: "attached", timeout: 10000 });
  545 |     await page.locator(LOCATORS.templatesSection).first().click({ force: true });
  546 |     await page.waitForTimeout(2000);
  547 |     console.log(`Test 7.1 [${ENV_NAME}]: Templates section clicked\n`);
  548 | 
  549 |     const createWorkflowBtn = page.locator(LOCATORS.createWorkflowBtn).first();
  550 |     await createWorkflowBtn.waitFor({ state: "visible", timeout: 15000 });
  551 |     await createWorkflowBtn.click();
  552 |     await page.waitForTimeout(2000);
  553 |     console.log(`Test 7.2 [${ENV_NAME}]: Create Workflow clicked\n`);
  554 | 
  555 |     const uploadFromDeviceBtn = page.locator(LOCATORS.uploadFromDeviceWorkflow);
  556 |     await uploadFromDeviceBtn.waitFor({ state: "visible", timeout: 10000 });
  557 |     await uploadFromDeviceBtn.click();
  558 |     await page.waitForTimeout(2000);
  559 |     console.log(`Test 7.3 [${ENV_NAME}]: Upload From Device clicked\n`);
  560 | 
  561 |     await page.locator(LOCATORS.uploadInput).setInputFiles("test-data/template.pdf");
> 562 |     await page.waitForTimeout(8000);
      |                ^ Error: page.waitForTimeout: Target page, context or browser has been closed
  563 |     console.log(`Test 7.4 [${ENV_NAME}]: File uploaded\n`);
  564 | 
  565 |     await page.locator(LOCATORS.workflowContractName).waitFor({ state: "visible", timeout: 10000 });
  566 |     await page.locator(LOCATORS.workflowContractName).fill("KeyboardAutoTest");
  567 |     console.log(`Test 7.5 [${ENV_NAME}]: Contract name filled\n`);
  568 | 
  569 |     await page.locator(LOCATORS.workflowTagInput).waitFor({ state: "visible", timeout: 10000 });
  570 |     await page.locator(LOCATORS.workflowTagInput).fill("KeyboardAutoTest");
  571 |     await page.keyboard.press("Enter");
  572 |     await page.waitForTimeout(1000);
  573 |     console.log(`Test 7.6 [${ENV_NAME}]: Tag added via keyboard\n`);
  574 | 
  575 |     await page
  576 |       .locator(LOCATORS.workflowAddRecipientBtn)
  577 |       .waitFor({ state: "visible", timeout: 10000 });
  578 |     await page.locator(LOCATORS.workflowAddRecipientBtn).click();
  579 |     await page.waitForTimeout(1000);
  580 |     console.log(`Test 7.7 [${ENV_NAME}]: Add Recipient clicked\n`);
  581 | 
  582 |     await page
  583 |       .locator(LOCATORS.workflowAddDynamicSignatoryBtn)
  584 |       .waitFor({ state: "visible", timeout: 10000 });
  585 |     await page.locator(LOCATORS.workflowAddDynamicSignatoryBtn).click();
  586 |     await page.waitForTimeout(1000);
  587 |     console.log(`Test 7.8 [${ENV_NAME}]: Add Dynamic Signatory clicked\n`);
  588 | 
  589 |     await page
  590 |       .locator(LOCATORS.workflowPrepareDocumentBtn)
  591 |       .waitFor({ state: "visible", timeout: 10000 });
  592 |     await page.locator(LOCATORS.workflowPrepareDocumentBtn).click();
  593 |     await page.waitForTimeout(5000);
  594 |     console.log(`Test 7.9 [${ENV_NAME}]: Prepare Document clicked\n`);
  595 | 
  596 |     await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  597 |     await page.waitForTimeout(3000);
  598 | 
  599 |     const signatureField7 = page.locator(LOCATORS.signatureField);
  600 |     const documentArea7 = page.locator(LOCATORS.documentPageArea).last();
  601 | 
  602 |     let sigBox7, docBox7;
  603 |     for (let attempt = 0; attempt < 10; attempt++) {
  604 |       await signatureField7.waitFor({ state: "visible", timeout: 60000 });
  605 |       sigBox7 = await signatureField7.boundingBox();
  606 |       docBox7 = await documentArea7.boundingBox();
  607 |       if (sigBox7 && docBox7) break;
  608 |       await page.waitForTimeout(2000);
  609 |     }
  610 | 
  611 |     if (sigBox7 && docBox7) {
  612 |       await page.mouse.move(sigBox7.x + sigBox7.width / 2, sigBox7.y + sigBox7.height / 2);
  613 |       await page.mouse.down();
  614 |       await page.mouse.move(docBox7.x + docBox7.width / 2, docBox7.y + docBox7.height - 100, {
  615 |         steps: 10,
  616 |       });
  617 |       await page.mouse.up();
  618 |       await page.waitForTimeout(2000);
  619 |       console.log(`Test 7.10 [${ENV_NAME}]: Signature dragged\n`);
  620 |     } else {
  621 |       console.log(`Test 7.10 [${ENV_NAME}]: SKIPPED - Could not get positions\n`);
  622 |     }
  623 | 
  624 |     await page.waitForFunction(
  625 |       () => {
  626 |         const btns = Array.from(document.querySelectorAll("button"));
  627 |         const saveBtn = btns.find((b: any) => b.textContent?.includes("Save Workflow"));
  628 |         return saveBtn && !saveBtn.disabled;
  629 |       },
  630 |       { timeout: 60000 }
  631 |     );
  632 |     console.log(`Test 7.11 [${ENV_NAME}]: Save Workflow button enabled\n`);
  633 | 
  634 |     const saveWorkflowBtn = page.locator(LOCATORS.workflowSaveWorkflowBtn);
  635 |     await saveWorkflowBtn.waitFor({ state: "visible", timeout: 10000 });
  636 |     await saveWorkflowBtn.click();
  637 |     console.log(`Test 7.12 [${ENV_NAME}]: Save Workflow clicked\n`);
  638 | 
  639 |     await page.waitForTimeout(5000);
  640 |     console.log(`Test 7 [${ENV_NAME}]: Create Workflow from Templates via keyboard completed\n`);
  641 |   });
  642 | 
  643 |   // ==========================================================================
  644 |   // TEST 8: USE WORKFLOW FROM TEMPLATES VIA KEYBOARD
  645 |   // ==========================================================================
  646 | 
  647 |   sequentialTest("Test 8: Use Workflow from Templates via Keyboard", async ({ page }) => {
  648 |     await page.goto(`${ENV_URL}/e-signature`);
  649 |     await page.waitForTimeout(5000);
  650 |     console.log(`Test 8.0 [${ENV_NAME}]: Navigated to Signature module\n`);
  651 | 
  652 |     await page.locator(LOCATORS.templatesSection).waitFor({ state: "attached", timeout: 10000 });
  653 |     await page.locator(LOCATORS.templatesSection).first().click({ force: true });
  654 |     await page.waitForTimeout(2000);
  655 |     console.log(`Test 8.1 [${ENV_NAME}]: Templates section clicked\n`);
  656 | 
  657 |     await page.waitForTimeout(3000);
  658 |     const workflowRow = page.locator('div:has-text("KeyboardAutoTest")').first();
  659 |     await workflowRow.waitFor({ state: "visible", timeout: 15000 });
  660 |     await workflowRow.scrollIntoViewIfNeeded();
  661 |     await page.waitForTimeout(1000);
  662 |     console.log(`Test 8.2 [${ENV_NAME}]: Found KeyboardAutoTest row\n`);
```