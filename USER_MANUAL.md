# SELISE_Signature - User Manual

## Table of Contents

1. [Framework Overview](#framework-overview)
2. [Project Structure](#project-structure)
3. [Setup & Installation](#setup--installation)
4. [Configuration](#configuration)
5. [Writing Tests](#writing-tests)
6. [Running Tests](#running-tests)
7. [Test Suites](#test-suites)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)
10. [Azure DevOps Integration](#azure-devops-integration)

---

## Framework Overview

SELISE_Signature is a Playwright-based UI automation framework built for testing the SELISE Signature e-signature module.

### Key Features

- **Playwright**: Modern E2E testing with auto-waiting and assertions
- **TypeScript**: Type-safe development
- **Sequential Tests**: Share login across tests for faster execution
- **Page Object Model**: Clean separation of concerns
- **Environment Management**: Stage and production configurations
- **Automatic Reporting**: HTML reports, screenshots, and traces on failures
- **CI/CD Ready**: GitHub Actions integration

### Repository

- **GitHub**: https://github.com/AbuShaleh-Signature/SELISE_Signature.git
- **Maintained by**: SELISE QA Automation Team

---

## Project Structure

```
SELISE_Signature/
├── src/
│   ├── config/
│   │   └── config.ts           # Environment configuration loader
│   ├── locators.ts           # Production locators
│   ├── locators.stage.ts      # Stage environment locators
│   ├── pages/
│   │   └── basePage.ts        # Base page class & sequentialTest fixture
│   └── utils/
│       └── logger.ts          # Winston logger
├── tests/
│   └── ui/
│       ├── smokeTest.spec.ts                    # Smoke tests
│       ├── regressionTest.stage.spec.ts    # Stage regression
│       ├── regressionTest.prod.spec.ts      # Production regression
│       └── keyboardAccessibilityTest.stage.spec.ts  # Keyboard a11y
├── test-data/
│   └── template.pdf         # Test PDF for upload
├── playwright-report/      # Generated HTML reports
├── test-results/          # Test artifacts
├── logs/               # Application logs
├── .env.stage          # Stage environment variables
├── .env.prod          # Production environment variables
└── playwright.config.ts  # Playwright configuration
```

---

## Setup & Installation

### Prerequisites

- Node.js 18 or higher
- npm or pnpm

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/AbuShaleh-Signature/SELISE_Signature.git
   cd SELISE_Signature
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

---

## Configuration

### Environment Variables

Create `.env.stage`:
```bash
URL=https://app.selisestage.com/login
USERNAME=your_username
PASSWORD=your_password
```

Or `.env.prod`:
```bash
URL=https://selise.app/login
USERNAME=your_username
PASSWORD=your_password
```

### Playwright Configuration

Edit `playwright.config.ts`:

| Setting | Description |
|---------|-------------|
| `testDir` | Test file location |
| `projects` | Browser configurations |
| `retries` | Retry failed tests |
| `reporter` | HTML reporting |
| `trace` | Capture traces on failure |

---

## Writing Tests

### Test Structure

```typescript
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.stage"), override: true });

const ENV_URL_FULL = process.env.URL || "";
const ENV_URL = ENV_URL_FULL.replace(/\/login$/, "");

(globalThis as any).__TEST_ENV_URL__ = ENV_URL_FULL;
(globalThis as any).__TEST_ENV_USERNAME__ = process.env.USERNAME || "";
(globalThis as any).__TEST_ENV_PASSWORD__ = process.env.PASSWORD || "";

import { sequentialTest, expect } from "../../src/pages/basePage";
import { LOCATORS } from "../../src/locators.stage";

sequentialTest.describe.serial("Test Suite Name", () => {
  sequentialTest.setTimeout(600000);

  sequentialTest("Test name", async ({ page }) => {
    await page.goto(`${ENV_URL}/e-signature`);
    await expect(page.locator(LOCATORS.uploadArea)).toBeVisible();
  });
});
```

### Sequential Tests

Use `sequentialTest` from `basePage` to share login across tests:

```typescript
import { sequentialTest, expect } from "../../src/pages/basePage";

sequentialTest.describe.serial("My Suite", () => {
  // All tests share the same browser session
  sequentialTest("Test 1", async ({ page }) => { /* ... */ });
  sequentialTest("Test 2", async ({ page }) => { /* ... */ });
});
```

### Locators

Define selectors in `src/locators.stage.ts`:

```typescript
export const LOCATORS = {
  home: "#home-page",
  uploadArea: 'div:has-text("Upload From Device")',
  uploadInput: 'input[type="file"]',
  envelopeNameInput: 'input[placeholder="Enter envelope name"]',
  addRecipientBtn: 'button:has-text("Add Recipient")',
  prepareDocumentBtn: 'button:has-text("Prepare Document")',
  sendDocumentBtn: 'button:has-text("Send Document")',
} as const;
```

### Assertions

```typescript
// Element visibility
await expect(page.locator(".element")).toBeVisible();

// Text content
await expect(page.locator(".message")).toHaveText("Success");

// URL verification
await expect(page).toHaveURL(/dashboard/);
```

---

## Running Tests

### Basic Commands

```bash
# Run all tests
npm run test

# Run in headed mode
npm run test:headed

# Run smoke tests
npm run test:smoke

# Run with stage environment (headed)
npm run test:stage

# Run with stage environment (headless)
npm run test:stage:ci

# Run with prod environment (headed)
npm run test:prod

# Run with prod environment (headless)
npm run test:prod:ci

# Run keyboard accessibility tests
npm run test:keyboard
npm run test:keyboard:ci

# Run accessibility tests
npm run test:a11y
npm run test:a11y:ci
```

### Run Specific Tests

```bash
# Run specific test by name
npx playwright test tests/ui/regressionTest.stage.spec.ts --grep "Test 6:"

# Run single test file
npx playwright test tests/ui/smokeTest.spec.ts

# Run with debugging
npx playwright test --debug
```

---

## Test Suites

### 1. Smoke Tests (`smokeTest.spec.ts`)

Quick sanity checks:
- Verify application login
- Verify home page loads

### 2. Regression Tests - Stage (`regressionTest.stage.spec.ts`)

Full end-to-end tests for STAGE environment:

| Test | Description |
|------|-------------|
| Test 1 | Home page verification |
| Test 4 | Document upload and signing workflow |
| Test 5 | Advanced signature workflow |
| Test 6 | Sign A Document workflow (merged) |
| Test 7 | Create workflow from templates |
| Test 8 | Use workflow from templates |

### 3. Regression Tests - Prod (`regressionTest.prod.spec.ts`)

Same as stage but for PRODUCTION environment.

### 4. Keyboard Accessibility (`keyboardAccessibilityTest.stage.spec.ts`)

Tests keyboard-only navigation:

| Test | Description |
|------|-------------|
| Test 1 | Home page keyboard navigation |
| Test 2 | Signature module keyboard navigation |
| Test 3 | Form input keyboard navigation |
| Test 4 | Menu and dropdown navigation |
| Test 5 | Checkbox and button activation |
| Test 6 | Complete keyboard workflow |

---

## Best Practices

### Test Organization

1. **Use descriptive test names**: "should upload and sign document"
2. **One assertion per test**: For clear failure diagnosis
3. **Use locators file**: Store selectors in `locators.stage.ts`
4. **Use sequentialTests**: When tests share login/session

### Code Style

- Files: kebab-case (`login-page.ts`)
- Classes: PascalCase (`LoginPage`)
- Methods: camelCase (`loginToApplication`)
- Constants: `as const` objects

### Test Data

- Store credentials in `.env` files
- Use `test-data/` for files to upload
- Avoid hardcoding values in tests

---

## Troubleshooting

### Tests Not Found

```bash
# List all tests
npx playwright test --list
```

### Environment Issues

```bash
# Verify environment file exists
ls .env.*

# Check environment variables
node -e "console.log(process.env.URL)"
```

### Browser Launch Failures

```bash
# Reinstall browsers
npx playwright install

# Install system dependencies
npx playwright install --with-deps
```

### Debug Mode

```bash
# Run in headed mode
npm run test:headed

# Use page.pause() for interactive debugging
await page.pause();
```

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npx playwright install` | Install browsers |
| `npm run test` | Run all tests |
| `npm run test:headed` | Run with visible browser |
| `npm run test:stage` | Run stage tests |
| `npm run test:prod` | Run prod tests |
| `npm run test:keyboard` | Run keyboard tests |
| `npx playwright show-report` | View HTML report |
| `npm run lint:check` | Check lint |
| `npm run format:check` | Check format |

---

## Azure DevOps Integration

This guide explains how to integrate the SELISE_Signature Playwright tests with Azure DevOps for CI/CD pipelines.

### Prerequisites

- Azure DevOps organization with a project
- Azure Pipelines access
- Git repository connected to Azure DevOps

### Method 1: Using Azure Pipelines YAML

#### Step 1: Create Pipeline Configuration

Create a file named `azure-pipelines.yml` in the repository root:

```yaml
# Azure DevOps Pipeline for SELISE_Signature UI Tests
# Trigger on changes to main branch or specific paths
trigger:
  branches:
    include:
      - main
      - develop
  paths:
    include:
      - tests/**
      - src/**
      - playwright.config.ts
      - package.json

# Pool configuration
pool:
  vmImage: 'ubuntu-latest'

# Environment variables (use secrets for credentials)
variables:
  ENVIRONMENT: 'stage'  # or 'prod'

stages:
  # ==========================================================================
  # STAGE 1: INSTALL DEPENDENCIES
  # ==========================================================================
  - stage: Install
    displayName: 'Install Dependencies'
    jobs:
      - job: InstallDeps
        displayName: 'Install npm dependencies'
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: '18.x'
            displayName: 'Install Node.js'

          - task: Npm@1
            inputs:
              command: 'install'
              workingDir: '$(System.DefaultWorkingDirectory)'
            displayName: 'npm install'

          - task: Npm@1
            inputs:
              command: 'custom'
              customCommand: 'exec playwright install --with-deps'
            displayName: 'Install Playwright browsers'

  # ==========================================================================
  # STAGE 2: RUN TESTS
  # ==========================================================================
  - stage: Test_Stage
    displayName: 'Run Stage Tests'
    dependsOn: Install
    condition: succeeded()
    jobs:
      - job: RunStageTests
        displayName: 'Run Stage UI Tests'
        steps:
          - task: Npm@1
            inputs:
              command: 'custom'
              customCommand: 'exec playwright install-deps'
            displayName: 'Install system dependencies'
            condition: false

          - script: |
              cd $(System.DefaultWorkingDirectory)
              npm run test:stage:ci
            displayName: 'Run Stage Tests (Headless)'
            env:
              CI: true
              URL: $(URL)
              USERNAME: $(USERNAME)
              PASSWORD: $(PASSWORD)
            continueOnError: true

          - task: PublishTestResults@2
            inputs:
              testResultsFiles: 'playwright-report/**/*.html'
              testResultsFormat: 'Html'
              mergeTestResults: false
            displayName: 'Publish HTML Test Results'
            condition: succeededOrFailed()

          - task: PublishTestResults@2
            inputs:
              testResultsFiles: 'test-results/*.xml'
              testResultsFormat: 'JUnit'
            displayName: 'Publish JUnit Test Results'
            condition: succeededOrFailed()

  # ==========================================================================
  # STAGE 3: RUN SMOKE TESTS
  # ==========================================================================
  - stage: Smoke_Test
    displayName: 'Run Smoke Tests'
    dependsOn: Install
    condition: succeeded()
    jobs:
      - job: RunSmokeTests
        displayName: 'Run Smoke Tests'
        steps:
          - script: |
              cd $(System.DefaultWorkingDirectory)
              npm run test:smoke
            displayName: 'Run Smoke Tests'
            env:
              CI: true
              URL: $(URL)
              USERNAME: $(USERNAME)
              PASSWORD: $(PASSWORD)
            continueOnError: true

          - task: PublishTestResults@2
            inputs:
              testResultsFiles: 'test-results/*.xml'
              testResultsFormat: 'JUnit'
            displayName: 'Publish Smoke Test Results'
            condition: succeededOrFailed()

  # ==========================================================================
  # STAGE 4: RUN KEYBOARD ACCESSIBILITY TESTS
  # ==========================================================================
  - stage: Keyboard_Test
    displayName: 'Run Keyboard Accessibility Tests'
    dependsOn: Install
    condition: succeeded()
    jobs:
      - job: RunKeyboardTests
        displayName: 'Run Keyboard Accessibility Tests'
        steps:
          - script: |
              cd $(System.DefaultWorkingDirectory)
              npm run test:keyboard:ci
            displayName: 'Run Keyboard Tests'
            env:
              CI: true
              URL: $(URL)
              USERNAME: $(USERNAME)
              PASSWORD: $(PASSWORD)
            continueOnError: true

          - task: PublishTestResults@2
            inputs:
              testResultsFiles: 'test-results/*.xml'
              testResultsFormat: 'JUnit'
            displayName: 'Publish Keyboard Test Results'
            condition: succeededOrFailed()

  # ==========================================================================
  # STAGE 5: LINT AND FORMAT CHECK
  # ==========================================================================
  - stage: Lint
    displayName: 'Lint and Format Check'
    dependsOn: Install
    condition: succeeded()
    jobs:
      - job: LintCheck
        displayName: 'Check Lint and Format'
        steps:
          - script: |
              cd $(System.DefaultWorkingDirectory)
              npm run lint:check
            displayName: 'Run Lint Check'
            continueOnError: true

          - script: |
              cd $(System.DefaultWorkingDirectory)
              npm run format:check
            displayName: 'Run Format Check'
            continueOnError: true

# ==========================================================================
# ARTIFACTS
# ==========================================================================
resources:
  repositories:
    - repository: self
      type: git
      ref: main

artifacts:
  - artifact: playwright-report
    pattern: 'playwright-report/**/*'
    displayName: 'Playwright HTML Report'

  - artifact: test-logs
    pattern: 'test-results/**/*'
    displayName: 'Test Logs'
```

#### Step 2: Configure Pipeline Variables in Azure DevOps

1. Go to **Pipelines** → **Library** → **Variable groups**
2. Create a new variable group (e.g., `SELISE_QA_Environment`)
3. Add the following variables:

| Variable | Value | Secret |
|---------|-------|--------|
| `ENVIRONMENT` | `stage` | No |
| `URL` | `https://app.selisestage.com/login` | No |
| `USERNAME` | `your_username` | No |
| `PASSWORD` | `your_password` | **Yes** |

4. Link the variable group to the pipeline

#### Step 3: Create the Pipeline in Azure DevOps

1. Go to **Pipelines** → **New Pipeline**
2. Select **Azure Repos Git** as the source
3. Select the `azure-pipelines.yml` file
4. Click **Run Pipeline**

---

### Method 2: Using Azure DevOps Classic UI

#### Step 1: Create a New Build Pipeline

1. Go to **Pipelines** → **Builds** → **New Pipeline**
2. Select **Use the classic editor**
3. Select your repository

#### Step 2: Configure Build Tasks

Add the following tasks:

1. **NodeTool@0**: Install Node.js 18.x
2. **npm@1**: Install npm dependencies
   - Command: `install`
3. **npm@1**: Install Playwright browsers
   - Command: `custom`
   - Custom command: `exec playwright install --with-deps`
4. **npm@1**: Run tests
   - Command: `custom`
   - Custom command: `run test:stage:ci`
   - Working directory: `$(System.DefaultWorkingDirectory)`
5. **PublishTestResults@2**: Publish test results
   - Test results files: `test-results/*.xml`
   - Test results format: `JUnit`

#### Step 3: Configure Variables

Add these variables in the pipeline:

| Variable | Value |
|----------|-------|
| `CI` | `true` |
| `URL` | `https://app.selisestage.com/login` |
| `USERNAME` | `$(USERNAME)` |
| `PASSWORD` | `$(PASSWORD)` |

---

### Method 3: Separate Stage and Prod Pipelines

Create `azure-pipelines-stage.yml`:

```yaml
trigger:
  branches:
    include:
      - main

pool:
  vmImage: 'ubuntu-latest'

stages:
  - stage: Install
    jobs:
      - job: Install
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: '18.x'

          - task: Npm@1
            inputs:
              command: 'install'

          - script: |
              npx playwright install --with-deps

  - stage: Test_Stage
    dependsOn: Install
    jobs:
      - job: Test
        steps:
          - script: |
              npm run test:stage:ci
            env:
              CI: true
              URL: $(URL)
              USERNAME: $(USERNAME)
              PASSWORD: $(PASSWORD)

          - task: PublishTestResults@2
            inputs:
              testResultsFiles: 'test-results/*.xml'
              testResultsFormat: 'JUnit'
```

Create `azure-pipelines-prod.yml`:

```yaml
trigger:
  branches:
    include:
      - main

pool:
  vmImage: 'ubuntu-latest'

stages:
  - stage: Install
    jobs:
      - job: Install
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: '18.x'

          - task: Npm@1
            inputs:
              command: 'install'

          - script: |
              npx playwright install --with-deps

  - stage: Test_Prod
    dependsOn: Install
    jobs:
      - job: Test
        steps:
          - script: |
              npm run test:prod:ci
            env:
              CI: true
              URL: $(URL)
              USERNAME: $(USERNAME)
              PASSWORD: $(PASSWORD)

          - task: PublishTestResults@2
            inputs:
              testResultsFiles: 'test-results/*.xml'
              testResultsFormat: 'JUnit'
```

---

### Azure DevOps Test Plans Integration

For manual test execution:

1. **Create Test Plan**:
   - Go to **Test Plans** → **New Test Plan**
   - Name: `SELISE Signature UI Tests`

2. **Add Test Cases**:
   - Link test cases to automated test methods
   - Use the test case ID in Playwright test annotations

3. **Run Tests via Test Plan**:
   - Execute automated tests as part of test plan
   - Map results back to Azure DevOps Test Plans

---

### Viewing Test Results

#### In Azure DevOps:

1. **Build Summary**: View pass/fail status
2. **Test Results Tab**: Detailed test breakdown
3. **Attachments**: Download HTML reports and logs

#### Download Playwright Reports:

```bash
# In pipeline, reports are saved as artifacts
# Download from: Build → Artifacts → playwright-report
```

---

### Troubleshooting Azure DevOps Issues

#### Issue: Browser Not Found

```yaml
# Add before running tests
- task: Npm@1
  inputs:
    command: 'custom'
    customCommand: 'exec playwright install --with-deps'
```

#### Issue: Tests Timeout

```yaml
# Increase timeout in pipeline
- script: |
    npm run test:stage:ci
  env:
    CI: true
    PLAYWRIGHT_TIMEOUT: 120000
```

#### Issue: Credentials Not Loading

1. Ensure variable group is linked to pipeline
2. Check **Library** → **Variable groups** → **Pipeline support**
3. Verify secrets are marked as **Secret**

---

### Quick Reference: Azure DevOps Scripts

| Task | Description |
|------|-------------|
| `npm run test:stage:ci` | Run stage tests headless |
| `npm run test:prod:ci` | Run prod tests headless |
| `npm run test:smoke` | Run smoke tests |
| `npm run test:keyboard:ci` | Run keyboard tests headless |

---

**Last Updated**: April 27, 2026
**Version**: 1.0.0
**GitHub**: https://github.com/AbuShaleh-Signature/SELISE_Signature.git
**Maintained by**: SELISE QA Automation Team