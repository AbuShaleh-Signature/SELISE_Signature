/**
 * ============================================================================
 * LOCATORS - PROD ENVIRONMENT
 * ============================================================================
 *
 * Purpose:
 *   This file contains all CSS/XPath selectors used for UI automation
 *   specifically for the PRODUCTION environment.
 *
 * Why Separate Locators?
 *   - Different environments may have different element selectors
 *   - Production has optimized/release selectors
 *   - Easier maintenance and updates
 *
 * NOTE:
 *   - Production URL: https://selise.app
 *   - Stage URL: https://app.selisestage.com
 *
 * ============================================================================
 */

export const LOCATORS = {
  // ==========================================================================
  // LOGIN PAGE LOCATORS
  // ==========================================================================

  usernameField: "Enter your email", // Username input placeholder
  passwordField: "Enter your password", // Password input placeholder
  loginButton: "LOGIN", // Login button text
  home: "#home-page", // Home page container ID

  // ==========================================================================
  // DASHBOARD LOCATORS
  // ==========================================================================

  welcomeMessage: "text=Available Apps", // Welcome text indicating dashboard loaded

  // ==========================================================================
  // AVAILABLE APPS LOCATORS
  // ==========================================================================

  contactsApp: 'p:has-text("Contacts")', // Contacts application card
  signatureApp: 'p:has-text("Signature")', // Signature/e-signature application card
  fileManagerApp: 'p:has-text("File Manager")', // File Manager application card

  // ==========================================================================
  // SELISE STORE LOCATOR
  // ==========================================================================

  seliseStoreButton: 'button:has-text("SELISE Store")', // SELISE Store navigation button

  // ==========================================================================
  // HEADER ELEMENTS
  // ==========================================================================

  logo: 'img.logo-icon[src*="arc2-logo"]', // Application logo image
  myAppsMenu: "button:has(mat-icon)", // My Apps menu button (PROD specific selector)
  profileLogo: 'img[alt="User profile"]', // User profile picture/logo

  // ==========================================================================
  // SIGNATURE MODULE LOCATORS
  // ==========================================================================

  signatureCard: "div.icon mat-icon.icon-icn_esignature", // Signature card icon

  // ==========================================================================
  // STATUS CARDS
  // ==========================================================================

  yetToSignCard: 'a:has-text("Yet To Sign")', // Documents awaiting signature
  yetToReviewCard: 'a:has-text("Yet To Review")', // Documents pending review
  pendingCard: 'a:has-text("Pending")', // Documents in progress
  completedCard: 'a:has-text("Completed")', // Successfully completed documents

  // ==========================================================================
  // DOCUMENT UPLOAD LOCATORS
  // ==========================================================================

  uploadArea: 'p:has-text("Drag and drop")', // Drag and drop upload zone
  uploadFromDeviceBtn: 'button:has-text("Upload From Device")', // Upload button
  uploadInput: "#inputButton", // Hidden file input element
  chooseFromWorkflowsBtn: 'button:has-text("Choose From Workflows")', // Alternative upload option

  // ==========================================================================
  // ENVELOPE FORM LOCATORS
  // ==========================================================================

  envelopeNameInput: 'input[placeholder="Enter contract name"]', // Envelope/document name input
  addRecipientBtn: 'button:has-text("Add Recipient")', // Add signatory button
  addRecipientsPage: 'text="Add Recipients"', // Recipients page indicator
  prepareDocumentBtn: 'button:has-text("Prepare Document")', // Proceed to document preparation

  // ==========================================================================
  // DOCUMENT SIGNING LOCATORS
  // ==========================================================================

  signatureField: "#ph-signature", // Signature placeholder field ID
  pdfPlaceholder: "div.placeholder-layer", // PDF document placeholder
  sendDocumentBtn: 'button:has-text("Send Document")', // Send for signing button
  confirmSendBtn: 'button[aria-label="Save"]', // Confirmation dialog save button
  documentSentSuccess: ':text("Document prepared successfully")', // Success message indicator
  sendAgainBtn: 'button:has-text("Send")', // Resend document button
  closeAlertBtn: 'button img[alt="close"]', // Close alert dialog button
  documentPageArea: '[aria-label*="Page"]', // PDF document page container
  reviewDocumentAndSignBtn: 'button:has-text("Review Document & Sign")', // Review before signing button
  signatoryName: ".signatory-name", // Signatory name display element
  signatureBtn: 'button:has-text("Signature")', // Signature action button
  signatorySignaturePlaceholder: '.placeholder-name >> text="Signature"', // Signature placeholder for signatory
  finishBtn: 'button:has-text("Finish")', // Finish signing button
  signCheckbox: ".mat-checkbox", // Terms acceptance checkbox
  signThisContractNowBtn: 'button:has-text("Sign This Contract Now")', // Final sign button

  // ==========================================================================
  // WORKFLOW LOCATORS (Templates)
  // ==========================================================================

  workflowContractName: 'input[placeholder="Enter contract name"]', // Workflow contract name
  workflowTagInput: 'input[placeholder="Add a tag..."]', // Tag input field
  workflowAddRecipientBtn: 'button:has-text("Add Recipient")', // Add recipient in workflow
  workflowAddDynamicSignatoryBtn: 'button:has-text("Add Dynamic Signatory")', // Dynamic signatory option
  workflowPrepareDocumentBtn: 'button:has-text("Prepare Document")', // Prepare document in workflow
  workflowSaveWorkflowBtn: 'button:has-text("Save Workflow")', // Save workflow button
  createWorkflowBtn: 'button.create-template-btn:visible', // Create workflow button
  uploadFromDeviceWorkflow: 'button:has-text("Upload From Device")', // Upload in workflow
  signatureTypeAdvance: 'mat-icon.material-icons-outlined:has-text("https")', // Advanced signature type icon
  signatureTypeRadioAdvanced: 'div.sub-type-name:has-text("Advanced for EU (eIDAS)")', // Advanced radio button
} as const;
