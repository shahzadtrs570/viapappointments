# Sample Playwright Test Implementation

This document provides a concrete example of implementing a Playwright test for a specific feature in the NextJet application. We'll walk through the process of creating tests for the authentication flow, starting with the login functionality.

## Feature to Test: Authentication Flow

We'll implement tests for the authentication flow, covering:
1. Login with valid credentials
2. Login with invalid credentials
3. Password reset request
4. Signup process

## Step 1: Set Up Project Structure

First, create the necessary directory structure:

```bash
mkdir -p tests/e2e/auth
mkdir -p tests/e2e/pages
mkdir -p tests/e2e/utils
```

## Step 2: Create Authentication Page Objects

Create the login page object at `tests/e2e/pages/LoginPage.ts`:

```typescript
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly signupLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[data-testid="email-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.loginButton = page.locator('[data-testid="login-button"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.forgotPasswordLink = page.locator('[data-testid="forgot-password-link"]');
    this.signupLink = page.locator('[data-testid="signup-link"]');
  }

  async goto() {
    await this.page.goto('/auth/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  async clickSignup() {
    await this.signupLink.click();
  }
}
```

Create the signup page object at `tests/e2e/pages/SignupPage.ts`:

```typescript
import { Page, Locator } from '@playwright/test';

export class SignupPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly signupButton: Locator;
  readonly errorMessage: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('[data-testid="name-input"]');
    this.emailInput = page.locator('[data-testid="email-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.confirmPasswordInput = page.locator('[data-testid="confirm-password-input"]');
    this.signupButton = page.locator('[data-testid="signup-button"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.loginLink = page.locator('[data-testid="login-link"]');
  }

  async goto() {
    await this.page.goto('/auth/signup');
  }

  async signup(name: string, email: string, password: string, confirmPassword: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword || password);
    await this.signupButton.click();
  }

  async clickLogin() {
    await this.loginLink.click();
  }
}
```

Create the password reset page object at `tests/e2e/pages/PasswordResetPage.ts`:

```typescript
import { Page, Locator } from '@playwright/test';

export class PasswordResetPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly backToLoginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[data-testid="email-input"]');
    this.submitButton = page.locator('[data-testid="reset-button"]');
    this.successMessage = page.locator('[data-testid="success-message"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.backToLoginLink = page.locator('[data-testid="back-to-login"]');
  }

  async goto() {
    await this.page.goto('/auth/forgot-password');
  }

  async requestPasswordReset(email: string) {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }

  async backToLogin() {
    await this.backToLoginLink.click();
  }
}
```

## Step 3: Create Test Data Utilities

Create `tests/e2e/utils/test-data.ts`:

```typescript
export interface TestUser {
  name: string;
  email: string;
  password: string;
}

export const testUsers = {
  validUser: {
    name: 'Test User',
    email: 'test.user@example.com',
    password: 'Password123!'
  },
  invalidUser: {
    name: 'Invalid User',
    email: 'invalid.user@example.com',
    password: 'wrongpassword'
  },
  newUser: {
    name: 'New User',
    email: `new.user.${Date.now()}@example.com`,
    password: 'NewPassword123!'
  }
};
```

## Step 4: Implement Login Tests

Create `tests/e2e/auth/login.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { testUsers } from '../utils/test-data';

test.describe('Login functionality', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('displays login form correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Sign in/);
    
    // Check form elements
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
    await expect(loginPage.signupLink).toBeVisible();
  });

  test('successful login with valid credentials', async ({ page }) => {
    await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
    
    // Check redirection to dashboard
    await expect(page).toHaveURL(/dashboard/);
    
    // Check if user menu with username is visible
    const userMenu = page.locator('[data-testid="user-menu"]');
    await expect(userMenu).toBeVisible();
    await expect(userMenu).toContainText(testUsers.validUser.name);
  });

  test('shows error with invalid credentials', async ({ page }) => {
    await loginPage.login(testUsers.invalidUser.email, testUsers.invalidUser.password);
    
    // Check error message
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(/invalid email or password/i);
    
    // Verify we're still on the login page
    await expect(page).toHaveURL(/login/);
  });

  test('navigates to forgot password page', async ({ page }) => {
    await loginPage.clickForgotPassword();
    await expect(page).toHaveURL(/forgot-password/);
  });

  test('navigates to signup page', async ({ page }) => {
    await loginPage.clickSignup();
    await expect(page).toHaveURL(/signup/);
  });
});
```

## Step 5: Implement Signup Tests

Create `tests/e2e/auth/signup.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';
import { SignupPage } from '../pages/SignupPage';
import { testUsers } from '../utils/test-data';

test.describe('Signup functionality', () => {
  let signupPage: SignupPage;

  test.beforeEach(async ({ page }) => {
    signupPage = new SignupPage(page);
    await signupPage.goto();
  });

  test('displays signup form correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Sign up/);
    
    await expect(signupPage.nameInput).toBeVisible();
    await expect(signupPage.emailInput).toBeVisible();
    await expect(signupPage.passwordInput).toBeVisible();
    await expect(signupPage.confirmPasswordInput).toBeVisible();
    await expect(signupPage.signupButton).toBeVisible();
    await expect(signupPage.loginLink).toBeVisible();
  });

  test('successful signup with valid data', async ({ page }) => {
    const newUser = testUsers.newUser;
    
    await signupPage.signup(
      newUser.name,
      newUser.email,
      newUser.password,
      newUser.password
    );
    
    // Check redirection to dashboard or email verification page
    await expect(page).toHaveURL(/dashboard|verify-email/);
  });

  test('shows error with existing email', async ({ page }) => {
    const existingUser = testUsers.validUser;
    
    await signupPage.signup(
      existingUser.name,
      existingUser.email,
      existingUser.password,
      existingUser.password
    );
    
    await expect(signupPage.errorMessage).toBeVisible();
    await expect(signupPage.errorMessage).toContainText(/email already exists/i);
  });

  test('shows error with password mismatch', async ({ page }) => {
    const newUser = testUsers.newUser;
    
    await signupPage.signup(
      newUser.name,
      newUser.email,
      newUser.password,
      'DifferentPassword123!'
    );
    
    await expect(signupPage.errorMessage).toBeVisible();
    await expect(signupPage.errorMessage).toContainText(/passwords do not match/i);
  });

  test('navigates to login page', async ({ page }) => {
    await signupPage.clickLogin();
    await expect(page).toHaveURL(/login/);
  });
});
```

## Step 6: Implement Password Reset Tests

Create `tests/e2e/auth/password-reset.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';
import { PasswordResetPage } from '../pages/PasswordResetPage';
import { testUsers } from '../utils/test-data';

test.describe('Password reset functionality', () => {
  let resetPage: PasswordResetPage;

  test.beforeEach(async ({ page }) => {
    resetPage = new PasswordResetPage(page);
    await resetPage.goto();
  });

  test('displays password reset form correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Reset password/);
    
    await expect(resetPage.emailInput).toBeVisible();
    await expect(resetPage.submitButton).toBeVisible();
    await expect(resetPage.backToLoginLink).toBeVisible();
  });

  test('shows success message with valid email', async ({ page }) => {
    await resetPage.requestPasswordReset(testUsers.validUser.email);
    
    await expect(resetPage.successMessage).toBeVisible();
    await expect(resetPage.successMessage).toContainText(/check your email/i);
  });

  test('shows error with invalid email format', async ({ page }) => {
    await resetPage.requestPasswordReset('invalid-email');
    
    await expect(resetPage.errorMessage).toBeVisible();
    await expect(resetPage.errorMessage).toContainText(/valid email/i);
  });

  test('navigates back to login page', async ({ page }) => {
    await resetPage.backToLogin();
    await expect(page).toHaveURL(/login/);
  });
});
```

## Step 7: Create Authentication State Helper

Create `tests/e2e/utils/auth-helper.ts`:

```typescript
import { Page } from '@playwright/test';
import { testUsers } from './test-data';

export async function login(page: Page, email: string, password: string) {
  await page.goto('/auth/login');
  await page.fill('[data-testid="email-input"]', email);
  await page.fill('[data-testid="password-input"]', password);
  await page.click('[data-testid="login-button"]');
  await page.waitForURL('/dashboard');
}

export async function saveAuthenticationState(page: Page, userType: 'validUser' | 'newUser') {
  const user = testUsers[userType];
  await login(page, user.email, user.password);
  await page.context().storageState({ 
    path: `./tests/e2e/fixtures/auth-state-${userType}.json` 
  });
}
```

## Step 8: Setup Authenticated Tests

Create `tests/e2e/setup/auth-setup.ts`:

```typescript
import { test } from '@playwright/test';
import { saveAuthenticationState } from '../utils/auth-helper';

// This test will only be used to set up authentication state
test('Set up authentication states', async ({ browser }) => {
  const page = await browser.newPage();
  
  try {
    // Save valid user authentication state
    await saveAuthenticationState(page, 'validUser');
    console.log('Created authentication state for valid user');
    
    // Attempt to create a new user and save authentication state
    await page.goto('/auth/signup');
    const newUser = {
      name: `New User ${Date.now()}`,
      email: `test.user.${Date.now()}@example.com`,
      password: 'NewPassword123!'
    };
    
    await page.fill('[data-testid="name-input"]', newUser.name);
    await page.fill('[data-testid="email-input"]', newUser.email);
    await page.fill('[data-testid="password-input"]', newUser.password);
    await page.fill('[data-testid="confirm-password-input"]', newUser.password);
    await page.click('[data-testid="signup-button"]');
    
    // Wait for navigation to complete
    await page.waitForURL(/dashboard|verify-email/);
    
    // If there's a verification page, we can't proceed with authentication
    if (page.url().includes('verify-email')) {
      console.log('New user requires email verification, skipping authentication state');
    } else {
      await page.context().storageState({ 
        path: `./tests/e2e/fixtures/auth-state-newUser.json` 
      });
      console.log('Created authentication state for new user');
    }
  } finally {
    await page.close();
  }
});
```

## Step 9: Run Tests

To run the authentication tests:

```bash
pnpm test:e2e tests/e2e/auth
```

To run a specific test file:

```bash
pnpm test:e2e tests/e2e/auth/login.spec.ts
```

To run tests with UI mode:

```bash
pnpm test:e2e:ui tests/e2e/auth
```

## Sample Test Execution and Results

Here's what you would expect to see when running the login tests:

1. Browser launches (headed or headless mode)
2. Navigates to login page
3. Enters credentials and submits
4. Verifies successful login or error messages
5. Browser closes (unless in UI mode)

Test results would look something like:

```
Running 5 tests using 1 worker
  5 passed
  
  ✓ login.spec.ts:10:1 › Login functionality › displays login form correctly (452ms)
  ✓ login.spec.ts:21:1 › Login functionality › successful login with valid credentials (1.2s)
  ✓ login.spec.ts:33:1 › Login functionality › shows error with invalid credentials (632ms)
  ✓ login.spec.ts:43:1 › Login functionality › navigates to forgot password page (421ms)
  ✓ login.spec.ts:48:1 › Login functionality › navigates to signup page (387ms)
```

## Recommendations for Test Implementation

1. **Use data-testid attributes**: Ensure your frontend components have data-testid attributes for stable test selectors.

2. **Implement page objects**: Follow the Page Object Model pattern for maintainable tests.

3. **Manage test data carefully**: Use dynamic data when needed to avoid test interdependencies.

4. **Handle authentication efficiently**: Store authentication states to speed up tests.

5. **Group related tests**: Organize tests by feature or user flow.

6. **Test error states**: Don't just test the happy path; verify error handling.

7. **Keep assertions focused**: Each test should verify one specific thing.

8. **Consider test environment**: Make sure tests can run in CI/CD environments.

## Next Steps

After implementing the authentication tests, proceed to implement tests for other critical features:

1. Dashboard functionality
2. User profile management
3. Subscription and payment flows
4. Critical user workflows
5. Admin functionality (if applicable)

Continue to follow the pattern of creating page objects, implementing test data, and writing focused test cases for each feature.

## Troubleshooting Common Issues

1. **Selector not found**: Check if the data-testid is correctly implemented in the component.

2. **Test timing out**: Increase timeouts or use more reliable waiting strategies.

3. **Authentication failure**: Check if the test user credentials are valid in the test environment.

4. **Test flakiness**: Identify and fix race conditions or timing issues.

5. **CI/CD failures**: Ensure environment variables and configurations are properly set for CI. 