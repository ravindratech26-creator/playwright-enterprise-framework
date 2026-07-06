import {test, expect} from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
test('Valid Login', async ({page})=>{
    // Arrange
    const loginPage=new LoginPage(page);

    // Navigate to application
    //await page.goto('https://www.saucedemo.com');
    await page.goto('/');

    // Act

    await loginPage.login('standard_user', 'secret_sauce');

    //Assert
    //await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page).toHaveURL('/inventory.html');

    

    
    
    

});

