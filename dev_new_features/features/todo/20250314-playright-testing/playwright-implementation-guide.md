# Playwright Implementation Guide for NextJet

This guide provides step-by-step instructions for implementing Playwright testing in the NextJet SaaS template project.

## Implementation Roadmap

1. Initial setup and configuration
2. Create base test utilities and helpers
3. Implement authentication tests
4. Implement dashboard tests
5. Implement marketing site tests
6. Implement payment flow tests
7. Configure CI/CD integration
8. Establish testing practices and guidelines

## 1. Initial Setup

### Install Playwright

```bash
cd /c:/Users/osout/Documents/Gihub/truyu/rain-saas-template
pnpm add -D @playwright/test
npx playwright install
```

### Configure Playwright

Create a `playwright.config.ts` file in the project root:

```typescript
import { PlaywrightTestConfig, devices } from '@playwright/test';
import path from 'path';

const config: PlaywrightTestConfig = {
  testDir: './tests/e2e',
  timeout: 30000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  // Output directory for test results
  outputDir: path.join(__dirname, 'playwright-results'),
  webServer: {
    command: 'pnpm start',
    port: 3000,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
};

export default config;
```

### Add Script Commands

Add these scripts to your root `package.json`:

```json
"scripts": {
  // ... existing scripts
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:debug": "playwright test --debug",
  "test:e2e:report": "playwright show-report"
}
```

### Create Directory Structure

```bash
mkdir -p tests/e2e/auth
mkdir -p tests/e2e/dashboard
mkdir -p tests/e2e/marketing
mkdir -p tests/e2e/payment
mkdir -p tests/e2e/fixtures
mkdir -p tests/e2e/pages
mkdir -p tests/e2e/utils
```

## 2. Create Base Test Utilities

### Authentication Helper

Create `tests/e2e/utils/auth-helper.ts`:

```typescript
import { Page } from '@playwright/test';

export type TestUser = {
  email: string;
  password: string;
  name: string;
};

export const testUsers = {
  admin: {
    email: 'admin@example.com',
    password: 'password123',
    name: 'Admin User',
  },
  regularUser: {
    email: 'user@example.com',
    password: 'password123',
    name: 'Regular User',
  },
};

export async function login(page: Page, user: TestUser) {
  await page.goto('/auth/login');
  await page.fill('[data-testid="email-input"]', user.email);
  await page.fill('[data-testid="password-input"]', user.password);
  await page.click('[data-testid="login-button"]');
  await page.waitForURL('/dashboard');
}

export async function saveAuthenticationState(page: Page, userType: keyof typeof testUsers) {
  await login(page, testUsers[userType]);
  await page.context().storageState({ 
    path: `./tests/e2e/fixtures/auth-state-${userType}.json` 
  });
}
```

### Test Fixtures

Create `tests/e2e/fixtures/test-fixtures.ts`:

```typescript
import { test as base } from '@playwright/test';
import { testUsers, TestUser } from '../utils/auth-helper';

// Extend the test fixture to include test data
export const test = base.extend<{
  testUser: TestUser;
  adminUser: TestUser;
}>({
  testUser: testUsers.regularUser,
  adminUser: testUsers.admin,
});

// Reuse authenticated state for tests that require login
export const authenticatedTest = test.extend({
  storageState: './tests/e2e/fixtures/auth-state-regularUser.json',
});

export const adminTest = test.extend({
  storageState: './tests/e2e/fixtures/auth-state-admin.json',
});
```

### Page Objects

Create base page objects for your application's main pages:

```typescript
// tests/e2e/pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';
import { TestUser } from '../utils/auth-helper';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[data-testid="email-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.loginButton = page.locator('[data-testid="login-button"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }

  async goto() {
    await this.page.goto('/auth/login');
  }

  async login(user: TestUser) {
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.loginButton.click();
  }
}

// tests/e2e/pages/DashboardPage.ts
import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly welcomeMessage: Locator;
  readonly userMenu: Locator;
  readonly sidebarMenuItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeMessage = page.locator('[data-testid="welcome-message"]');
    this.userMenu = page.locator('[data-testid="user-menu"]');
    this.sidebarMenuItems = page.locator('[data-testid="sidebar-menu-item"]');
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  async navigateToSection(sectionName: string) {
    await this.sidebarMenuItems.filter({ hasText: sectionName }).click();
  }
}
```

## 3. Implement Authentication Tests

Create `tests/e2e/auth/login.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { testUsers } from '../utils/auth-helper';

test.describe('Authentication flow', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should display login page', async ({ page }) => {
    await expect(page).toHaveURL('/auth/login');
    await expect(page.locator('h1')).toHaveText(/Sign in/i);
  });

  test('should login with valid credentials', async ({ page }) => {
    await loginPage.login(testUsers.regularUser);
    await expect(page).toHaveURL('/dashboard');
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await loginPage.emailInput.fill('wrong@example.com');
    await loginPage.passwordInput.fill('wrongpassword');
    await loginPage.loginButton.click();
    
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(/invalid credentials/i);
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.click('text=Create an account');
    await expect(page).toHaveURL('/auth/signup');
  });
});
```

Create `tests/e2e/auth/signup.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Signup flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/signup');
  });

  test('should display signup page', async ({ page }) => {
    await expect(page).toHaveURL('/auth/signup');
    await expect(page.locator('h1')).toHaveText(/Create an account/i);
  });

  test('should create a new account', async ({ page }) => {
    // Generate a unique email using timestamp
    const email = `test-${Date.now()}@example.com`;
    
    await page.fill('[data-testid="name-input"]', 'Test User');
    await page.fill('[data-testid="email-input"]', email);
    await page.fill('[data-testid="password-input"]', 'Password123!');
    await page.fill('[data-testid="confirm-password-input"]', 'Password123!');
    await page.click('[data-testid="signup-button"]');
    
    // Should redirect to dashboard or verification page
    await expect(page).toHaveURL(/dashboard|verify/);
  });

  test('should show error for existing email', async ({ page }) => {
    await page.fill('[data-testid="name-input"]', 'Test User');
    await page.fill('[data-testid="email-input"]', testUsers.regularUser.email);
    await page.fill('[data-testid="password-input"]', 'Password123!');
    await page.fill('[data-testid="confirm-password-input"]', 'Password123!');
    await page.click('[data-testid="signup-button"]');
    
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText(/email already exists/i);
  });
});
```

## 4. Implement Dashboard Tests

Create `tests/e2e/dashboard/dashboard.spec.ts`:

```typescript
import { expect } from '@playwright/test';
import { authenticatedTest as test } from '../fixtures/test-fixtures';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('Dashboard', () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
  });

  test('should display welcome message', async () => {
    await expect(dashboardPage.welcomeMessage).toBeVisible();
  });

  test('should navigate between sections', async () => {
    await dashboardPage.navigateToSection('Settings');
    await expect(dashboardPage.page).toHaveURL(/settings/);
    
    await dashboardPage.navigateToSection('Billing');
    await expect(dashboardPage.page).toHaveURL(/billing/);
  });

  test('should display user information in profile', async ({ page }) => {
    await dashboardPage.navigateToSection('Profile');
    await expect(page.locator('[data-testid="user-email"]')).toContainText(test.info().project.use.testUser.email);
  });
});
```

## 5. Implement Marketing Site Tests

Create `tests/e2e/marketing/homepage.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Marketing Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the homepage', async ({ page }) => {
    await expect(page).toHaveTitle(/NextJet/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.click('text=Sign in');
    await expect(page).toHaveURL(/login/);
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.click('text=Get started');
    await expect(page).toHaveURL(/signup/);
  });

  test('should have working navigation menu', async ({ page }) => {
    await page.click('text=Features');
    await expect(page).toHaveURL(/features/);
    
    await page.click('text=Pricing');
    await expect(page).toHaveURL(/pricing/);
  });
});
```

## 6. Implement Payment Flow Tests

Create `tests/e2e/payment/checkout.spec.ts`:

```typescript
import { expect } from '@playwright/test';
import { authenticatedTest as test } from '../fixtures/test-fixtures';

test.describe('Payment Checkout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/billing');
  });

  test('should display available plans', async ({ page }) => {
    await expect(page.locator('[data-testid="pricing-plans"]')).toBeVisible();
  });

  test('should navigate to checkout page', async ({ page }) => {
    await page.click('[data-testid="select-plan-button"]');
    await expect(page).toHaveURL(/checkout/);
  });

  // Skip this test in CI environment as it involves payment provider integration
  test('should process payment successfully', async ({ page }) => {
    test.skip(!!process.env.CI, 'Skip payment tests in CI');
    
    await page.click('[data-testid="select-plan-button"]');
    
    // Fill credit card information
    // Note: This will be handled in a test environment with test cards
    await page.fill('[data-testid="card-number"]', '4242424242424242');
    await page.fill('[data-testid="card-expiry"]', '12/25');
    await page.fill('[data-testid="card-cvc"]', '123');
    
    await page.click('[data-testid="submit-payment"]');
    
    // Should redirect to success page or dashboard
    await expect(page).toHaveURL(/success|dashboard/);
  });
});
```

## 7. Configure CI/CD Integration

Create `.github/workflows/playwright.yml`:

```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, staging, dev ]
  pull_request:
    branches: [ main, staging, dev ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: pnpm/action-setup@v3
      with:
        version: 8
    - uses: actions/setup-node@v3
      with:
        node-version: 18
        cache: 'pnpm'
    - name: Install dependencies
      run: pnpm install
    - name: Install Playwright browsers
      run: pnpm exec playwright install --with-deps
    - name: Setup environment
      run: |
        cp .env.example .env
        # Add any necessary environment setup here
    - name: Generate authentication states
      run: |
        pnpm exec playwright test tests/e2e/utils/setup.ts
    - name: Run Playwright tests
      run: pnpm test:e2e
      env:
        PLAYWRIGHT_TEST_BASE_URL: http://localhost:3000
        # Add any test-specific environment variables
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

Create `tests/e2e/utils/setup.ts` for generating authentication states:

```typescript
import { test } from '@playwright/test';
import { saveAuthenticationState } from './auth-helper';

test('Setup authentication states', async ({ browser }) => {
  // Set up authentication state for regular user
  const userPage = await browser.newPage();
  await saveAuthenticationState(userPage, 'regularUser');
  await userPage.close();
  
  // Set up authentication state for admin user
  const adminPage = await browser.newPage();
  await saveAuthenticationState(adminPage, 'admin');
  await adminPage.close();
});
```

## 8. Testing Practices and Guidelines

### Data-Testid Attributes Implementation

Update your UI components to include data-testid attributes for easier test selection:

```tsx
// Example React component with data-testid attributes
function LoginForm({ onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <input 
        type="email" 
        data-testid="email-input" 
        placeholder="Email" 
      />
      <input 
        type="password" 
        data-testid="password-input" 
        placeholder="Password" 
      />
      <button 
        type="submit" 
        data-testid="login-button"
      >
        Sign in
      </button>
      {error && (
        <div data-testid="error-message">
          {error}
        </div>
      )}
    </form>
  );
}
```

### Visual Testing

For critical UI components, implement visual regression tests:

```typescript
// tests/e2e/dashboard/visual.spec.ts
import { test, expect } from '@playwright/test';
import { authenticatedTest as authTest } from '../fixtures/test-fixtures';

test.describe('Visual regression tests', () => {
  test('marketing homepage should match snapshot', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage.png');
  });
  
  authTest('dashboard should match snapshot', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveScreenshot('dashboard.png');
  });
});
```

### Testing Checklist

Before submitting PRs, ensure the following:

1. All existing tests pass
2. New features have appropriate test coverage
3. Authentication flows are properly tested
4. Critical user journeys are covered
5. Edge cases and error states are tested
6. Visual tests are updated if UI changes

## Conclusion

This implementation guide provides a structured approach to integrating Playwright testing into the NextJet SaaS template. By following these steps, you'll establish a comprehensive test suite that can help ensure the reliability and quality of your application across different browsers and devices.

The examples provided are tailored to the NextJet project structure and can be adapted as needed for your specific implementation. 