import { Browser, BrowserContext, chromium, firefox, Page, webkit } from '@playwright/test';
import { ENV } from './env';

let browser: Browser | null = null;
let context: BrowserContext | null = null;
let page: Page | null = null;

/**
 * Initialize the browser based on environment configuration if not already initialized
 * @returns The Playwright page object
 */
export const initBrowser = async (): Promise<Page> => {
  // If we already have a browser instance, return the existing page
  if (browser && context && page) {
    return page;
  }

  const browserType = ENV.BROWSER;
  const options = {
    headless: ENV.HEADLESS,
    slowMo: ENV.SLOW_MO,
  };

  // Create a new browser instance if it doesn't exist
  if (!browser) {
    switch (browserType) {
      case 'firefox':
        browser = await firefox.launch(options);
        break;
      case 'webkit':
        browser = await webkit.launch(options);
        break;
      default:
        browser = await chromium.launch(options);
    }
  }

  // Create a new context if it doesn't exist
  if (!context) {
    context = await browser.newContext({
      viewport: { width: 1366, height: 768 },
      recordVideo: {
        dir: 'test-results/videos/',
        size: { width: 1366, height: 768 },
      },
    });
  }
  
  // Create a new page if it doesn't exist
  if (!page) {
    page = await context.newPage();
    await page.setDefaultTimeout(ENV.TIMEOUT);
  }
  
  return page;
};

/**
 * Get the current Playwright page instance
 * @returns The current Playwright page
 */
export const getPage = (): Page => {
  if (!page) {
    throw new Error('Browser has not been initialized. Call initBrowser() first.');
  }
  return page;
};

/**
 * Close the browser and all related resources
 */
export const closeBrowser = async (): Promise<void> => {
  if (context) await context.close();
  if (browser) await browser.close();
  
  // Reset references
  browser = null;
  context = null;
  page = null;
}; 