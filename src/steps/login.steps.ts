import { Given, When, Then, BeforeAll, AfterAll, Before, After, ITestCaseHookParameter, setDefaultTimeout } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { initBrowser, closeBrowser, getPage } from '../utils/playwright';
import { ENV } from '../utils/env';
import * as fs from 'fs';
import * as path from 'path';

// Set default timeout to 60 seconds
setDefaultTimeout(60000);

let loginPage: LoginPage;
let inventoryPage: InventoryPage;

// Hooks
BeforeAll({ timeout: 60000 }, async () => {
  // Create test-results/screenshots directory if it doesn't exist
  const screenshotsDir = path.join(process.cwd(), 'test-results', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // Create test-results/videos directory if it doesn't exist
  const videosDir = path.join(process.cwd(), 'test-results', 'videos');
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
  }
});

AfterAll({ timeout: 60000 }, async () => {
  await closeBrowser();
});

Before({ timeout: 60000 }, async function () {
  const page = await initBrowser();
  loginPage = new LoginPage(page);
  inventoryPage = new InventoryPage(page);
});

// Take a screenshot if a scenario fails
After({ timeout: 60000 }, async function (testCase: ITestCaseHookParameter) {
  const page = getPage();
  
  if (testCase?.result?.status === 'FAILED') {
    // Take screenshot for failed tests
    const screenshot = await page.screenshot({ 
      path: `test-results/screenshots/failure-${Date.now()}.png`,
      fullPage: true
    });
    this.attach(screenshot, 'image/png');
  } else {
    // Take screenshot for passed tests too
    const screenshot = await page.screenshot({ 
      path: `test-results/screenshots/success-${Date.now()}.png`,
      fullPage: true
    });
    this.attach(screenshot, 'image/png');
  }
});

// Step definitions
Given('I am on the login page', async function() {
  await loginPage.navigateToLoginPage();
  
  // Take screenshot and attach to report
  const screenshot = await getPage().screenshot();
  this.attach(screenshot, 'image/png');
});

Then('the page title should be {string}', async function(expectedTitle: string) {
  const actualTitle = await loginPage.getPageTitle();
  expect(actualTitle).toBe(expectedTitle);
});

Then('the login logo should be displayed', async function() {
  const isLogoDisplayed = await loginPage.isLogoDisplayed();
  expect(isLogoDisplayed).toBe(true);
  
  // Take screenshot of the logo
  const screenshot = await getPage().screenshot();
  this.attach(screenshot, 'image/png');
});

When('I login with valid credentials', async function() {
  await loginPage.login(ENV.STANDARD_USER, ENV.PASSWORD);
  
  // Take screenshot after login
  const screenshot = await getPage().screenshot();
  this.attach(screenshot, 'image/png');
});

When('I login with username {string} and password {string}', async function(username: string, password: string) {
  await loginPage.login(username, password);
  
  // Take screenshot after login attempt
  const screenshot = await getPage().screenshot();
  this.attach(screenshot, 'image/png');
});

Then('I should be redirected to the inventory page', async function() {
  const isOnInventoryPage = await inventoryPage.isOnInventoryPage();
  expect(isOnInventoryPage).toBe(true);
  
  // Take screenshot of inventory page
  const screenshot = await getPage().screenshot();
  this.attach(screenshot, 'image/png');
});

Then('I should see an error message {string}', async function(expectedErrorMessage: string) {
  const isErrorDisplayed = await loginPage.isErrorMessageDisplayed();
  expect(isErrorDisplayed).toBe(true);
  
  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage).toBe(expectedErrorMessage);
  
  // Take screenshot showing error message
  const screenshot = await getPage().screenshot();
  this.attach(screenshot, 'image/png');
}); 