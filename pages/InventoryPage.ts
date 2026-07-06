import { expect, Locator, Page } from '@playwright/test';

export class InventoryPage {

    private readonly page: Page;
    private readonly productsTitle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productsTitle = page.locator('.title');
    }

    async isInventoryPageDisplayed(): Promise<void> {
        await expect(this.productsTitle).toBeVisible();
        await expect(this.productsTitle).toHaveText('Products');
    }
}