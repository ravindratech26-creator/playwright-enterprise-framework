import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/Logger';

export class LoginPage extends BasePage {
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
    }

    async login(username: string, password: string) {
        Logger.info('Entering Username');
        await this.usernameInput.fill(username);

        Logger.info('Entering Password');
        await this.passwordInput.fill(password);

        Logger.info('Clicking Login Button');
        await this.loginButton.click();

        Logger.success('Login request submitted successfully');
    }
}
