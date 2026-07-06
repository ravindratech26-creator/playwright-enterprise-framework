import { expect, test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';

test('Valid Login', async ({ page }) => {

    // Arrange
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await page.goto('/');

    // Act
    await loginPage.login('standard_user', 'secret_sauce');

    // Assert
    await expect(page).toHaveURL('/inventory.html');
    await inventoryPage.isInventoryPageDisplayed();

});