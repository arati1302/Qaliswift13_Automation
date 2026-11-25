import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  use: {
    baseURL: process.env.BASE_URL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },
  testDir: './tests',
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
  timeout: 30000
};

export default config;
