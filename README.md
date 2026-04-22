# SELISE_Signature - UI Automation Framework

A streamlined Playwright-based automation framework for web application testing.

## Authors

- **SELISE Digital Platform**
- Maintained by: QA Automation Team

## Features

- **Playwright**: Modern E2E testing with built-in waits and assertions
- **TypeScript**: Type-safe test development
- **Page Object Model**: Clean separation of test logic and page interactions
- **Environment handling**: Configurable `.env` files for stage and production
- **Automatic reporting**: HTML reports with screenshots and traces
- **CI/CD ready**: GitHub Actions integration

## Prerequisites

- [Node.js](https://nodejs.org/en/download/) (18 or higher)

## Installation

1. Clone the repository
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
│   │   └── config.ts         # Environment configuration loader
│   ├── locators.ts            # Central locator definitions
│   ├── pages/
│   │   └── basePage.ts        # Base page class
│   └── utils/
│       └── logger.ts          # Winston logging utility
├── tests/
│   └── ui/
│       └── smokeTest.spec.ts  # Test specifications
├── playwright-report/         # HTML test reports
├── test-results/              # Test run artifacts
├── logs/                      # Application logs
├── .env.stage                 # Stage environment variables
├── .env.prod                  # Production environment variables
├── playwright.config.ts       # Playwright configuration
├── package.json               # Dependencies and scripts
├── README.md                  # This file
└── USER_MANUAL.md             # Detailed user manual
```

## Quick Start

```typescript
import { test, expect } from "@playwright/test";
import { environment } from "./src/config/config";
import { LOCATORS } from "./src/locators";

test("login test", async ({ page }) => {
  await page.goto(environment.url);
  await page.locator(LOCATORS.usernameField).fill(environment.credentials.username);
  await page.getByPlaceholder(LOCATORS.passwordField).fill(environment.credentials.password);
  await page.getByRole("button", { name: LOCATORS.loginButton }).click();
  await expect(page).toHaveURL(/dashboard/);
});
```

## Running Tests

```bash
# Run all tests
npm run test

# Run in headed mode
npm run test:headed

# Run smoke tests only
npm run test:smoke

# Run with stage environment
npm run test:stage

# Run with prod environment
npm run test:prod

# Run specific test file
npx playwright test tests/ui/smokeTest.spec.ts
```

## Environment Setup

Create or update `.env.stage` or `.env.prod`:

```bash
URL=https://your-app-url.com
USERNAME=your_username
PASSWORD=your_password
```

The framework automatically loads the environment based on the `ENVIRONMENT` variable.

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

## Documentation

For detailed usage instructions, see [USER_MANUAL.md](USER_MANUAL.md).

## License

ISC
