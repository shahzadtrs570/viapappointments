import {
  defineConfig,
  devices,
  type PlaywrightTestConfig,
} from "@playwright/test"

// Use constants for environment variables since .env isn't loading properly
const NEXTAUTH_URL = "http://localhost:3000"
const NEXTAUTH_SECRET = "your-nextauth-secret-value"

console.log(
  "[Playwright Config] Using hardcoded environment variables for testing"
)
console.log("[Playwright Config] NEXTAUTH_URL:", NEXTAUTH_URL)
console.log("[Playwright Config] NEXTAUTH_SECRET: Loaded from constant")

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export const config: PlaywrightTestConfig = defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: NEXTAUTH_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // Comment out Firefox and WebKit for faster testing during development
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npm run dev",
    url: NEXTAUTH_URL,
    reuseExistingServer: !process.env.CI,
    env: {
      NEXTAUTH_URL: NEXTAUTH_URL,
      NEXTAUTH_SECRET: NEXTAUTH_SECRET,
    },
  },
})
