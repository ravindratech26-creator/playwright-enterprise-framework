import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

const envFile = process.env.ENV_FILE || '.env.local';

dotenv.config({
    path: envFile
});

console.log(`Loaded Environment: ${envFile}`);

console.log(`Loaded Environment: ${envFile}`);

// Validate required environment variables
const requiredEnvVars = [
    'BASE_URL',
    'MONGO_URI',
    'MONGO_DATABASE',
    'MONGO_COLLECTION',
    'TEST_USER'
];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`${envVar} is not configured.`);
    }
}

export default defineConfig({

    testDir: './tests',

    fullyParallel: true,

    forbidOnly: !!process.env.CI,

    retries: process.env.CI ? 2 : 0,

    workers: process.env.CI ? 1 : undefined,

    reporter: [
        ['html'],
        ['json', { outputFile: 'reports/json/report.json' }],
        ['junit', { outputFile: 'reports/junit/results.xml' }],
        ['allure-playwright', { resultsDir: 'allure-results' }]
    ],

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