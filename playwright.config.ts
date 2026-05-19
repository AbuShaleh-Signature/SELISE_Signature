import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  outputDir: "test-results/playwright-output",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ["line"],
    ["html"],
    ["json", { outputFile: "test-results/results.json" }],
    ["./src/reporters/excelReporter.ts", { outputDir: "test-results/excel-reports", env: process.env.TEST_ENV || "unknown" }],
  ],
  use: {
    viewport: null,
    trace: "on-first-retry",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
