import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  // Selectors
  private readonly inventoryContainer = '#inventory_container';
  private readonly inventoryList = '.inventory_list';
  private readonly backpackTitle = '#item_4_title_link';
  private readonly backpackImage = '#item_4_img_link';
  private readonly backpackDescription = '#inventory_container .inventory_item:first-child .inventory_item_desc';
  private readonly backpackPrice = '#inventory_container .inventory_item:first-child .inventory_item_price';
  private readonly backpackAddButton = '#add-to-cart-sauce-labs-backpack';
  private readonly backpackRemoveButton = '#remove-sauce-labs-backpack';
  private readonly shoppingCartBadge = '.shopping_cart_badge';
  private readonly shoppingCartLink = '.shopping_cart_link';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Check if user is on inventory page
   * @returns True if inventory container is visible, false otherwise
   */
  async isOnInventoryPage(): Promise<boolean> {
    return await this.isVisible(this.inventoryContainer);
  }

  /**
   * Get the title of Sauce Labs Backpack product
   * @returns The product title
   */
  async getBackpackTitle(): Promise<string> {
    return await this.getText(this.backpackTitle);
  }

  /**
   * Get the description of Sauce Labs Backpack product
   * @returns The product description
   */
  async getBackpackDescription(): Promise<string> {
    return await this.getText(this.backpackDescription);
  }

  /**
   * Get the price of Sauce Labs Backpack product
   * @returns The product price
   */
  async getBackpackPrice(): Promise<string> {
    return await this.getText(this.backpackPrice);
  }

  /**
   * Check if Sauce Labs Backpack image is displayed
   * @returns True if image is visible, false otherwise
   */
  async isBackpackImageDisplayed(): Promise<boolean> {
    return await this.isVisible(this.backpackImage);
  }

  /**
   * Add Sauce Labs Backpack to cart
   */
  async addBackpackToCart(): Promise<void> {
    await this.click(this.backpackAddButton);
  }

  /**
   * Check if Sauce Labs Backpack is added to cart
   * @returns True if remove button is visible, false otherwise
   */
  async isBackpackAddedToCart(): Promise<boolean> {
    return await this.isVisible(this.backpackRemoveButton);
  }

  /**
   * Get the shopping cart badge count
   * @returns The number shown on the shopping cart badge
   */
  async getCartCount(): Promise<number> {
    const badge = await this.getText(this.shoppingCartBadge);
    return parseInt(badge);
  }

  /**
   * Navigate to the shopping cart
   */
  async goToShoppingCart(): Promise<void> {
    await this.click(this.shoppingCartLink);
  }
} 