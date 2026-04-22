/**
 * ============================================================================
 * LOCATORS - STAGE ENVIRONMENT
 * ============================================================================
 *
 * Purpose:
 *   This file contains all CSS/XPath selectors used for UI automation
 *   specifically for the STAGE environment.
 *
 * Why Separate Locators?
 *   - Different environments may have different element selectors
 *   - Stage may have additional/debug elements not in production
 *   - Easier maintenance and updates
 *
 * Selector Types Used:
 *   - CSS Selectors: 'tag.class', 'tag#id', 'tag[attribute="value"]'
 *   - Text Matchers: 'text="Exact"', 'has-text("Contains")'
 *   - Playwright: getByPlaceholder(), getByRole(), etc.
 *
 * ============================================================================
 */

export const LOCATORS = {
  // ==========================================================================
  // LOGIN PAGE LOCATORS
  // ==========================================================================
  // Elements on the authentication/login page

  usernameField: "Enter your email", // Username input placeholder
  passwordField: "Enter your password", // Password input placeholder
  loginButton: "LOGIN", // Login button text

  // ==========================================================================
  // DASHBOARD LOCATORS
  // ==========================================================================
  // Main page elements after successful login

  home: "#home-page", // Home page container ID
  welcomeMessage: "text=Available Apps", // Welcome text indicating dashboard loaded

  // ==========================================================================
  // AVAILABLE APPS LOCATORS
  // ==========================================================================
  // Application cards displayed on the dashboard

  contactsApp: 'p:has-text("Contacts")', // Contacts application card
  signatureApp: 'p:has-text("Signature")', // Signature/e-signature application card
  fileManagerApp: 'p:has-text("File Manager")', // File Manager application card

  // ==========================================================================
  // SELISE STORE LOCATOR
  // ==========================================================================
  // Button to access the SELISE application store

  seliseStoreButton: 'button:has-text("SELISE Store")', // SELISE Store navigation button

  // ==========================================================================
  // HEADER ELEMENTS
  // ==========================================================================
  // Navigation and user interface elements in the header bar

  logo: 'img.logo-icon[src*="arc2-logo"]', // Application logo image
  myAppsMenu: "mat-icon.icon-icn_available_apps", // My Apps menu icon
  profileLogo: 'img[alt="User profile"]', // User profile picture/logo

  // ==========================================================================
  // SIGNATURE MODULE LOCATORS
  // ==========================================================================
  // Elements specific to the e-signature application

  signatureCard: "div.icon mat-icon.icon-icn_esignature", // Signature card icon

  // ==========================================================================
  // STATUS CARDS
  // ==========================================================================
  // Document status indicators in the signature module
  // These represent different stages of document workflow

  yetToSignCard: 'a:has-text("Yet To Sign")', // Documents awaiting signature
  yetToReviewCard: 'a:has-text("Yet To Review")', // Documents pending review
  pendingCard: 'a:has-text("Pending")', // Documents in progress
  completedCard: 'a:has-text("Completed")', // Successfully completed documents

  // ==========================================================================
  // DOCUMENT UPLOAD LOCATORS
  // ==========================================================================
  // Elements for uploading PDF documents

  uploadArea: 'p:has-text("Drag and drop")', // Drag and drop upload zone
  uploadFromDeviceBtn: 'button:has-text("Upload From Device")', // Upload button
  uploadInput: "#inputButton", // Hidden file input element
  chooseFromWorkflowsBtn: 'button:has-text("Choose From Workflows")', // Alternative upload option

  // ==========================================================================
  // ENVELOPE FORM LOCATORS
  // ==========================================================================
  // Form elements for creating a document envelope

  envelopeNameInput: 'input[placeholder="Enter contract name"]', // Envelope/document name input
  addRecipientBtn: 'button:has-text("Add Recipient")', // Add signatory button
  addRecipientsPage: 'text="Add Recipients"', // Recipients page indicator
  prepareDocumentBtn: 'button:has-text("Prepare Document")', // Proceed to document preparation

  // ==========================================================================
  // DOCUMENT SIGNING LOCATORS
  // ==========================================================================
  // Elements for the document signing workflow

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
  // SIGNATURE TYPE LOCATORS
  // ==========================================================================
  // Elements for selecting signature type (Simple vs Advanced)

  signatureTypeAdvance: 'mat-icon.material-icons-outlined:has-text("https")', // Advanced signature type icon
  signatureTypeRadioAdvanced: 'div.sub-type-name:has-text("Advanced for EU (eIDAS)")', // Advanced radio button

  // ==========================================================================
  // DOCUMENT ACTIONS LOCATORS
  // ==========================================================================
  // Elements for document actions like signing

  signPenIcon: 'img[src*="sign-pen-icon"]', // Sign pen icon for signing documents

  // ==========================================================================
  // TEMPLATES AND WORKFLOW LOCATORS
  // ==========================================================================
  // Elements for Templates section and Workflow creation

  templatesSection: 'span.option-text:has-text("Templates")', // Templates section in sidebar
  templatesSectionExpanded: 'span.option-text:not(.collapsed-option-text):has-text("Templates")', // Expanded Templates section
  createWorkflowBtn: "button.create-template-btn", // Create Workflow button
  uploadFromDeviceWorkflow: 'p.upload-from-device-btn:has-text("Upload From Device")', // Upload From Device in workflow

  // ==========================================================================
  // WORKFLOW DETAILS LOCATORS
  // ==========================================================================
  // Elements for workflow creation form

  workflowContractName: 'input[placeholder="Enter contract name"]', // Contract name input
  workflowTagInput: 'input[placeholder="Type and press enter to add tag"]', // Tag input field
  workflowAddRecipientBtn: 'button:has-text("Add Recipient")', // Add Recipient button
  workflowAddDynamicSignatoryBtn: 'span:has-text("Add Dynamic Signatory")', // Add Dynamic Signatory button
  workflowPrepareDocumentBtn: 'button:has-text("Prepare Document")', // Prepare Document button
  workflowSaveWorkflowBtn: 'button:has-text("Save Workflow")', // Save Workflow button
  useWorkflowBtn: 'span:has-text("Use Workflow")', // Use Workflow button
  workflowConfirmBtn: 'button:has-text("Confirm")', // Confirm button
  workflowAddSignatoryInput: 'input[placeholder="Add Signatory"]', // Add Signatory input
  workflowSignatoryEmail: 'div.customer-email:has-text("raaj001@yopmail.net")', // Signatory email option
} as const;
