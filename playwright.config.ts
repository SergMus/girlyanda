import { defineConfig, devices } from '@playwright/test';

const baseURL = 'http://127.0.0.1:4210';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.e2e.ts',
  use: {baseURL},
  webServer: {
    command: 'node node_modules/@angular/cli/bin/ng.js serve --host 127.0.0.1 --port 4210',
    url: baseURL,
    reuseExistingServer: !process.env['CI'],
    timeout: 30_000,
  },
  projects: [
    {name: 'desktop', use: {...devices['Desktop Chrome']}},
    {name: 'mobile', use: {...devices['iPhone 13'], defaultBrowserType: 'chromium'}},
  ],
});
