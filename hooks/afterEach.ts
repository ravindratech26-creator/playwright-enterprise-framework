import { test } from '../fixtures/pages';
import { Logger } from '../utils/Logger';

test.afterEach(async ({ page, browserName }, testInfo) => {

    Logger.info("==================================================");
    Logger.info("TEST COMPLETED");
    Logger.info(`Test Name : ${testInfo.title}`);
    Logger.info(`Browser   : ${browserName}`);
    Logger.info(`Status    : ${testInfo.status}`);
    Logger.info(`Retries   : ${testInfo.retry} of ${testInfo.project.retries}`);

    // Capture screenshot on failure
    if (testInfo.status !== testInfo.expectedStatus) {

        const screenshotPath =
            `test-results/${testInfo.title.replace(/\s+/g, '_')}.png`;

        await page.screenshot({
            path: screenshotPath,
            fullPage: true
        });

        Logger.error(`Screenshot saved : ${screenshotPath}`);
    }

    Logger.info("==================================================");

});