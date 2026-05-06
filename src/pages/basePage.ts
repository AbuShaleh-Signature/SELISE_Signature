/**
 * ============================================================================
 * BASE PAGE - Playwright Test Configuration
 * ============================================================================
 *
 * This file provides the foundation for all UI automation tests.
 * It handles:
 *   - Browser initialization (shared across all tests)
 *   - Login automation
 *   - Reusable page methods
 *
 * ============================================================================
 */

// ============================================================================
// IMPORTS
// ============================================================================

import { test as base, expect, chromium, Browser, Page, BrowserContext } from "@playwright/test";
import { logger } from "../utils/logger";

// ============================================================================
// LOGIN LOCATORS
// ============================================================================
// These locators are used for authentication and are the same across all environments
// since the login page doesn't change between stage and prod

const LOGIN_LOCATORS = {
  usernameField: "Enter your email", // Username input placeholder
  passwordField: "Enter your password", // Password input placeholder
  loginButton: "LOGIN", // Login button text
  home: "#home-page", // Home page container ID (verifies successful login)
};

// ============================================================================
// BASE PAGE CLASS
// ============================================================================
// Provides reusable methods for page navigation and interactions

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * @param url - The URL to navigate to
   */
  async navigateTo(url: string): Promise<void> {
    try {
      await this.page.goto(url);
      logger.info(`Navigated to URL: ${url}`);
      await this.page.waitForLoadState("domcontentloaded");
    } catch (error) {
      logger.error(`Failed to navigate to URL: ${url}`, error);
      throw error;
    }
  }

  /**
   * Reload the current page
   */
  async reload(): Promise<void> {
    try {
      await this.page.reload();
      logger.info(`Page reloaded`);
    } catch (error) {
      logger.error(`Failed to reload page`, error);
      throw error;
    }
  }

  /**
   * Get the current page URL
   * @returns Current URL string
   */
  async getURL(): Promise<string> {
    return this.page.url();
  }

  /**
   * Get the current page title
   * @returns Page title string
   */
  async getPageTitle(): Promise<string> {
    return this.page.title();
  }
}

// ============================================================================
// SEQUENTIAL TEST CONFIGURATION
// ============================================================================
// Shared browser instance for sequential test execution
// This ensures all tests share the same browser session (login once, test many)

let browser: Browser;
let context: BrowserContext;
let sharedPage: Page;

/**
 * Sequential Test - Extended Playwright test with shared browser session
 *
 * Benefits of this approach:
 * - Login happens once for all tests (faster execution)
 * - Browser state is preserved between tests
 * - Cookies/session persist across tests
 *
 * Usage:
 *   sequentialTest("Test Name", async ({ page }) => {
 *     // Your test code here
 *   });
 */
export const sequentialTest = base.extend<{ page: Page }>({
  page: async ({}, use) => {
    // Only initialize browser once (first test that runs)
    if (!browser) {
      logger.info(`Initializing browser...`);

      // Launch browser (headless in CI, headed locally)
      const isCI = process.env.CI === 'true';
      browser = await chromium.launch({ headless: isCI || true });

      // Create browser context (isolated environment)
      context = await browser.newContext();

      // Create a new page/tab
      sharedPage = await context.newPage();

      // Set browser window to full screen dimensions
      logger.info("Setting browser to window size...");
      await sharedPage.bringToFront();
      await sharedPage.evaluate(() => {
        window.moveTo(0, 0);
        window.resizeTo(window.screen.availWidth, window.screen.availHeight);
      });
      await sharedPage.waitForTimeout(500);

      // ========================================================================
      // LOGIN AUTOMATION
      // ========================================================================
      // Credentials are passed from test files via global variables:
      //   - __TEST_ENV_URL__       : Login page URL
      //   - __TEST_ENV_USERNAME__  : Username for login
      //   - __TEST_ENV_PASSWORD__  : Password for login

      logger.info(`Logging in...`);

      // Navigate to login page
      await sharedPage.goto((globalThis as any).__TEST_ENV_URL__);
      await sharedPage.waitForLoadState("domcontentloaded");

      // Fill username
      await sharedPage
        .getByPlaceholder(LOGIN_LOCATORS.usernameField)
        .fill((globalThis as any).__TEST_ENV_USERNAME__);

      // Fill password
      await sharedPage
        .getByPlaceholder(LOGIN_LOCATORS.passwordField)
        .fill((globalThis as any).__TEST_ENV_PASSWORD__);

      // Click login button
      await sharedPage.getByRole("button", { name: LOGIN_LOCATORS.loginButton }).click();

      // Wait for home page to load (confirms successful login)
      try {
        await sharedPage.locator(LOGIN_LOCATORS.home).waitFor({ state: "visible", timeout: 15000 });
      } catch {
        // Alternative: wait for URL to change
        await sharedPage.waitForURL("**/home", { timeout: 15000 });
      }
      await sharedPage.waitForTimeout(2000);
      logger.info(`Login successful - Session started`);
    }

    // Use the shared page for the test
    await use(sharedPage);
  },
});

// ============================================================================
// CLEANUP
// ============================================================================
// Close browser after all tests complete

sequentialTest.afterAll = async () => {
  if (browser) {
    await browser.close();
    logger.info("Browser closed");
  }
};

// Export expect for use in tests
export { expect };
