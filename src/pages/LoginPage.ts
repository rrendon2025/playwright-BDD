import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Selectors
  private readonly usernameInput = '#user-name';
  private readonly passwordInput = '#password';
  private readonly loginButton = '#login-button';
  private readonly errorMessage = '[data-test="error"]';
  private readonly logo = '.login_logo';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the login page
   */
  async navigateToLoginPage(): Promise<void> {
    await this.navigateToBaseURL();
  }

  /**
   * Get the page title
   * @returns The page title
   */
  async getPageTitle(): Promise<string> {
    return await this.getTitle();
  }

  /**
   * Login with provided credentials
   * @param username Username to login with
   * @param password Password to login with
   */
  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  /**
   * Check if login error message is displayed
   * @returns True if error message is visible, false otherwise
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  /**
   * Get the error message text
   * @returns The error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  /**
   * Check if login logo is displayed
   * @returns True if login logo is visible, false otherwise
   */
  async isLogoDisplayed(): Promise<boolean> {
    return await this.isVisible(this.logo);
  }
} 