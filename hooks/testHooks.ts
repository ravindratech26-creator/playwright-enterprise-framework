import { test } from '../fixtures/pages';
import { Logger } from '../utils/Logger';
import { TestContext } from '../utils/TestContext';

test.beforeEach(async ({ page, browserName }, testInfo) => {

    TestContext.setTestName(testInfo.title);

    Logger.info("==================================================");
    Logger.info("TEST STARTED");
    Logger.info(`Test Name : ${testInfo.title}`);
    Logger.info(`Browser   : ${browserName}`);
    Logger.info("==================================================");

    await page.goto('/');

});

test.afterEach(async ({ browserName }, testInfo) => {

    Logger.info("==================================================");
    Logger.info("TEST COMPLETED");
    Logger.info(`Test Name : ${testInfo.title}`);
    Logger.info(`Browser   : ${browserName}`);
    Logger.info(`Status    : ${testInfo.status}`);
    Logger.info(`Duration  : ${testInfo.duration} ms`);
    Logger.info("==================================================");

});