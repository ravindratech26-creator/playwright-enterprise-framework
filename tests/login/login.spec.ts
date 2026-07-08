import '../../hooks';
import { test, expect } from '../../fixtures/pages';
import { Logger } from '../../utils/Logger';
import { Database } from '../../utils/Database';

test('Verify user can login with valid credentials', async ({ page, loginPage, inventoryPage }) => {

    const user = await Database.getLoginUser("standard_user");

    await loginPage.login(
        user!.username,
        user!.password
    );

    await expect(page).toHaveURL('/inventory.html');

    Logger.success('User logged in successfully');

    await inventoryPage.isInventoryPageDisplayed();

});