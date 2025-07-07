# Playwright Testing Strategy

## Overview

Playwright is a modern end-to-end testing framework that enables reliable, cross-browser testing for web applications. This document outlines a comprehensive strategy for implementing Playwright testing in our NextJet SaaS application.

## Table of Contents

1. [Introduction to Playwright](#introduction-to-playwright)
2. [Setup and Installation](#setup-and-installation)
3. [Test Structure and Organization](#test-structure-and-organization)
4. [Testing Approach](#testing-approach)
5. [Writing Tests](#writing-tests)
6. [Running Tests](#running-tests)
7. [CI/CD Integration](#cicd-integration)
8. [Best Practices](#best-practices)
9. [Resources](#resources)

## Introduction to Playwright

Playwright is a Microsoft-maintained testing framework that allows testing modern web applications across all major browsers. Key features include:

- **Cross-browser testing**: Run tests on Chromium, Firefox, and WebKit
- **Auto-wait capabilities**: Automatic waiting for elements to be ready
- **Mobile emulation**: Test mobile viewport experiences
- **API testing**: Test both UI and API layers
- **Parallel execution**: Run tests in parallel for faster feedback
- **Video recording and screenshots**: Capture visual evidence for debugging
- **Headless and headed mode**: Run with or without browser UI
- **Accessibility testing**: Verify application accessibility

## Setup and Installation

### Prerequisites

- Node.js (version 14 or higher)
- npm or pnpm (our project uses pnpm)

### Installation Steps

1. Add Playwright to your project:

```bash
cd [project-root]
pnpm add -D @playwright/test
```

2. Install Playwright browsers:

```bash
npx playwright install
```

3. Create a configuration file (playwright.config.ts) in the project root:

```typescript
import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests/e2e',
  timeout: 30000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],
  use: {
    baseURL: 'http://localhost:3000',
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
};

export default config;
```

4. Add script commands to your package.json:

```json
"scripts": {
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:debug": "playwright test --debug",
  "test:e2e:report": "playwright show-report"
}
```

## Test Structure and Organization

### Directory Structure

```
[project-root]/
  ├── tests/
  │   ├── e2e/                    # End-to-end tests
  │   │   ├── auth/               # Authentication tests
  │   │   ├── dashboard/          # Dashboard tests
  │   │   ├── marketing/          # Marketing site tests
  │   │   ├── payment/            # Payment flow tests
  │   │   └── fixtures/           # Test fixtures and data
  │   └── api/                    # API tests
  ├── playwright.config.ts        # Playwright configuration
  └── package.json                # Project configuration
```

### Test Organization Principles

1. **Feature-based organization**: Group tests by application features
2. **Page object pattern**: Encapsulate page interactions in page objects
3. **Fixtures for reusable test data**: Create reusable test fixtures
4. **Shared utilities**: Common functions for test setup and assertions

## Testing Approach

### Testing Pyramid

Our testing strategy follows the testing pyramid approach:

1. **Unit Tests**: Test individual components (not covered by Playwright)
2. **Integration Tests**: Test component interactions (partial Playwright coverage)
3. **E2E Tests**: Test complete user flows (primary Playwright focus)

### Test Types

1. **Smoke Tests**: Quick tests to verify core functionality
2. **Critical Path Tests**: Tests for business-critical user flows
3. **Regression Tests**: Tests to catch regressions in existing features
4. **Accessibility Tests**: Tests to ensure application accessibility
5. **Visual Tests**: Tests to catch visual regressions

### Testing Matrix

| Application Area | Test Priority | Test Types |
|------------------|---------------|------------|
| Authentication   | High          | Smoke, Critical Path, Security |
| Dashboard        | High          | Smoke, Critical Path, Accessibility |
| Marketing Site   | Medium        | Smoke, Visual, Accessibility |
| Payments         | High          | Critical Path, Security |
| User Settings    | Medium        | Regression, Accessibility |

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test('user can log in', async ({ page }) => {
  // Arrange - Setup test data and navigate to page
  await page.goto('/auth/login');
  
  // Act - Perform user actions
  await page.fill('[data-testid="email-input"]', 'test@example.com');
  await page.fill('[data-testid="password-input"]', 'password123');
  await page.click('[data-testid="login-button"]');
  
  // Assert - Verify expected outcome
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible();
});
```

### Page Object Model

```typescript
// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[data-testid="email-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.loginButton = page.locator('[data-testid="login-button"]');
  }

  async goto() {
    await this.page.goto('/auth/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

// tests/auth/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('user can log in', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('test@example.com', 'password123');
  
  await expect(page).toHaveURL('/dashboard');
});
```

### Using Fixtures

```typescript
// fixtures/test-users.ts
import { test as base } from '@playwright/test';

export type TestUser = {
  email: string;
  password: string;
  name: string;
};

export const test = base.extend<{ testUser: TestUser }>({
  testUser: {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
  },
});

// tests/auth/login.spec.ts
import { test } from '../fixtures/test-users';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('user can log in', async ({ page, testUser }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(testUser.email, testUser.password);
  
  await expect(page).toHaveURL('/dashboard');
});
```

### Authentication Handling

```typescript
// auth-helper.ts
import { Page } from '@playwright/test';

export async function login(page: Page, email: string, password: string) {
  await page.goto('/auth/login');
  await page.fill('[data-testid="email-input"]', email);
  await page.fill('[data-testid="password-input"]', password);
  await page.click('[data-testid="login-button"]');
  await page.waitForURL('/dashboard');
}

// Store authentication state for reuse
export async function saveAuthenticationState(page: Page, username: string) {
  await login(page, 'test@example.com', 'password123');
  await page.context().storageState({ path: `auth-state-${username}.json` });
}

// tests/dashboard/dashboard.spec.ts
import { test } from '@playwright/test';
import { saveAuthenticationState } from '../auth-helper';

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage();
  await saveAuthenticationState(page, 'user');
  await page.close();
});

test.use({ storageState: 'auth-state-user.json' });

test('authenticated user can access dashboard', async ({ page }) => {
  await page.goto('/dashboard');
  // Test starts with user already logged in
});
```

## Running Tests

### Local Test Execution

Run all tests:
```bash
pnpm test:e2e
```

Run specific tests:
```bash
pnpm test:e2e tests/e2e/auth
```

Run tests in UI mode:
```bash
pnpm test:e2e:ui
```

Run tests in debug mode:
```bash
pnpm test:e2e:debug
```

### Test Filtering

Run tests with specific tag:
```bash
pnpm test:e2e --grep @smoke
```

Skip tests with specific tag:
```bash
pnpm test:e2e --grep-invert @slow
```

### Browsers and Devices

Run tests on specific browser:
```bash
pnpm test:e2e --project=firefox
```

Run tests on mobile viewport:
```bash
pnpm test:e2e --project="mobile chrome"
```

## CI/CD Integration

### GitHub Actions Integration

Create a `.github/workflows/playwright.yml` file:

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
    - name: Install Playwright Browsers
      run: pnpm exec playwright install --with-deps
    - name: Build application
      run: pnpm build
    - name: Start application and run tests
      run: |
        pnpm start & npx wait-on http://localhost:3000
        pnpm test:e2e
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

### Continuous Testing Practices

1. **Run smoke tests on every PR**: Ensure critical functionality works
2. **Run full test suite on main branches**: Verify comprehensive functionality
3. **Store test artifacts**: Keep test reports, screenshots, and videos
4. **Test in parallel**: Speed up test execution
5. **Retry flaky tests**: Reduce false negatives

## Best Practices

### General Best Practices

1. **Use data-testid attributes**: Make selectors resilient to UI changes
2. **Avoid using XPath**: Prefer CSS selectors or data attributes
3. **Auto-wait functionality**: Use built-in waiting instead of explicit waits
4. **Isolation**: Tests should not depend on each other
5. **Clean up after tests**: Reset the state after each test

### Performance Best Practices

1. **Reuse authentication state**: Store and reuse authentication to speed up tests
2. **Run tests in parallel**: Use multiple workers
3. **Use the test pyramid**: Have more unit tests than E2E tests
4. **Skip unnecessary actions**: Skip UI steps when testing API functionality
5. **Test similar functionalities together**: Minimize context switching

### Maintainability Best Practices

1. **Follow the Page Object Model**: Encapsulate page interactions
2. **Use fixtures for test data**: Centralize and reuse test data
3. **Explicit assertions**: Make assertions clear and specific
4. **Clear test descriptions**: Use descriptive test names
5. **Organized test structure**: Group tests logically

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright GitHub](https://github.com/microsoft/playwright)
- [Playwright Community](https://playwright.dev/docs/community) 