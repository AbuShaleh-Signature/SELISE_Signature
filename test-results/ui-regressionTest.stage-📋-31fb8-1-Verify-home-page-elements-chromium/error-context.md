# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ui\regressionTest.stage.spec.ts >> 📋 Regression Suite - STAGE Environment >> Test 1: Verify home page elements
- Location: tests\ui\regressionTest.stage.spec.ts:77:3

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "https://app.selisestage.com/login", waiting until "load"

```

# Test source

```ts
  51  |   async navigateTo(url: string): Promise<void> {
  52  |     try {
  53  |       await this.page.goto(url);
  54  |       logger.info(`Navigated to URL: ${url}`);
  55  |       await this.page.waitForLoadState("domcontentloaded");
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
  121 |       // Launch browser (headed locally, headless in CI)
  122 |       const isCI = process.env.CI === 'true';
  123 |       browser = await chromium.launch({ headless: isCI });
  124 | 
  125 |       // Create browser context (isolated environment)
  126 |       context = await browser.newContext();
  127 | 
  128 |       // Create a new page/tab
  129 |       sharedPage = await context.newPage();
  130 | 
  131 |       // Set browser window to full screen dimensions
  132 |       logger.info("Setting browser to window size...");
  133 |       await sharedPage.bringToFront();
  134 |       await sharedPage.evaluate(() => {
  135 |         window.moveTo(0, 0);
  136 |         window.resizeTo(window.screen.availWidth, window.screen.availHeight);
  137 |       });
  138 |       await sharedPage.waitForTimeout(500);
  139 | 
  140 |       // ========================================================================
  141 |       // LOGIN AUTOMATION
  142 |       // ========================================================================
  143 |       // Credentials are passed from test files via global variables:
  144 |       //   - __TEST_ENV_URL__       : Login page URL
  145 |       //   - __TEST_ENV_USERNAME__  : Username for login
  146 |       //   - __TEST_ENV_PASSWORD__  : Password for login
  147 | 
  148 |       logger.info(`Logging in...`);
  149 | 
  150 |       // Navigate to login page
> 151 |       await sharedPage.goto((globalThis as any).__TEST_ENV_URL__);
      |                        ^ Error: page.goto: Target page, context or browser has been closed
  152 |       await sharedPage.waitForLoadState("domcontentloaded");
  153 | 
  154 |       // Fill username
  155 |       await sharedPage
  156 |         .getByPlaceholder(LOGIN_LOCATORS.usernameField)
  157 |         .fill((globalThis as any).__TEST_ENV_USERNAME__);
  158 | 
  159 |       // Fill password
  160 |       await sharedPage
  161 |         .getByPlaceholder(LOGIN_LOCATORS.passwordField)
  162 |         .fill((globalThis as any).__TEST_ENV_PASSWORD__);
  163 | 
  164 |       // Click login button
  165 |       await sharedPage.getByRole("button", { name: LOGIN_LOCATORS.loginButton }).click();
  166 | 
  167 |       // Wait for home page to load (confirms successful login)
  168 |       try {
  169 |         await sharedPage.locator(LOGIN_LOCATORS.home).waitFor({ state: "visible", timeout: 15000 });
  170 |       } catch {
  171 |         // Alternative: wait for URL to change
  172 |         await sharedPage.waitForURL("**/home", { timeout: 15000 });
  173 |       }
  174 |       await sharedPage.waitForTimeout(2000);
  175 |       logger.info(`Login successful - Session started`);
  176 |     }
  177 | 
  178 |     // Use the shared page for the test
  179 |     await use(sharedPage);
  180 |   },
  181 | });
  182 | 
  183 | // ============================================================================
  184 | // CLEANUP
  185 | // ============================================================================
  186 | // Close browser after all tests complete
  187 | 
  188 | sequentialTest.afterAll = async () => {
  189 |   if (browser) {
  190 |     await browser.close();
  191 |     logger.info("Browser closed");
  192 |   }
  193 | };
  194 | 
  195 | // Export expect for use in tests
  196 | export { expect };
  197 | 
```