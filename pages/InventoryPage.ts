import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
    //private readonly page: Page;
    private readonly productsTitle: Locator;

    constructor(page: Page) {
        super(page);
        //this.page = page;
        this.productsTitle = page.locator('.title');
    }

    async isInventoryPageDisplayed(): Promise<void> {
        await expect(this.productsTitle).toBeVisible();
        await expect(this.productsTitle).toHaveText('Products');
    }
}
