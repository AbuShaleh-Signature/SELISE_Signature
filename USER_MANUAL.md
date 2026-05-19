# SELISE_Signature - User Manual

## Table of Contents

1. [Framework Overview](#framework-overview)
2. [Project Structure](#project-structure)
3. [Setup & Installation](#setup--installation)
4. [Configuration](#configuration)
5. [Writing Tests](#writing-tests)
6. [Running Tests](#running-tests)
7. [Test Suites](#test-suites)
8. [Reporting](#reporting)
9. [CI/CD & GitHub Actions](#cicd--github-actions)
10. [Microsoft Teams Notifications](#microsoft-teams-notifications)
11. [Best Practices](#best-practices)
12. [Troubleshooting](#troubleshooting)

---

## Framework Overview

SELISE_Signature is a Playwright-based UI automation framework built for testing the SELISE Signature e-signature module across Stage and Production environments.

### Key Features

- **Playwright**: Modern E2E testing with auto-waiting, built-in assertions, and trace viewer
- **TypeScript**: Type-safe test development
- **Sequential Tests**: Single login shared across all tests in a suite (via `basePage.ts`)
- **Environment Management**: Separate `.env.stage` / `.env.prod` and `locators.stage.ts` / `locators.prod.ts`
- **Excel Reporting**: Daily test reports and monthly summaries generated automatically
- **Teams Notifications**: Scheduled regression results posted to Microsoft Teams via webhook
- **CI/CD Ready**: GitHub Actions with scheduled runs and manual dispatch

### Repository

- **GitHub**: https://github.com/AbuShaleh-Signature/SELISE_Signature
- **Maintained by**: SELISE QA Automation Team

---

## Project Structure

```
SELISE_Signature/
├── .github/
│   └── workflows/
│       └── playwright.yml          # GitHub Actions CI/CD workflow
├── src/
│   ├── config/
│   │   └── config.ts               # Environment configuration loader
│   ├── locators.prod.ts            # Production environment locators
│   ├── locators.stage.ts           # Stage environment locators
│   ├── pages/
│   │   └── basePage.ts             # Base page class with sequentialTest fixture
│   ├── reporters/
│   │   ├── excelReporter.ts        # Custom Playwright reporter for daily Excel reports
│   │   └── monthlySummary.ts       # Monthly summary generator from daily data
│   └── utils/
│       └── logger.ts               # Winston logging utility
├── tests/
│   └── ui/
│       ├── smokeTest.spec.ts                       # Smoke tests (Stage)
│       ├── regressionTest.stage.spec.ts            # Stage regression tests
│       ├── regressionTest.prod.spec.ts             # Production regression tests
│       └── keyboardAccessibilityTest.stage.spec.ts # Keyboard accessibility tests
├── test-data/
│   └── template.pdf                # Test PDF document for upload
├── playwright-report/              # HTML test reports (auto-generated)
├── test-results/
│   └── excel-reports/              # Excel reports (auto-generated)
│       ├── {env}_report_YYYY-MM-DD.xlsx           # Daily report
│       ├── {env}_monthly_summary_YYYY-MM.xlsx     # Monthly summary
│       └── monthly-data/
│           └── {env}_YYYY-MM.json                 # Raw daily data
├── logs/                           # Application logs
├── .env.stage                      # Stage environment credentials
├── .env.prod                       # Production environment credentials
├── playwright.config.ts            # Playwright configuration
├── package.json                    # Dependencies and npm scripts
├── README.md                       # Quick reference
└── USER_MANUAL.md                  # This file
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

### GitHub Secrets (for CI/CD)

| Secret | Purpose |
|--------|---------|
| `TEAMS_WEBHOOK_URL` | Microsoft Teams incoming webhook URL for test notifications |

### Playwright Configuration

Edit `playwright.config.ts`:

| Setting | Description |
|---------|-------------|
| `testDir` | Test file location (`./tests`) |
| `projects` | Browser configurations (Chromium) |
| `retries` | Retry failed tests (2 on CI, 0 locally) |
| `workers` | Parallel workers (1 on CI) |
| `reporter` | `line`, `html`, `json`, and custom `excelReporter` |
| `trace` | Capture traces on first retry |

---

## Writing Tests

### Test Structure

```typescript
import { config } from "dotenv";
import { resolve } from "path";

// Load environment-specific config
config({ path: resolve(process.cwd(), ".env.stage"), override: true });

const ENV_URL_FULL = process.env.URL || "";
const ENV_URL = ENV_URL_FULL.replace(/\/login$/, "");
const ENV_NAME = "STAGE";

// Pass credentials to basePage for sequential login
(globalThis as any).__TEST_ENV_URL__ = ENV_URL_FULL;
(globalThis as any).__TEST_ENV_USERNAME__ = process.env.USERNAME || "";
(globalThis as any).__TEST_ENV_PASSWORD__ = process.env.PASSWORD || "";

import { sequentialTest, expect } from "../../src/pages/basePage";
import { LOCATORS } from "../../src/locators.stage";

sequentialTest.describe.serial("Test Suite Name", () => {
  sequentialTest.setTimeout(900000);

  sequentialTest("Test name", async ({ page }) => {
    await page.goto(`${ENV_URL}/e-signature`);
    await expect(page.locator(LOCATORS.home)).toBeVisible();
  });
});
```

### Sequential Tests

Use `sequentialTest` from `basePage` to share a single login session across all tests:

```typescript
import { sequentialTest, expect } from "../../src/pages/basePage";

sequentialTest.describe.serial("My Suite", () => {
  sequentialTest("Test 1", async ({ page }) => { /* logged in */ });
  sequentialTest("Test 2", async ({ page }) => { /* still logged in */ });
});
```

### Locators

Define selectors in environment-specific locator files:

```typescript
// src/locators.stage.ts
export const LOCATORS = {
  home: "#home-page",
  contactsApp: 'p:has-text("Contacts")',
  signatureApp: 'p:has-text("Signature")',
  uploadArea: 'p:has-text("Drag and drop")',
  uploadInput: "#inputButton",
  envelopeNameInput: 'input[placeholder="Enter contract name"]',
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
npm run test                    # Run all tests
npm run test:headed             # Run with visible browser
npm run test:smoke              # Run smoke tests (Stage, headed)
npm run test:smoke:ci           # Run smoke tests (Stage, headless)
npm run test:stage              # Run Stage regression (headed)
npm run test:stage:ci           # Run Stage regression (headless)
npm run test:prod               # Run Prod regression (headed)
npm run test:prod:ci            # Run Prod regression (headless)
npm run test:keyboard           # Run keyboard tests (headed)
npm run test:keyboard:ci        # Run keyboard tests (headless)
npm run test:a11y               # Run accessibility tests (headed)
npm run test:a11y:ci            # Run accessibility tests (headless)
```

### Report Generation

```bash
npm run report:monthly:stage    # Generate Stage monthly summary
npm run report:monthly:prod     # Generate Prod monthly summary
npm run report:monthly:all      # Generate both monthly summaries
```

### Run Specific Tests

```bash
# Run specific test by name
npx playwright test tests/ui/regressionTest.stage.spec.ts --grep "Test 7"

# Run only smoke tests
npx playwright test tests/ui/smokeTest.spec.ts

# Run with debugging
npx playwright test --debug --grep "Test 7"

# List all available tests
npx playwright test --list
```

---

## Test Suites

### 1. Smoke Tests (`smokeTest.spec.ts`)

Quick landing page verification on Stage after login:
- Home page visibility
- Available apps (Contacts, Signature, File Manager)
- Header elements (Logo, Profile, My Apps)

### 2. Regression Tests - Stage (`regressionTest.stage.spec.ts`)

Full end-to-end tests for STAGE environment:

| Test | Description |
|------|-------------|
| Test 1 | Home page verification |
| Test 2 | Landing page contents (apps, store, header) |
| Test 3 | Signature module status cards |
| Test 4 | Document upload and signing workflow |
| Test 5 | Advanced signature workflow |
| Test 6 | Sign A Document workflow |
| Test 7 | Create workflow from Templates |
| Test 8 | Use workflow from Templates |

### 3. Regression Tests - Prod (`regressionTest.prod.spec.ts`)

Same test structure as Stage, runs against PRODUCTION environment with its own locator file (`locators.prod.ts`).

### 4. Keyboard Accessibility (`keyboardAccessibilityTest.stage.spec.ts`)

Tests keyboard-only navigation across the application.

---

## Reporting

### Excel Reports (Auto-generated on every test run)

Reports are saved to `test-results/excel-reports/` and are **never deleted**.

#### Daily Report (`{env}_report_YYYY-MM-DD.xlsx`)

| Sheet | Description |
|-------|-------------|
| Daily Test Results | All tests with name, suite, status, duration, file, line, error (color-coded: green=pass, red=fail, yellow=skip) |
| Summary | Pass rate, total tests, duration, environment info |
| Failed Tests | Dedicated sheet for failures with full error traces |

#### Monthly Summary (`{env}_monthly_summary_YYYY-MM.xlsx`)

| Sheet | Description |
|-------|-------------|
| Overview | Overall stats for the month (total runs, pass rate, execution time) |
| Daily Breakdown | Per-day pass/fail counts with color-coded pass rates |
| Flaky Tests | Tests that sometimes pass, sometimes fail (ranked by fail rate) |
| Failed Tests Analysis | Most-frequently-failing tests with dates and errors |
| Test Trends | Per-test success rate across all runs in the month |

### Raw Data

Daily test records are appended to `test-results/excel-reports/monthly-data/{env}_YYYY-MM.json`. This data persists and is never removed — the monthly summary regenerates from it on every run.

### HTML Reports

```bash
npx playwright show-report
```

---

## CI/CD & GitHub Actions

### Workflow: `.github/workflows/playwright.yml`

| Trigger | Job | What It Runs |
|---------|-----|--------------|
| Push/PR to `main`/`master` | `smoke-test` | Smoke tests on Stage (15 min timeout) |
| Schedule: 09:00 AM BDT | `test-stage` | Full regression on Stage |
| Schedule: 04:00 PM BDT | `test-prod` | Full regression on Prod |
| Manual (`workflow_dispatch`) | Choose: stage/prod/all | Selected environment |

### Artifacts

| Artifact | Retention | Contents |
|----------|-----------|----------|
| `playwright-smoke-report` | 30 days | HTML report (push/PR only) |
| `playwright-html-report-stage` | 30 days | HTML report (Stage scheduled) |
| `playwright-html-report-prod` | 30 days | HTML report (Prod scheduled) |
| `playwright-excel-reports-stage` | 90 days | Daily + monthly Excel files |
| `playwright-excel-reports-prod` | 90 days | Daily + monthly Excel files |
| `playwright-monthly-data-stage` | 90 days | Raw JSON data for summaries |
| `playwright-monthly-data-prod` | 90 days | Raw JSON data for summaries |

---

## Microsoft Teams Notifications

Scheduled regression runs (Stage at 09:00 AM, Prod at 04:00 PM BDT) post results to a Teams channel via an incoming webhook.

### Setup

1. In Teams: Channel → **Connectors** → **Incoming Webhook** → **Configure** → Copy URL
2. In GitHub: Repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
   - Name: `TEAMS_WEBHOOK_URL`
   - Value: Paste the webhook URL

### Notification Format

```
Stage/Prod Regression Results
─────────────────────────────
Repository    AbuShaleh-Signature/SELISE_Signature
Test          all
Environment   stage/prod
Status        ✅ success / ❌ failure
Trigger       Scheduled (09:00 AM / 04:00 PM BDT)
Branch        main
─────────────────────────────
Excel reports available in Actions artifacts
[View Report](link to GitHub Actions run)
```

> Smoke tests do **not** send Teams notifications.

---

## Best Practices

### Test Organization

1. **Descriptive test names**: `"Create workflow from Templates"` not `"test 7"`
2. **Use locators file**: All selectors in `locators.stage.ts` or `locators.prod.ts`
3. **Use `sequentialTest`**: When tests share login/session
4. **One test file per environment**: `*.stage.spec.ts` and `*.prod.spec.ts`

### Code Style

- Files: kebab-case (`base-page.ts`)
- Classes: PascalCase (`BasePage`)
- Methods/variables: camelCase (`loginToApplication`)
- Constants: `as const` objects

### Test Data

- Store credentials in `.env` files (never commit them)
- Use `test-data/` for files to upload
- Avoid hardcoding values in tests

### Locator Management

- Keep `locators.stage.ts` and `locators.prod.ts` in sync
- Use descriptive names: `uploadInput` not `#inputButton`
- Group locators by module with comments

---

## Troubleshooting

### Tests Not Found

```bash
npx playwright test --list
```

### Environment Issues

```bash
# Verify environment file exists
ls .env.*

# Check credentials are loaded
node -e "const {config}=require('dotenv'); config({path:'.env.stage'}); console.log(process.env.URL)"
```

### Browser Launch Failures

```bash
# Reinstall browsers
npx playwright install

# Install system dependencies (Linux/CI)
npx playwright install --with-deps
```

### Excel Report Not Generated

- Ensure `TEST_ENV` is set (auto-detected from script name or test file path)
- Check `playwright.config.ts` has the `excelReporter` registered

### File Lock Errors (Windows)

- Close any Excel files that may have the report open
- The reporter includes retry logic for EBUSY errors

### Debug Mode

```bash
# Run in headed mode with visible browser
npm run test:headed

# Use page.pause() for interactive debugging
await page.pause();

# Run with Playwright debug flag
npx playwright test --debug --grep "Test 7"
```

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npx playwright install` | Install browsers |
| `npm run test:smoke:ci` | Run smoke tests (Stage) |
| `npm run test:stage:ci` | Run Stage regression |
| `npm run test:prod:ci` | Run Prod regression |
| `npm run report:monthly:all` | Generate monthly summaries |
| `npx playwright show-report` | View HTML report |
| `npm run lint:check` | Check lint |
| `npm run format:fix` | Auto-format code |

---

**Last Updated**: May 7, 2026
**Version**: 1.1.0
**GitHub**: https://github.com/AbuShaleh-Signature/SELISE_Signature
**Maintained by**: SELISE QA Automation Team
