import { test } from '../fixtures/pages';
import { Logger } from '../utils/Logger';
import { TestContext } from '../utils/TestContext';

test.beforeEach(async ({ page, browserName }, testInfo) => {

    // Store test name
    TestContext.setTestName(testInfo.title);

    Logger.info("==================================================");
    Logger.info("TEST STARTED");
    Logger.info(`Test Name : ${testInfo.title}`);
    Logger.info(`Browser   : ${browserName}`);

    if (testInfo.retry > 0) {
        Logger.warn(`Retry Attempt : ${testInfo.retry}`);
    }

    Logger.info("==================================================");

    // Navigate to application
    await page.goto('/');

});