import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { getPage } from '../utils/playwright';

let inventoryPage: InventoryPage;

// Initialize page objects before each step
const initPageObjects = function(this: any) {
  const page = getPage();
  inventoryPage = new InventoryPage(page);
};

// Sauce Labs Backpack details steps
Then('I should see the Sauce Labs Backpack product name', async function() {
  initPageObjects.call(this);
  
  const productName = await inventoryPage.getBackpackTitle();
  expect(productName).toBe('Sauce Labs Backpack');
  
  // Take screenshot and attach to report
  const screenshot = await getPage().screenshot();
  this.attach(screenshot, 'image/png');
});

Then('I should see the Sauce Labs Backpack product description', async function() {
  initPageObjects.call(this);
  
  const description = await inventoryPage.getBackpackDescription();
  expect(description).toContain('carry.allTheThings()');
  
  // Take screenshot and attach to report
  const screenshot = await getPage().screenshot();
  this.attach(screenshot, 'image/png');
});

Then('I should see the Sauce Labs Backpack product price', async function() {
  initPageObjects.call(this);
  
  const price = await inventoryPage.getBackpackPrice();
  expect(price).toBe('$29.99');
  
  // Take screenshot and attach to report
  const screenshot = await getPage().screenshot();
  this.attach(screenshot, 'image/png');
});

Then('I should see the Sauce Labs Backpack product image', async function() {
  initPageObjects.call(this);
  
  const isImageDisplayed = await inventoryPage.isBackpackImageDisplayed();
  expect(isImageDisplayed).toBe(true);
  
  // Take screenshot and attach to report
  const screenshot = await getPage().screenshot();
  this.attach(screenshot, 'image/png');
});

// Add to cart steps
When('I add the Sauce Labs Backpack to the cart', async function() {
  initPageObjects.call(this);
  
  await inventoryPage.addBackpackToCart();
  
  // Take screenshot and attach to report
  const screenshot = await getPage().screenshot();
  this.attach(screenshot, 'image/png');
});

Then('the cart badge should show {string} item', async function(expectedCount: string) {
  initPageObjects.call(this);
  
  const cartCount = await inventoryPage.getCartCount();
  expect(cartCount).toBe(parseInt(expectedCount));
  
  // Take screenshot and attach to report
  const screenshot = await getPage().screenshot();
  this.attach(screenshot, 'image/png');
});

Then('the Sauce Labs Backpack should be in the cart', async function() {
  initPageObjects.call(this);
  
  const isAddedToCart = await inventoryPage.isBackpackAddedToCart();
  expect(isAddedToCart).toBe(true);
  
  // Take screenshot and attach to report
  const screenshot = await getPage().screenshot();
  this.attach(screenshot, 'image/png');
}); 