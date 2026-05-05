/// <reference types="node" />

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'dotnet run --project ./backend/HelloWorldApi/HelloWorldApi.csproj --no-launch-profile --urls http://localhost:5001',
      url: 'http://localhost:5001/api/hello',
      reuseExistingServer: false,
      timeout: 120_000,
      cwd: '..',
      env: {
        ASPNETCORE_ENVIRONMENT: 'Development',
        DOTNET_ENVIRONMENT: 'Development',
        Jwt__Key: 'THIS_IS_A_DEV_KEY_32+_CHARS_LONG_1234567890',
      },
    },
    {
      command: 'npm run dev -- --host localhost --port 5173',
      url: 'http://localhost:5173',
      reuseExistingServer: false,
      timeout: 120_000,
      cwd: '.',
      env: {
        VITE_API_BASE_URL: 'http://localhost:5001/api',
      },
    },
  ],
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
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },
  ],
});
