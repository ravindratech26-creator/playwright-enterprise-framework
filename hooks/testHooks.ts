import { test } from '../fixtures/pages';
import { TestContext } from '../utils/TestContext';

test.beforeEach(async ({ page }, testInfo) => {

    TestContext.setTestName(testInfo.title);

    await page.goto('/');

});

test.afterEach(async ({}, testInfo) => {

    console.log(`Test Status : ${testInfo.status}`);

});