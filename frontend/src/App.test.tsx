import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import App from './App';

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();

      if (url.includes('/api/cart')) {
        return {
          ok: false,
          status: 404,
          statusText: 'Not Found',
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({
            id: 0,
            items: [],
          }),
          text: async () => 'Not Found',
        } as Response;
      }

      if (url.includes('/api/products')) {
        return {
          ok: true,
          status: 200,
          statusText: 'OK',
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => [],
          text: async () => '[]',
        } as Response;
      }

      return {
        ok: false,
        status: 500,
        statusText: 'Unhandled fetch in test',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({}),
        text: async () => 'Unhandled fetch in test',
      } as Response;
    }) as unknown as typeof fetch,
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it('renders the Buckeye Marketplace header', () => {
  render(<App />);

  expect(
    screen.getByRole('heading', { name: /buckeye marketplace/i }),
  ).toBeInTheDocument();
});
