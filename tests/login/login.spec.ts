import '../../hooks';
import { test, expect } from '../../fixtures/pages';
import { loginData } from '../../test-data/loginData';
import { Logger } from '../../utils/Logger';

test('Verify user can login with valid credentials', async ({ page, loginPage, inventoryPage }) => {

    await loginPage.login(
        loginData.validUser.username,
        loginData.validUser.password
    );

    await expect(page).toHaveURL('/inventory.html');

    Logger.success('User logged in successfully');

    await inventoryPage.isInventoryPageDisplayed();

});