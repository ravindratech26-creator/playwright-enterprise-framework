import { expect, test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { loginData } from '../../test-data/loginData';


test('Valid Login', async ({ page }) => {

    // Arrange
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await page.goto('/');

    // Act
    //await loginPage.login('standard_user', 'secret_sauce');
    await loginPage.login(
    loginData.validUser.username,
    loginData.validUser.password
    );

    // Assert
    await expect(page).toHaveURL('/inventory.html');
    await inventoryPage.isInventoryPageDisplayed();

});