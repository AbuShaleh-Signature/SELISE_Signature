# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\regressionTest.prod.spec.ts >> 📋 Regression Suite - PROD Environment >> Test 7: Create Workflow from Templates
- Location: tests\ui\regressionTest.prod.spec.ts:630:3

# Error details

```
Error: locator.waitFor: Target page, context or browser has been closed
Call log:
  - waiting for locator('button.create-template-btn:visible').first() to be visible

```

# Test source

```ts
  550 |     await documentArea.scrollIntoViewIfNeeded();
  551 |     await page.waitForTimeout(1000);
  552 | 
  553 |     const docBox = await documentArea.boundingBox();
  554 |     const sigBox = await signatureField.boundingBox();
  555 | 
  556 |     if (sigBox && docBox) {
  557 |       await page.mouse.move(sigBox.x + sigBox.width / 2, sigBox.y + sigBox.height / 2);
  558 |       await page.mouse.down();
  559 |       await page.mouse.move(docBox.x + docBox.width / 2, docBox.y + docBox.height - 100, {
  560 |         steps: 10,
  561 |       });
  562 |       await page.mouse.up();
  563 |       await page.waitForTimeout(2000);
  564 |       console.log(`Test 6.7 [${ENV_NAME}]: Signature dragged\n`);
  565 |     } else {
  566 |       console.log(`Test 6.7 [${ENV_NAME}]: SKIPPED - Could not get positions\n`);
  567 |     }
  568 | 
  569 |     // --- STEP 8: Send Document ---
  570 |     const sendButton = page.locator('button:has-text("Send Document")');
  571 |     await sendButton.waitFor({ state: "visible", timeout: 30000 });
  572 |     await sendButton.click();
  573 |     await page.waitForTimeout(5000);
  574 |     console.log(`Test 6.8 [${ENV_NAME}]: Send Document clicked\n`);
  575 | 
  576 |     // --- STEP 9: Handle Confirmation Dialog ---
  577 |     const dialog = page.locator('text="Are you sure?"');
  578 |     if (await dialog.isVisible()) {
  579 |       console.log(`Test 6.9 [${ENV_NAME}]: Confirmation dialog appeared\n`);
  580 |       const confirmBtn = page.locator('button:has-text("Confirm")').last();
  581 |       await confirmBtn.waitFor({ state: "visible", timeout: 30000 });
  582 |       await confirmBtn.click();
  583 |       await page.waitForTimeout(3000);
  584 |       console.log(`Test 6.9 [${ENV_NAME}]: Confirm clicked\n`);
  585 |     } else {
  586 |       console.log(`Test 6.9 [${ENV_NAME}]: INFO - Document sent directly\n`);
  587 |     }
  588 | 
  589 |     // --- STEP 10: Wait for Document Rollout Completion ---
  590 |     await page.waitForTimeout(5000);
  591 |     console.log(`Test 6.10 [${ENV_NAME}]: Document sent\n`);
  592 | 
  593 |     // --- STEP 11: Review and Sign ---
  594 |     await page.waitForTimeout(3000);
  595 |     await page
  596 |       .locator(LOCATORS.reviewDocumentAndSignBtn)
  597 |       .waitFor({ state: "visible", timeout: 300000 });
  598 |     await page.locator(LOCATORS.reviewDocumentAndSignBtn).click();
  599 |     console.log(`Test 6.11 [${ENV_NAME}]: Review Document & Sign clicked\n`);
  600 | 
  601 |     // --- STEP 12: Click Signature Placeholder ---
  602 |     await page.locator(LOCATORS.signatorySignaturePlaceholder).click();
  603 |     console.log(`Test 6.12 [${ENV_NAME}]: Signature placeholder clicked\n`);
  604 | 
  605 |     // --- STEP 13: Click Finish ---
  606 |     await page.locator(LOCATORS.finishBtn).click();
  607 |     console.log(`Test 6.13 [${ENV_NAME}]: Finish clicked\n`);
  608 | 
  609 |     // --- STEP 14: Accept Terms (Click Checkbox) ---
  610 |     await page.locator(LOCATORS.signCheckbox).waitFor({ state: "visible", timeout: 30000 });
  611 |     await page.locator(LOCATORS.signCheckbox).click();
  612 |     console.log(`Test 6.14 [${ENV_NAME}]: Checkbox clicked\n`);
  613 | 
  614 |     // --- STEP 15: Sign the Contract ---
  615 |     await page
  616 |       .locator(LOCATORS.signThisContractNowBtn)
  617 |       .waitFor({ state: "visible", timeout: 30000 });
  618 |     await page.locator(LOCATORS.signThisContractNowBtn).click();
  619 |     await page.waitForTimeout(3000);
  620 |     console.log(`Test 6.15 [${ENV_NAME}]: Sign This Contract Now clicked\n`);
  621 | 
  622 |     console.log(`Test 6 [${ENV_NAME}]: Sign A Document Workflow completed\n`);
  623 |   });
  624 | 
  625 |   // ==========================================================================
  626 |   // TEST 7: CREATE WORKFLOW FROM TEMPLATES
  627 |   // ==========================================================================
  628 |   // Complete workflow creation test from Templates section
  629 | 
  630 |   sequentialTest("Test 7: Create Workflow from Templates", async ({ page }) => {
  631 |     // --- STEP 1: Navigate to Signature Module ---
  632 |     await page.goto(`${ENV_URL}/e-signature`);
  633 |     await page.waitForTimeout(3000);
  634 |     console.log(`Test 7.1 [${ENV_NAME}]: Navigated to Signature module\n`);
  635 | 
  636 |     // --- STEP 2: Click on Templates section ---
  637 |     await page.evaluate(() => {
  638 |       const templates = document.querySelectorAll("span.option-text");
  639 |       templates.forEach((el) => {
  640 |         if (el.textContent?.includes("Templates")) {
  641 |           (el as HTMLElement).click();
  642 |         }
  643 |       });
  644 |     });
  645 |     await page.waitForTimeout(2000);
  646 |     console.log(`Test 7.2 [${ENV_NAME}]: Templates section clicked\n`);
  647 | 
  648 |     // --- STEP 3: Click Create Workflow button ---
  649 |     const createWorkflowBtn = page.locator("button.create-template-btn:visible").first();
> 650 |     await createWorkflowBtn.waitFor({ state: "visible", timeout: 15000 });
      |                             ^ Error: locator.waitFor: Target page, context or browser has been closed
  651 |     await createWorkflowBtn.click();
  652 |     await page.waitForTimeout(2000);
  653 |     console.log(`Test 7.3 [${ENV_NAME}]: Create Workflow clicked\n`);
  654 | 
  655 |     // --- STEP 4: Click Upload From Device ---
  656 |     const uploadFromDeviceBtn = page.locator(LOCATORS.uploadFromDeviceWorkflow);
  657 |     await uploadFromDeviceBtn.waitFor({ state: "visible", timeout: 30000 });
  658 |     await page.waitForTimeout(2000);
  659 |     console.log(`Test 7.4 [${ENV_NAME}]: Upload From Device clicked\n`);
  660 | 
  661 |     // --- STEP 5: Upload PDF File ---
  662 |     await page.locator(LOCATORS.uploadInput).setInputFiles("test-data/template.pdf");
  663 |     await page.waitForTimeout(8000);
  664 |     console.log(`Test 7.5 [${ENV_NAME}]: File uploaded\n`);
  665 | 
  666 |     // --- STEP 6: Fill Contract Name ---
  667 |     await page.locator(LOCATORS.workflowContractName).waitFor({ state: "visible", timeout: 30000 });
  668 |     await page.locator(LOCATORS.workflowContractName).fill("AutomatedTest");
  669 |     console.log(`Test 7.6 [${ENV_NAME}]: Contract name filled\n`);
  670 | 
  671 |     // --- STEP 7: Add Tag ---
  672 |     await page.locator(LOCATORS.workflowTagInput).waitFor({ state: "visible", timeout: 30000 });
  673 |     await page.locator(LOCATORS.workflowTagInput).fill("AutomatedTest");
  674 |     await page.keyboard.press("Enter");
  675 |     await page.waitForTimeout(1000);
  676 |     console.log(`Test 7.7 [${ENV_NAME}]: Tag added\n`);
  677 | 
  678 |     // --- STEP 8: Click Add Recipient ---
  679 |     await page
  680 |       .locator(LOCATORS.workflowAddRecipientBtn)
  681 |       .waitFor({ state: "visible", timeout: 30000 });
  682 |     await page.locator(LOCATORS.workflowAddRecipientBtn).click();
  683 |     await page.waitForTimeout(1000);
  684 |     console.log(`Test 7.8 [${ENV_NAME}]: Add Recipient clicked\n`);
  685 | 
  686 |     // --- STEP 9: Click Add Dynamic Signatory ---
  687 |     await page
  688 |       .locator(LOCATORS.workflowAddDynamicSignatoryBtn)
  689 |       .waitFor({ state: "visible", timeout: 30000 });
  690 |     await page.locator(LOCATORS.workflowAddDynamicSignatoryBtn).click();
  691 |     await page.waitForTimeout(1000);
  692 |     console.log(`Test 7.9 [${ENV_NAME}]: Add Dynamic Signatory clicked\n`);
  693 | 
  694 |     // --- STEP 10: Click Prepare Document ---
  695 |     await page
  696 |       .locator(LOCATORS.workflowPrepareDocumentBtn)
  697 |       .waitFor({ state: "visible", timeout: 30000 });
  698 |     await page.locator(LOCATORS.workflowPrepareDocumentBtn).click();
  699 |     await page.waitForTimeout(5000);
  700 |     console.log(`Test 7.10 [${ENV_NAME}]: Prepare Document clicked\n`);
  701 | 
  702 |     // --- STEP 11: Drag Signature to PDF ---
  703 |     await page.waitForTimeout(2000);
  704 |     const signatureField = page.locator(LOCATORS.signatureField);
  705 |     await signatureField.waitFor({ state: "visible", timeout: 15000 });
  706 |     await signatureField.scrollIntoViewIfNeeded();
  707 |     await page.waitForTimeout(1000);
  708 | 
  709 |     const documentArea = page.locator(LOCATORS.documentPageArea).last();
  710 |     await documentArea.scrollIntoViewIfNeeded();
  711 |     await page.waitForTimeout(1000);
  712 | 
  713 |     const docBox = await documentArea.boundingBox();
  714 |     const sigBox = await signatureField.boundingBox();
  715 | 
  716 |     if (sigBox && docBox) {
  717 |       await page.mouse.move(sigBox.x + sigBox.width / 2, sigBox.y + sigBox.height / 2);
  718 |       await page.mouse.down();
  719 |       await page.mouse.move(docBox.x + docBox.width / 2, docBox.y + docBox.height - 100, {
  720 |         steps: 10,
  721 |       });
  722 |       await page.mouse.up();
  723 |       await page.waitForTimeout(2000);
  724 |       console.log(`Test 7.11 [${ENV_NAME}]: Signature dragged\n`);
  725 |     } else {
  726 |       console.log(`Test 7.11 [${ENV_NAME}]: SKIPPED - Could not get positions\n`);
  727 |     }
  728 | 
  729 |     // --- STEP 12: Wait for Save Workflow button to be enabled ---
  730 |     await page.waitForFunction(
  731 |       () => {
  732 |         const btns = Array.from(document.querySelectorAll("button"));
  733 |         const saveBtn = btns.find((b: any) => b.textContent?.includes("Save Workflow"));
  734 |         return saveBtn && !saveBtn.disabled;
  735 |       },
  736 |       { timeout: 60000 }
  737 |     );
  738 |     console.log(`Test 7.12 [${ENV_NAME}]: Save Workflow button enabled\n`);
  739 | 
  740 |     // --- STEP 13: Click Save Workflow ---
  741 |     const saveWorkflowBtn = page.locator(LOCATORS.workflowSaveWorkflowBtn);
  742 |     await saveWorkflowBtn.waitFor({ state: "visible", timeout: 30000 });
  743 |     await saveWorkflowBtn.click();
  744 |     console.log(`Test 7.13 [${ENV_NAME}]: Save Workflow clicked\n`);
  745 | 
  746 |     // --- STEP 14: Wait for Redirection ---
  747 |     await page.waitForTimeout(5000);
  748 |     console.log(`Test 7.14 [${ENV_NAME}]: Redirected to workflow page\n`);
  749 | 
  750 |     console.log(`Test 7 [${ENV_NAME}]: Create Workflow from Templates completed\n`);
```