import { Page } from '@playwright/test';
import { ENV } from '../utils/env';

/**
 * Base Page Object that provides common functionality for all page objects
 */
export class BasePage {
  constructor(protected page: Page) {}

  /**
   * Navigate to the base URL
   */
  async navigateToBaseURL(): Promise<void> {
    await this.page.goto(ENV.BASE_URL);
  }

  /**
   * Navigate to a specific URL path, relative to base URL
   * @param path The relative path to navigate to
   */
  async navigateTo(path: string): Promise<void> {
    await this.page.goto(`${ENV.BASE_URL}${path}`);
  }

  /**
   * Get the current page title
   * @returns The page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Wait for an element to be visible
   * @param selector The selector of the element to wait for
   */
  async waitForElement(selector: string): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'visible' });
  }

  /**
   * Click on an element
   * @param selector The selector of the element to click
   */
  async click(selector: string): Promise<void> {
    await this.waitForElement(selector);
    await this.page.click(selector);
  }

  /**
   * Fill a form field
   * @param selector The selector of the input field
   * @param value The value to fill
   */
  async fill(selector: string, value: string): Promise<void> {
    await this.waitForElement(selector);
    await this.page.fill(selector, value);
  }

  /**
   * Get text from an element
   * @param selector The selector of the element
   * @returns The text content of the element
   */
  async getText(selector: string): Promise<string> {
    await this.waitForElement(selector);
    return await this.page.innerText(selector);
  }

  /**
   * Check if an element is visible
   * @param selector The selector of the element
   * @returns True if the element is visible, false otherwise
   */
  async isVisible(selector: string): Promise<boolean> {
    return await this.page.isVisible(selector);
  }

  /**
   * Take a screenshot
   * @param name Name of the screenshot file
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `test-results/screenshots/${name}-${new Date().toISOString().replace(/:/g, '-')}.png`,
    });
  }
} 