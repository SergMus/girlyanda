import { defineConfig, devices } from '@playwright/test';

const BASE_URL = 'http://127.0.0.1:4210';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.e2e.ts',
  use: { baseURL: BASE_URL },
  webServer: {
    command: 'node node_modules/@angular/cli/bin/ng.js serve --host 127.0.0.1 --port 4210',
    url: BASE_URL,
    reuseExistingServer: !process.env['CI'],
    timeout: 30_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
});
