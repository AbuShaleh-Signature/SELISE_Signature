# SELISE_Signature - UI Automation Framework

A comprehensive Playwright-based automation framework for testing the SELISE Signature e-signature module across Stage and Production environments.

## Repository

- **GitHub**: https://github.com/AbuShaleh-Signature/SELISE_Signature
- **Maintained by**: SELISE QA Automation Team

## Features

- **Playwright**: Modern E2E testing with auto-waiting, assertions, and traces
- **TypeScript**: Type-safe test development
- **Sequential Tests**: Single login shared across all tests in a suite
- **Environment Handling**: Separate `.env.stage` and `.env.prod` configurations with dedicated locator files
- **Excel Reporting**: Daily test reports and monthly summaries generated as `.xlsx` files
- **Microsoft Teams Notifications**: Automated test result notifications via webhook on scheduled runs
- **CI/CD Ready**: GitHub Actions with scheduled runs (Stage: 07:00 AM BDT, Prod: 04:00 PM BDT)
- **Smoke Testing**: Quick landing page verification on every push/PR

## Prerequisites

- [Node.js](https://nodejs.org/en/download/) (18 or higher)
- npm or pnpm

## Installation

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
│   │   └── basePage.ts             # Base page with sequentialTest fixture
│   ├── reporters/
│   │   ├── excelReporter.ts        # Custom Playwright Excel reporter (daily)
│   │   └── monthlySummary.ts       # Monthly summary generator
│   └── utils/
│       └── logger.ts               # Winston logging utility
├── tests/
│   └── ui/
│       ├── smokeTest.spec.ts                       # Smoke tests (Stage, on push/PR)
│       ├── regressionTest.stage.spec.ts            # Stage regression tests
│       ├── regressionTest.prod.spec.ts             # Production regression tests
│       └── keyboardAccessibilityTest.stage.spec.ts # Keyboard accessibility tests
├── test-data/
│   └── template.pdf                # Test PDF document for upload
├── playwright-report/              # HTML test reports
├── test-results/
│   └── excel-reports/              # Generated Excel reports
│       ├── daily reports (*.xlsx)
│       ├── monthly summaries (*.xlsx)
│       └── monthly-data/ (*.json raw data)
├── logs/                           # Application logs
├── .env.stage                      # Stage environment credentials
├── .env.prod                       # Production environment credentials
├── playwright.config.ts            # Playwright configuration
├── package.json                    # Dependencies and npm scripts
├── README.md                       # This file
└── USER_MANUAL.md                  # Detailed user manual
```

## Quick Start

```typescript
import { sequentialTest, expect } from "../../src/pages/basePage";
import { LOCATORS } from "../../src/locators.stage";

sequentialTest.describe.serial("Test Suite", () => {
  sequentialTest("Test name", async ({ page }) => {
    await expect(page.locator(LOCATORS.home)).toBeVisible();
  });
});
```

## Running Tests

| Command | Description |
|---------|-------------|
| `npm run test` | Run all tests |
| `npm run test:headed` | Run with visible browser |
| `npm run test:smoke` | Run smoke tests (Stage, headed) |
| `npm run test:smoke:ci` | Run smoke tests (Stage, headless) |
| `npm run test:stage` | Run Stage regression (headed) |
| `npm run test:stage:ci` | Run Stage regression (headless) |
| `npm run test:prod` | Run Prod regression (headed) |
| `npm run test:prod:ci` | Run Prod regression (headless) |
| `npm run test:keyboard` | Run keyboard accessibility (headed) |
| `npm run test:keyboard:ci` | Run keyboard accessibility (headless) |
| `npm run test:a11y` | Run accessibility tests (headed) |
| `npm run test:a11y:ci` | Run accessibility tests (headless) |
| `npm run report:monthly:stage` | Generate Stage monthly summary |
| `npm run report:monthly:prod` | Generate Prod monthly summary |
| `npm run report:monthly:all` | Generate both monthly summaries |

### Run Specific Test

```bash
# Run only Test 7
npx playwright test tests/ui/regressionTest.stage.spec.ts --grep "Test 7"

# Run smoke tests only
npx playwright test tests/ui/smokeTest.spec.ts

# Debug a specific test
npx playwright test --debug --grep "Test 7"
```

## Test Suites

### 1. Smoke Tests (`smokeTest.spec.ts`)
- Quick landing page verification on Stage after login
- Checks: home page, available apps, header elements
- Triggered automatically on every push/PR to main/master

### 2. Regression Tests - Stage (`regressionTest.stage.spec.ts`)
| Test | Description |
|------|-------------|
| Test 1 | Home page verification |
| Test 2 | Landing page contents |
| Test 3 | Signature module status cards |
| Test 4 | Document upload and signing workflow |
| Test 5 | Advanced signature workflow |
| Test 6 | Sign A Document workflow |
| Test 7 | Create workflow from Templates |
| Test 8 | Use workflow from Templates |

### 3. Regression Tests - Prod (`regressionTest.prod.spec.ts`)
Same test structure as Stage, runs against the Production environment.

### 4. Keyboard Accessibility (`keyboardAccessibilityTest.stage.spec.ts`)
Tests keyboard-only navigation across the application.

## GitHub Actions Workflow

| Trigger | Job | Schedule |
|---------|-----|----------|
| Push/PR to `main`/`master` | `smoke-test` | On every push/PR |
| `schedule` | `test-stage` | 07:00 AM BDT daily |
| `schedule` | `test-prod` | 04:00 PM BDT daily |
| `workflow_dispatch` | Choose environment | Manual |

### Teams Notifications

Scheduled regression runs send results to Microsoft Teams (requires `TEAMS_WEBHOOK_URL` secret). Each notification includes:
- Repository name, environment, status (with emoji), branch
- Link to GitHub Actions run for downloading Excel reports

## Reporting

### Excel Reports (Generated automatically on every run)
- **Daily**: `test-results/excel-reports/{env}_report_YYYY-MM-DD.xlsx`
  - Daily Test Results (color-coded by status)
  - Summary (pass rate, duration)
  - Failed Tests (error details)
- **Monthly**: `test-results/excel-reports/{env}_monthly_summary_YYYY-MM.xlsx`
  - Overview
  - Daily Breakdown
  - Flaky Tests
  - Failed Tests Analysis
  - Test Trends

### HTML Reports
```bash
npx playwright show-report
```

### View Reports
```bash
# List generated Excel reports
ls test-results/excel-reports/*.xlsx

# View latest HTML report
npx playwright show-report
```

## Environment Setup

Create `.env.stage` or `.env.prod`:
```bash
URL=https://your-app-url.com/login
USERNAME=your_username
PASSWORD=your_password
```

Add Teams webhook (GitHub secret `TEAMS_WEBHOOK_URL`) for notifications.

## Lint & Format

```bash
npm run lint:check     # Check for lint errors
npm run lint:fix       # Auto-fix lint errors
npm run format:check   # Check code formatting
npm run format:fix     # Auto-format code
```

## Documentation

For detailed usage instructions, see [USER_MANUAL.md](USER_MANUAL.md).

## License

ISC
