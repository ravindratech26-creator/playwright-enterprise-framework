import '../../hooks';
import { test, expect } from '../../fixtures/pages';
import { Logger } from '../../utils/Logger';
import { Database } from '../../utils/Database';

test(
    'Verify user can login with valid credentials',
    { tag: ['@smoke', '@regression'] },
    async ({ page, loginPage, inventoryPage }) => {
        // Visual regression baseline for the login form
        await expect(page).toHaveScreenshot('login-page.png');

        // Fetch login credentials from MongoDB
        const user = await Database.getLoginUser(process.env.TEST_USER!);

        await loginPage.login(user.username, user.password);

        await expect(page).toHaveURL('/inventory.html');

        Logger.success('User logged in successfully');

        await inventoryPage.isInventoryPageDisplayed();
    }
);
