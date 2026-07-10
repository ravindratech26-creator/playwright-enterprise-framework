import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

const envFile = process.env.ENV_FILE || '.env.local';

dotenv.config({
    path: envFile
});

console.log(`Loaded Environment: ${envFile}`);

// Validate required environment variables
const requiredEnvVars = ['BASE_URL', 'MONGO_URI', 'MONGO_DATABASE', 'MONGO_COLLECTION', 'TEST_USER', 'TEST_PASSWORD'];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`${envVar} is not configured.`);
    }
}

// Namespaces report output so concurrent per-browser runs (e.g. Jenkins parallel branches) don't overwrite each other
const reportSuffix = process.env.REPORT_SUFFIX ? `-${process.env.REPORT_SUFFIX}` : '';

export default defineConfig({
    testDir: './tests',

    globalSetup: './globalSetup.ts',

    globalTeardown: './globalTeardown.ts',

    fullyParallel: true,

    forbidOnly: !!process.env.CI,

    retries: process.env.RETRIES ? Number(process.env.RETRIES) : process.env.CI ? 2 : 0,

    workers: process.env.WORKERS ? Number(process.env.WORKERS) : process.env.CI ? 2 : undefined,

    reporter: [
        ['html', { outputFolder: `playwright-report${reportSuffix}` }],
        ['json', { outputFile: `reports/json/report${reportSuffix}.json` }],
        ['junit', { outputFile: `reports/junit/results${reportSuffix}.xml` }],
        ['allure-playwright', { resultsDir: `allure-results${reportSuffix}` }]
    ],

    expect: {
        toHaveScreenshot: { maxDiffPixelRatio: 0.02 }
    },

    use: {
        baseURL: process.env.BASE_URL,

        headless: true,

        screenshot: 'only-on-failure',

        video: 'retain-on-failure',

        trace: 'retain-on-failure'
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] }
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] }
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] }
        }
    ]
});
