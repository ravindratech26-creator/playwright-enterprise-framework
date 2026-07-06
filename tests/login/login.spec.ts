import { test, expect } from '../../fixtures/pages';
import { loginData } from '../../test-data/loginData';

test('Verify user can login with valid credentials', async ({ page, loginPage, inventoryPage }) => {

    await page.goto('/');

    await loginPage.login(
        loginData.validUser.username,
        loginData.validUser.password
    );

    await expect(page).toHaveURL('/inventory.html');

    await inventoryPage.isInventoryPageDisplayed();

});