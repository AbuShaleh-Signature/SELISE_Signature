import { sequentialTest, expect } from "../../src/pages/basePage";
import { LOCATORS } from "../../src/locators";

sequentialTest.describe.serial("Smoke Tests", () => {
  sequentialTest("Verify application login and basic functionality", async ({ page }) => {
    await expect(page.locator(LOCATORS.home)).toBeVisible();
    const url = page.url();
    console.log("Login successful, URL:", url);
  });
});
