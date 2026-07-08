import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';


// Load .env file
dotenv.config();


// Validate required environment variables

const requiredEnvVars = [
    'BASE_URL',
    'APP_USERNAME',
    'APP_PASSWORD',
    'MONGO_URI',
    'MONGO_DATABASE',
    'MONGO_COLLECTION'

    
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
    ['junit', { outputFile: 'reports/junit/results.xml' }]
  ],

  use: {
    baseURL: process.env.BASE_URL,
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});