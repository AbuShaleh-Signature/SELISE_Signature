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
  562 |     await page.waitForTimeout(8000);
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
> 618 |       await page.waitForTimeout(2000);
      |                  ^ Error: page.waitForTimeout: Target page, context or browser has been closed
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
  663 | 
  664 |     await page.locator('span:text("Use")').first().click();
  665 |     await page.waitForTimeout(5000);
  666 |     console.log(`Test 8.3 [${ENV_NAME}]: Use workflow clicked\n`);
  667 | 
  668 |     await page.waitForTimeout(3000);
  669 |     await page.locator(LOCATORS.workflowAddRecipientBtn).waitFor({ state: "visible", timeout: 10000 });
  670 |     await page.locator(LOCATORS.workflowAddRecipientBtn).click();
  671 |     await page.waitForTimeout(2000);
  672 |     console.log(`Test 8.4 [${ENV_NAME}]: Add Recipient clicked\n`);
  673 | 
  674 |     await page.waitForTimeout(2000);
  675 |     await page.locator(LOCATORS.workflowConfirmBtn).waitFor({ state: "visible", timeout: 10000 });
  676 |     await page.locator(LOCATORS.workflowConfirmBtn).click();
  677 |     await page.waitForTimeout(3000);
  678 |     console.log(`Test 8.5 [${ENV_NAME}]: Confirm clicked\n`);
  679 | 
  680 |     await page.waitForTimeout(3000);
  681 |     const confirmPopupBtn = page.locator('button:has-text("Confirm")').last();
  682 |     await confirmPopupBtn.waitFor({ state: "visible", timeout: 10000 });
  683 |     await confirmPopupBtn.click();
  684 |     await page.waitForTimeout(5000);
  685 |     console.log(`Test 8.6 [${ENV_NAME}]: Confirm on pop-up clicked\n`);
  686 | 
  687 |     await page.waitForTimeout(5000);
  688 |     const addSignatoryInput = page.locator('input[role="combobox"]');
  689 |     await addSignatoryInput.waitFor({ state: "visible", timeout: 30000 });
  690 |     console.log(`Test 8.7 [${ENV_NAME}]: Add Signatory form loaded\n`);
  691 | 
  692 |     await addSignatoryInput.focus();
  693 |     await page.waitForTimeout(300);
  694 |     await page.keyboard.type("r", { delay: 300 });
  695 |     await page.waitForTimeout(500);
  696 |     await page.keyboard.type("a", { delay: 300 });
  697 |     await page.waitForTimeout(500);
  698 |     await page.keyboard.type("a", { delay: 300 });
  699 |     await page.waitForTimeout(500);
  700 |     await page.keyboard.type("j", { delay: 300 });
  701 |     await page.waitForTimeout(2000);
  702 |     console.log(`Test 8.8 [${ENV_NAME}]: Raaj typed in Add Signatory\n`);
  703 | 
  704 |     await page.keyboard.press("ArrowDown");
  705 |     await page.waitForTimeout(500);
  706 |     await page.keyboard.press("Enter");
  707 |     await page.waitForTimeout(2000);
  708 |     console.log(`Test 8.9 [${ENV_NAME}]: Signatory selected from dropdown\n`);
  709 | 
  710 |     const prepareDocBtn = page.locator(LOCATORS.prepareDocumentBtn);
  711 |     await prepareDocBtn.waitFor({ state: "visible", timeout: 30000 });
  712 |     await prepareDocBtn.click();
  713 |     await page.waitForTimeout(5000);
  714 |     console.log(`Test 8.10 [${ENV_NAME}]: Prepare Document clicked\n`);
  715 | 
  716 |     const sendDocumentBtn = page.locator('button:has-text("Send Document")');
  717 |     await sendDocumentBtn.waitFor({ state: "visible", timeout: 30000 });
  718 |     await sendDocumentBtn.click();
```