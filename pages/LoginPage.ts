import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage  {

    //private readonly page: Page;

    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;

    constructor(page: Page) {
        super(page);
        //this.page = page;

        this.usernameInput = page.getByPlaceholder('Username');
        this.passwordInput = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
    //     this.usernameInput = page.locator('#user-name');
    // this.passwordInput = page.locator('#password');
    // this.loginButton = page.locator('#login-button');
    }

    async login(username: string, password: string){
    //     console.log("Inside login()");

    // await this.usernameInput.fill(username);
    // console.log("Username entered");

    // await this.passwordInput.fill(password);
    // console.log("Password entered");

    // await this.loginButton.click();
    // console.log("Login button clicked");

  
         await this.usernameInput.fill(username);
         await this.passwordInput.fill(password);
         await this.loginButton.click();



    }
}