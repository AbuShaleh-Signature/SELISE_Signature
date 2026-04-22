# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\regressionTest.stage.spec.ts >> 📋 Regression Suite - STAGE Environment >> Test 1: Verify home page elements
- Location: tests\ui\regressionTest.stage.spec.ts:77:3

# Error details

```
Error: locator.fill: Target page, context or browser has been closed
Call log:
  - waiting for getByPlaceholder('Enter your email')

```

# Test source

```ts
  56  |     } catch (error) {
  57  |       logger.error(`Failed to navigate to URL: ${url}`, error);
  58  |       throw error;
  59  |     }
  60  |   }
  61  | 
  62  |   /**
  63  |    * Reload the current page
  64  |    */
  65  |   async reload(): Promise<void> {
  66  |     try {
  67  |       await this.page.reload();
  68  |       logger.info(`Page reloaded`);
  69  |     } catch (error) {
  70  |       logger.error(`Failed to reload page`, error);
  71  |       throw error;
  72  |     }
  73  |   }
  74  | 
  75  |   /**
  76  |    * Get the current page URL
  77  |    * @returns Current URL string
  78  |    */
  79  |   async getURL(): Promise<string> {
  80  |     return this.page.url();
  81  |   }
  82  | 
  83  |   /**
  84  |    * Get the current page title
  85  |    * @returns Page title string
  86  |    */
  87  |   async getPageTitle(): Promise<string> {
  88  |     return this.page.title();
  89  |   }
  90  | }
  91  | 
  92  | // ============================================================================
  93  | // SEQUENTIAL TEST CONFIGURATION
  94  | // ============================================================================
  95  | // Shared browser instance for sequential test execution
  96  | // This ensures all tests share the same browser session (login once, test many)
  97  | 
  98  | let browser: Browser;
  99  | let context: BrowserContext;
  100 | let sharedPage: Page;
  101 | 
  102 | /**
  103 |  * Sequential Test - Extended Playwright test with shared browser session
  104 |  *
  105 |  * Benefits of this approach:
  106 |  * - Login happens once for all tests (faster execution)
  107 |  * - Browser state is preserved between tests
  108 |  * - Cookies/session persist across tests
  109 |  *
  110 |  * Usage:
  111 |  *   sequentialTest("Test Name", async ({ page }) => {
  112 |  *     // Your test code here
  113 |  *   });
  114 |  */
  115 | export const sequentialTest = base.extend<{ page: Page }>({
  116 |   page: async ({}, use) => {
  117 |     // Only initialize browser once (first test that runs)
  118 |     if (!browser) {
  119 |       logger.info(`Initializing browser...`);
  120 | 
  121 |       // Launch browser in headed mode (visible browser window)
  122 |       browser = await chromium.launch({ headless: false });
  123 | 
  124 |       // Create browser context (isolated environment)
  125 |       context = await browser.newContext();
  126 | 
  127 |       // Create a new page/tab
  128 |       sharedPage = await context.newPage();
  129 | 
  130 |       // Set browser window to full screen dimensions
  131 |       logger.info("Setting browser to window size...");
  132 |       await sharedPage.bringToFront();
  133 |       await sharedPage.evaluate(() => {
  134 |         window.moveTo(0, 0);
  135 |         window.resizeTo(window.screen.availWidth, window.screen.availHeight);
  136 |       });
  137 |       await sharedPage.waitForTimeout(500);
  138 | 
  139 |       // ========================================================================
  140 |       // LOGIN AUTOMATION
  141 |       // ========================================================================
  142 |       // Credentials are passed from test files via global variables:
  143 |       //   - __TEST_ENV_URL__       : Login page URL
  144 |       //   - __TEST_ENV_USERNAME__  : Username for login
  145 |       //   - __TEST_ENV_PASSWORD__  : Password for login
  146 | 
  147 |       logger.info(`Logging in...`);
  148 | 
  149 |       // Navigate to login page
  150 |       await sharedPage.goto((globalThis as any).__TEST_ENV_URL__);
  151 |       await sharedPage.waitForLoadState("domcontentloaded");
  152 | 
  153 |       // Fill username
  154 |       await sharedPage
  155 |         .getByPlaceholder(LOGIN_LOCATORS.usernameField)
> 156 |         .fill((globalThis as any).__TEST_ENV_USERNAME__);
      |          ^ Error: locator.fill: Target page, context or browser has been closed
  157 | 
  158 |       // Fill password
  159 |       await sharedPage
  160 |         .getByPlaceholder(LOGIN_LOCATORS.passwordField)
  161 |         .fill((globalThis as any).__TEST_ENV_PASSWORD__);
  162 | 
  163 |       // Click login button
  164 |       await sharedPage.getByRole("button", { name: LOGIN_LOCATORS.loginButton }).click();
  165 | 
  166 |       // Wait for home page to load (confirms successful login)
  167 |       try {
  168 |         await sharedPage.locator(LOGIN_LOCATORS.home).waitFor({ state: "visible", timeout: 15000 });
  169 |       } catch {
  170 |         // Alternative: wait for URL to change
  171 |         await sharedPage.waitForURL("**/home", { timeout: 15000 });
  172 |       }
  173 |       await sharedPage.waitForTimeout(2000);
  174 |       logger.info(`Login successful - Session started`);
  175 |     }
  176 | 
  177 |     // Use the shared page for the test
  178 |     await use(sharedPage);
  179 |   },
  180 | });
  181 | 
  182 | // ============================================================================
  183 | // CLEANUP
  184 | // ============================================================================
  185 | // Close browser after all tests complete
  186 | 
  187 | sequentialTest.afterAll = async () => {
  188 |   if (browser) {
  189 |     await browser.close();
  190 |     logger.info("Browser closed");
  191 |   }
  192 | };
  193 | 
  194 | // Export expect for use in tests
  195 | export { expect };
  196 | 
```