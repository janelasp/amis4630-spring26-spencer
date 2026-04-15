import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/vitest.setup.ts'],

    // IMPORTANT: Setting `exclude` overrides Vitest defaults.
    // Keep node_modules excluded and also exclude Playwright E2E specs.
    exclude: ['**/node_modules/**', 'e2e/**'],
  },
});
