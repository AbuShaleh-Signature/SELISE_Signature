# SELISE_Signature - User Manual

## Table of Contents

1. [Framework Overview](#framework-overview)
2. [Project Structure](#project-structure)
3. [Setup & Installation](#setup--installation)
4. [Configuration](#configuration)
5. [Writing Tests](#writing-tests)
6. [Running Tests](#running-tests)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Framework Overview

SELISE_Signature is a streamlined Playwright-based UI automation framework built for simplicity and maintainability.

### Key Features

- **Playwright**: Modern E2E testing with auto-waiting and assertions
- **TypeScript**: Type-safe development
- **Page Object Model**: Clean separation of concerns
- **Environment Management**: Stage and production configurations
- **Automatic Reporting**: HTML reports, screenshots, and traces on failures
- **CI/CD Ready**: GitHub Actions integration

---

## Project Structure

```
SELISE_Signature/
├── src/
│   ├── config/
│   │   └── config.ts         # Environment configuration loader
│   ├── locators.ts            # Centralized element selectors
│   ├── pages/
│   │   └── basePage.ts        # Base page class for page objects
│   └── utils/
│       └── logger.ts          # Winston logger (file + console)
├── tests/
│   └── ui/
│       └── smokeTest.spec.ts  # Test specifications
├── playwright-report/         # Generated HTML reports
├── test-results/              # Test artifacts (screenshots, traces)
├── logs/                      # Application logs
├── .env.stage                 # Stage environment variables
├── .env.prod                  # Production environment variables
└── playwright.config.ts       # Playwright configuration
```

---

## Setup & Installation

### Prerequisites

- Node.js 18 or higher
- npm or pnpm

### Installation Steps

1. Clone the repository
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

Create `.env.stage` or `.env.prod` files:

```bash
URL=https://your-app-url.com
USERNAME=your_username
PASSWORD=your_password
```

The framework loads environment based on `ENVIRONMENT` variable (stage/prod).

### Playwright Configuration

Edit `playwright.config.ts`:

| Setting    | Description               |
| ---------- | ------------------------- |
| `testDir`  | Test file location        |
| `projects` | Browser configurations    |
| `retries`  | Retry failed tests        |
| `reporter` | HTML reporting            |
| `trace`    | Capture traces on failure |

---

## Writing Tests

### Test Structure

```typescript
import { test, expect } from "@playwright/test";
import { environment } from "../../src/config/config";
import { LOCATORS } from "../../src/locators";

test.describe("Feature Name", () => {
  test("scenario description", async ({ page }) => {
    await page.goto(environment.url);
    // Test implementation
  });
});
```

### Locators

Define all selectors in `src/locators.ts`:

```typescript
export const LOCATORS = {
  usernameField: "#inputLogin",
  passwordField: "Enter your password",
  loginButton: "LOGIN",
  home: "#home-page",
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

# Run in headed mode (visible browser)
npm run test:headed

# Run smoke tests
npm run test:smoke

# Run with stage environment
npm run test:stage

# Run with prod environment
npm run test:prod
```

### Advanced Options

```bash
# Run specific test file
npx playwright test tests/ui/smokeTest.spec.ts

# Run with debugging
npx playwright test --debug

# Run with grep pattern
npx playwright test --grep "login"

# Generate and view report
npx playwright show-report
```

---

## Best Practices

### Test Organization

1. **Use descriptive test names**: "should display error on invalid login"
2. **One assertion per test**: For clear failure diagnosis
3. **Use page objects**: Keep page-specific logic in page classes
4. **Centralize locators**: Store selectors in `locators.ts`

### Code Style

- Files: kebab-case (`login-page.ts`)
- Classes: PascalCase (`LoginPage`)
- Methods: camelCase (`loginToApplication`)
- Constants: SCREAMING_SNAKE_CASE or as const objects

### Test Data

- Store credentials in `.env` files
- Use JSON files in `test-data/` for complex test data
- Avoid hardcoding values in tests

---

## Troubleshooting

### Tests Not Found

```bash
# List all tests
npx playwright test --list

# Check test file naming (must end with .spec.ts)
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

| Command                      | Description              |
| ---------------------------- | ------------------------ |
| `npm install`                | Install dependencies     |
| `npx playwright install`     | Install browsers         |
| `npm run test`               | Run all tests            |
| `npm run test:headed`        | Run with visible browser |
| `npm run test:stage`         | Run against stage env    |
| `npm run test:prod`          | Run against prod env     |
| `npx playwright show-report` | View HTML report         |

---

**Last Updated**: April 6, 2026  
**Version**: 1.0.0  
**Maintained by**: SELISE QA Automation Team
