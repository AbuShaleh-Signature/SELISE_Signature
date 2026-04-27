# SELISE_Signature - UI Automation Framework

A streamlined Playwright-based automation framework for web application testing.

## Repository

- **GitHub**: https://github.com/AbuShaleh-Signature/SELISE_Signature.git
- **Maintained by**: SELISE QA Automation Team

## Features

- **Playwright**: Modern E2E testing with built-in waits and assertions
- **TypeScript**: Type-safe test development
- **Page Object Model**: Clean separation of test logic and page interactions
- **Environment handling**: Configurable `.env` files for stage and production
- **Sequential Tests**: Tests that run in sequence (using login once)
- **Automatic reporting**: HTML reports with screenshots and traces
- **CI/CD ready**: GitHub Actions integration
- **Keyboard Accessibility Tests**: Verify keyboard navigation works properly

## Prerequisites

- [Node.js](https://nodejs.org/en/download/) (18 or higher)

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
├── src/
│   ├── config/
│   │   └── config.ts           # Environment configuration loader
│   ├── locators.ts           # Central locator definitions (production)
│   ├── locators.stage.ts     # Stage environment locators
│   ├── pages/
│   │   └── basePage.ts      # Base page class with sequential test fixture
│   └── utils/
│       └── logger.ts        # Winston logging utility
├── tests/
│   └── ui/
│       ├── smokeTest.spec.ts                    # Smoke tests
│       ├── regressionTest.stage.spec.ts        # Stage regression tests
│       ├── regressionTest.prod.spec.ts       # Production regression tests
│       └── keyboardAccessibilityTest.stage.spec.ts  # Keyboard a11y tests
├── test-data/
│   └── template.pdf        # Test PDF document for upload
├── playwright-report/      # HTML test reports
├── test-results/          # Test run artifacts
├── logs/                 # Application logs
├── .env.stage            # Stage environment variables
├── .env.prod            # Production environment variables
├── playwright.config.ts  # Playwright configuration
├── package.json          # Dependencies and scripts
├── README.md             # This file
└── USER_MANUAL.md        # Detailed user manual
```

## Quick Start

```typescript
import { sequentialTest, expect } from "../../src/pages/basePage";
import { LOCATORS } from "../../src/locators.stage";

sequentialTest.describe.serial("Test Suite", () => {
  sequentialTest("Test name", async ({ page }) => {
    await page.goto(ENV_URL);
    await expect(page.locator(LOCATORS.home)).toBeVisible();
  });
});
```

## Running Tests

| Command | Description |
|---------|-------------|
| `npm run test` | Run all tests |
| `npm run test:headed` | Run with visible browser |
| `npm run test:smoke` | Run smoke tests |
| `npm run test:regression` | Run regression tests |
| `npm run test:critical` | Run critical tests |
| `npm run test:functional` | Run functional tests |
| `npm run test:stage` | Run stage tests (headed) |
| `npm run test:stage:ci` | Run stage tests (headless) |
| `npm run test:prod` | Run prod tests (headed) |
| `npm run test:prod:ci` | Run prod tests (headless) |
| `npm run test:keyboard` | Run keyboard accessibility tests |
| `npm run test:a11y` | Run accessibility tests |

### Run Specific Test

```bash
# Run test 6 only
npx playwright test tests/ui/regressionTest.stage.spec.ts --grep "Test 6:"

# Run test 8 only
npx playwright test tests/ui/regressionTest.stage.spec.ts --grep "Test 8"
```

## Test Suites

### 1. Smoke Tests (`smokeTest.spec.ts`)
- Basic application login verification
- Home page element validation
- Quick sanity checks

### 2. Regression Tests - Stage (`regressionTest.stage.spec.ts`)
- Test 1: Home page verification
- Test 2-5: Landing page contents (commented)
- Test 4: Document upload workflow
- Test 5: Advanced signature workflow
- Test 6: Sign A Document workflow (merged 6.1, 6.2, 6.3)
- Test 7: Create workflow from templates
- Test 8: Use workflow from templates

### 3. Regression Tests - Prod (`regressionTest.prod.spec.ts`)
- Same as stage but for production environment

### 4. Keyboard Accessibility (`keyboardAccessibilityTest.stage.spec.ts`)
- Test 1: Home page keyboard navigation
- Test 2: Signature module keyboard navigation
- Test 3: Form input keyboard navigation
- Test 4: Menu and dropdown navigation
- Test 5: Checkbox and button keyboard activation
- Test 6: Complete keyboard workflow

## Environment Setup

Create `.env.stage` or `.env.prod`:

```bash
URL=https://your-app-url.com/login
USERNAME=your_username
PASSWORD=your_password
```

## Configuration

Edit `playwright.config.ts` to customize:
- Browser projects (Chrome, Edge)
- Timeouts
- Parallel execution
- Reporter settings
- Trace/screenshot options

## Reporting

View HTML reports after test execution:
```bash
npx playwright show-report
```

## Lint & Format

```bash
# Check lint
npm run lint:check

# Fix lint
npm run lint:fix

# Check format
npm run format:check

# Fix format
npm run format:fix
```

## Documentation

For detailed usage instructions, see [USER_MANUAL.md](USER_MANUAL.md).

## License

ISC