import { test, expect, Page } from '@playwright/test';

class LoginPage {
  readonly page: Page;
  readonly usernameInput = 'input[name="username"]';
  readonly passwordInput = 'input[name="password"]';
  readonly loginButton = 'button[type="submit"]';
  readonly errorMessage = '.oxd-alert-content-text';

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/web/index.php/auth/login');
  }

  async isUsernameVisible() {
    return this.page.isVisible(this.usernameInput);
  }

  async isPasswordVisible() {
    return this.page.isVisible(this.passwordInput);
  }

  async isLoginButtonVisible() {
    return this.page.isVisible(this.loginButton);
  }

  async login(username: string, password: string) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
  }

  async getErrorMessageText() {
    await this.page.waitForSelector(this.errorMessage, {timeout: 5000});
    return this.page.textContent(this.errorMessage);
  }
}

class DashboardPage {
  readonly page: Page;
  readonly dashboardHeader = 'h6.oxd-text--h6';
  constructor(page: Page) {
    this.page = page;
  }

  async isDashboardVisible() {
    return this.page.isVisible(this.dashboardHeader);
  }

  async getHeadingText() {
    return this.page.textContent(this.dashboardHeader);
  }
}

// Test credentials environment variables
const validUsername = process.env.ORANGEHRM_USERNAME;
const validPassword = process.env.ORANGEHRM_PASSWORD;

test.describe('OrangeHRM Login Tests', () => {

  test('1. Verify login page UI elements are displayed', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(page).toHaveURL(/auth\/login$/);

    expect(await loginPage.isUsernameVisible()).toBeTruthy();
    expect(await loginPage.isPasswordVisible()).toBeTruthy();
    expect(await loginPage.isLoginButtonVisible()).toBeTruthy();
  });

  test('2. Successful login with valid credentials', async ({ page }) => {
    test.skip(!validUsername || !validPassword, 'Valid credentials not provided in environment variables');

    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.login(validUsername, validPassword);

    // Wait for navigation after login
    await page.waitForURL(/dashboard|pim|leave|time/);

    // The dashboard page contains an h6 heading with text e.g. 'Dashboard'
    expect(await dashboardPage.isDashboardVisible()).toBeTruthy();

    const headingText = await dashboardPage.getHeadingText();
    expect(headingText?.toLowerCase()).toContain('dashboard');
  });

  test('3. Verify error message is displayed for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('test', 'test');

    const errorText = await loginPage.getErrorMessageText();
    expect(errorText).toBeTruthy();
    // Common error message contains 'Invalid credentials' or similar
    expect(errorText?.toLowerCase()).toContain('invalid');
  });

});
