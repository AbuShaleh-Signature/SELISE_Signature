# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\regressionTest.stage.spec.ts >> 📋 Regression Suite - STAGE Environment >> Test 7: Create Workflow from Templates
- Location: tests\ui\regressionTest.stage.spec.ts:629:3

# Error details

```
TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('button.create-template-btn:visible').first() to be visible

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
            - link "Yet To Sign 55" [ref=e138] [cursor=pointer]:
              - /url: /e-signature/yettosign
              - generic [ref=e141]: Yet To Sign
              - generic [ref=e142]:
                - generic [ref=e143]: "55"
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
            - link "Pending 465" [ref=e164] [cursor=pointer]:
              - /url: /e-signature/pending
              - generic [ref=e167]: Pending
              - generic [ref=e168]:
                - generic [ref=e169]: "465"
                - img [ref=e171]: trending_flat
            - generic [ref=e172] [cursor=pointer]:
              - paragraph [ref=e173]: "Organizational :"
              - paragraph [ref=e174]: "1"
              - img [ref=e175]: trending_flat
          - generic [ref=e176]:
            - link "Completed 74" [ref=e177] [cursor=pointer]:
              - /url: /e-signature/completed
              - generic [ref=e180]: Completed
              - generic [ref=e181]:
                - generic [ref=e182]: "74"
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
        - button "Drag and drop your documents here (single shipping) PDF or DOC/DOCX (maximum 200 MB in total per process for individual or multiple documents) Upload From Device" [ref=e205] [cursor=pointer]:
          - generic [ref=e207]:
            - img [ref=e208]
            - paragraph [ref=e209]: Drag and drop your documents here (single shipping)
            - paragraph [ref=e210]: PDF or DOC/DOCX (maximum 200 MB in total per process for individual or multiple documents)
            - generic [ref=e211]:
              - button "Upload From Device" [ref=e212]: Upload From Device
              - button [ref=e213]:
                - img [ref=e215]: keyboard_arrow_down
  - generic:
    - generic: 
  - generic:
    - generic:   
  - generic "Support" [ref=e216] [cursor=pointer]:
    - img [ref=e218]: contact_support
```

# Test source

```ts
  549 |     await documentArea.scrollIntoViewIfNeeded();
  550 |     await page.waitForTimeout(1000);
  551 | 
  552 |     const docBox = await documentArea.boundingBox();
  553 |     const sigBox = await signatureField.boundingBox();
  554 | 
  555 |     if (sigBox && docBox) {
  556 |       await page.mouse.move(sigBox.x + sigBox.width / 2, sigBox.y + sigBox.height / 2);
  557 |       await page.mouse.down();
  558 |       await page.mouse.move(docBox.x + docBox.width / 2, docBox.y + docBox.height - 100, {
  559 |         steps: 10,
  560 |       });
  561 |       await page.mouse.up();
  562 |       await page.waitForTimeout(2000);
  563 |       console.log(`Test 6.7 [${ENV_NAME}]: Signature dragged\n`);
  564 |     } else {
  565 |       console.log(`Test 6.7 [${ENV_NAME}]: SKIPPED - Could not get positions\n`);
  566 |     }
  567 | 
  568 |     // --- STEP 8: Send Document ---
  569 |     const sendButton = page.locator('button:has-text("Send Document")');
  570 |     await sendButton.waitFor({ state: "visible", timeout: 15000 });
  571 |     await sendButton.click();
  572 |     await page.waitForTimeout(5000);
  573 |     console.log(`Test 6.8 [${ENV_NAME}]: Send Document clicked\n`);
  574 | 
  575 |     // --- STEP 9: Handle Confirmation Dialog ---
  576 |     const dialog = page.locator('text="Are you sure?"');
  577 |     if (await dialog.isVisible()) {
  578 |       console.log(`Test 6.9 [${ENV_NAME}]: Confirmation dialog appeared\n`);
  579 |       const confirmBtn = page.locator('button:has-text("Confirm")').last();
  580 |       await confirmBtn.waitFor({ state: "visible", timeout: 15000 });
  581 |       await confirmBtn.click();
  582 |       await page.waitForTimeout(3000);
  583 |       console.log(`Test 6.9.1 [${ENV_NAME}]: Confirm clicked\n`);
  584 |     } else {
  585 |       console.log(`Test 6.9 [${ENV_NAME}]: INFO - Document sent directly\n`);
  586 |     }
  587 | 
  588 |     // --- STEP 10: Wait for Document Rollout Completion ---
  589 |     await page.waitForTimeout(5000);
  590 |     console.log(`Test 6.10 [${ENV_NAME}]: Document sent\n`);
  591 | 
  592 |     // --- STEP 11: Review and Sign ---
  593 |     await page.waitForTimeout(3000);
  594 |     await page
  595 |       .locator(LOCATORS.reviewDocumentAndSignBtn)
  596 |       .waitFor({ state: "visible", timeout: 300000 });
  597 |     await page.locator(LOCATORS.reviewDocumentAndSignBtn).click();
  598 |     console.log(`Test 6.11 [${ENV_NAME}]: Review Document & Sign clicked\n`);
  599 | 
  600 |     // --- STEP 12: Click Signature Placeholder ---
  601 |     await page.locator(LOCATORS.signatorySignaturePlaceholder).click();
  602 |     console.log(`Test 6.12 [${ENV_NAME}]: Signature placeholder clicked\n`);
  603 | 
  604 |     // --- STEP 13: Click Finish ---
  605 |     await page.locator(LOCATORS.finishBtn).click();
  606 |     console.log(`Test 6.13 [${ENV_NAME}]: Finish clicked\n`);
  607 | 
  608 |     // --- STEP 14: Accept Terms (Click Checkbox) ---
  609 |     await page.locator(LOCATORS.signCheckbox).waitFor({ state: "visible", timeout: 30000 });
  610 |     await page.locator(LOCATORS.signCheckbox).click();
  611 |     console.log(`Test 6.14 [${ENV_NAME}]: Checkbox clicked\n`);
  612 | 
  613 |     // --- STEP 15: Sign the Contract ---
  614 |     await page
  615 |       .locator(LOCATORS.signThisContractNowBtn)
  616 |       .waitFor({ state: "visible", timeout: 30000 });
  617 |     await page.locator(LOCATORS.signThisContractNowBtn).click();
  618 |     await page.waitForTimeout(3000);
  619 |     console.log(`Test 6.15 [${ENV_NAME}]: Sign This Contract Now clicked\n`);
  620 | 
  621 |     console.log(`Test 6 [${ENV_NAME}]: Sign A Document Workflow completed\n`);
  622 |   });
  623 | 
  624 |   // ==========================================================================
  625 |   // TEST 7: CREATE WORKFLOW FROM TEMPLATES
  626 |   // ==========================================================================
  627 |   // Complete workflow creation test from Templates section
  628 | 
  629 |   sequentialTest("Test 7: Create Workflow from Templates", async ({ page }) => {
  630 |     // --- STEP 1: Navigate to Signature Module ---
  631 |     await page.goto(`${ENV_URL}/e-signature`);
  632 |     await page.waitForTimeout(3000);
  633 |     console.log(`Test 7.0 [${ENV_NAME}]: Navigated to Signature module\n`);
  634 | 
  635 |     // --- STEP 2: Click on Templates section ---
  636 |     await page.evaluate(() => {
  637 |       const templates = document.querySelectorAll("span.option-text");
  638 |       templates.forEach((el) => {
  639 |         if (el.textContent?.includes("Templates")) {
  640 |           (el as HTMLElement).click();
  641 |         }
  642 |       });
  643 |     });
  644 |     await page.waitForTimeout(2000);
  645 |     console.log(`Test 7.2 [${ENV_NAME}]: Templates section clicked\n`);
  646 | 
  647 |     // --- STEP 3: Click Create Workflow button ---
  648 |     const createWorkflowBtn = page.locator("button.create-template-btn:visible").first();
> 649 |     await createWorkflowBtn.waitFor({ state: "visible", timeout: 15000 });
      |                             ^ TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
  650 |     await createWorkflowBtn.click();
  651 |     await page.waitForTimeout(2000);
  652 |     console.log(`Test 7.3 [${ENV_NAME}]: Create Workflow clicked\n`);
  653 | 
  654 |     // --- STEP 4: Click Upload From Device ---
  655 |     const uploadFromDeviceBtn = page.locator(LOCATORS.uploadFromDeviceWorkflow);
  656 |     await uploadFromDeviceBtn.waitFor({ state: "visible", timeout: 15000 });
  657 |     await page.waitForTimeout(2000);
  658 |     console.log(`Test 7.4 [${ENV_NAME}]: Upload From Device clicked\n`);
  659 | 
  660 |     // --- STEP 5: Upload PDF File ---
  661 |     await page.locator(LOCATORS.uploadInput).setInputFiles("test-data/template.pdf");
  662 |     await page.waitForTimeout(8000);
  663 |     console.log(`Test 7.5 [${ENV_NAME}]: File uploaded\n`);
  664 | 
  665 |     // --- STEP 6: Fill Contract Name ---
  666 |     await page.locator(LOCATORS.workflowContractName).waitFor({ state: "visible", timeout: 15000 });
  667 |     await page.locator(LOCATORS.workflowContractName).fill("AutomatedTest");
  668 |     console.log(`Test 7.6 [${ENV_NAME}]: Contract name filled\n`);
  669 | 
  670 |     // --- STEP 7: Add Tag ---
  671 |     await page.locator(LOCATORS.workflowTagInput).waitFor({ state: "visible", timeout: 15000 });
  672 |     await page.locator(LOCATORS.workflowTagInput).fill("AutomatedTest");
  673 |     await page.keyboard.press("Enter");
  674 |     await page.waitForTimeout(1000);
  675 |     console.log(`Test 7.7 [${ENV_NAME}]: Tag added\n`);
  676 | 
  677 |     // --- STEP 8: Click Add Recipient ---
  678 |     await page
  679 |       .locator(LOCATORS.workflowAddRecipientBtn)
  680 |       .waitFor({ state: "visible", timeout: 15000 });
  681 |     await page.locator(LOCATORS.workflowAddRecipientBtn).click();
  682 |     await page.waitForTimeout(1000);
  683 |     console.log(`Test 7.8 [${ENV_NAME}]: Add Recipient clicked\n`);
  684 | 
  685 |     // --- STEP 9: Click Add Dynamic Signatory ---
  686 |     await page
  687 |       .locator(LOCATORS.workflowAddDynamicSignatoryBtn)
  688 |       .waitFor({ state: "visible", timeout: 15000 });
  689 |     await page.locator(LOCATORS.workflowAddDynamicSignatoryBtn).click();
  690 |     await page.waitForTimeout(1000);
  691 |     console.log(`Test 7.9 [${ENV_NAME}]: Add Dynamic Signatory clicked\n`);
  692 | 
  693 |     // --- STEP 10: Click Prepare Document ---
  694 |     await page
  695 |       .locator(LOCATORS.workflowPrepareDocumentBtn)
  696 |       .waitFor({ state: "visible", timeout: 15000 });
  697 |     await page.locator(LOCATORS.workflowPrepareDocumentBtn).click();
  698 |     await page.waitForTimeout(5000);
  699 |     console.log(`Test 7.10 [${ENV_NAME}]: Prepare Document clicked\n`);
  700 | 
  701 |     // --- STEP 11: Drag Signature to PDF ---
  702 |     await page.waitForTimeout(2000);
  703 |     const signatureField = page.locator(LOCATORS.signatureField);
  704 |     await signatureField.waitFor({ state: "visible", timeout: 15000 });
  705 |     await signatureField.scrollIntoViewIfNeeded();
  706 |     await page.waitForTimeout(1000);
  707 | 
  708 |     const documentArea = page.locator(LOCATORS.documentPageArea).last();
  709 |     await documentArea.scrollIntoViewIfNeeded();
  710 |     await page.waitForTimeout(1000);
  711 | 
  712 |     const docBox = await documentArea.boundingBox();
  713 |     const sigBox = await signatureField.boundingBox();
  714 | 
  715 |     if (sigBox && docBox) {
  716 |       await page.mouse.move(sigBox.x + sigBox.width / 2, sigBox.y + sigBox.height / 2);
  717 |       await page.mouse.down();
  718 |       await page.mouse.move(docBox.x + docBox.width / 2, docBox.y + docBox.height - 100, {
  719 |         steps: 10,
  720 |       });
  721 |       await page.mouse.up();
  722 |       await page.waitForTimeout(2000);
  723 |       console.log(`Test 7.11 [${ENV_NAME}]: Signature dragged\n`);
  724 |     } else {
  725 |       console.log(`Test 7.11 [${ENV_NAME}]: SKIPPED - Could not get positions\n`);
  726 |     }
  727 | 
  728 |     // --- STEP 12: Wait for Save Workflow button to be enabled ---
  729 |     await page.waitForFunction(
  730 |       () => {
  731 |         const btns = Array.from(document.querySelectorAll("button"));
  732 |         const saveBtn = btns.find((b: any) => b.textContent?.includes("Save Workflow"));
  733 |         return saveBtn && !saveBtn.disabled;
  734 |       },
  735 |       { timeout: 60000 }
  736 |     );
  737 |     console.log(`Test 7.12 [${ENV_NAME}]: Save Workflow button enabled\n`);
  738 | 
  739 |     // --- STEP 13: Click Save Workflow ---
  740 |     const saveWorkflowBtn = page.locator(LOCATORS.workflowSaveWorkflowBtn);
  741 |     await saveWorkflowBtn.waitFor({ state: "visible", timeout: 15000 });
  742 |     await saveWorkflowBtn.click();
  743 |     console.log(`Test 7.13 [${ENV_NAME}]: Save Workflow clicked\n`);
  744 | 
  745 |     // --- STEP 14: Wait for Redirection ---
  746 |     await page.waitForTimeout(5000);
  747 |     console.log(`Test 7.14 [${ENV_NAME}]: Redirected to workflow page\n`);
  748 | 
  749 |     console.log(`Test 7 [${ENV_NAME}]: Create Workflow from Templates completed\n`);
```