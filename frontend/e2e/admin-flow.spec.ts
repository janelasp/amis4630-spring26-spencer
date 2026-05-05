import { test, expect } from '@playwright/test';

const API_BASE_URL = 'http://localhost:5001/api';

async function getAccessTokenFromStorage(page: { evaluate: (fn: () => string | null) => Promise<string | null> }): Promise<string | null> {
  const rawAuth = await page.evaluate(
    () => (globalThis as { localStorage?: { getItem: (key: string) => string | null } }).localStorage?.getItem('buckeyeMarketplace.auth') ?? null,
  );
  if (!rawAuth) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawAuth) as { accessToken?: unknown };
    return typeof parsed.accessToken === 'string' ? parsed.accessToken : null;
  } catch {
    return null;
  }
}

async function waitForStoredAccessToken(page: { evaluate: (fn: () => string | null) => Promise<string | null> }) {
  await expect
    .poll(async () => {
      const token = await getAccessTokenFromStorage(page);
      return typeof token === 'string' && token.length > 0;
    })
    .toBe(true);
}

async function getAuthHeaders(page: { evaluate: (fn: () => string | null) => Promise<string | null> }): Promise<Record<string, string> | null> {
  const accessToken = await getAccessTokenFromStorage(page);
  if (!accessToken) {
    return null;
  }

  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

async function clearCartViaApi(page: { request: import('@playwright/test').APIRequestContext; evaluate: (fn: () => string | null) => Promise<string | null> }) {
  const headers = await getAuthHeaders(page);
  if (!headers) {
    return;
  }

  // Ensure a cart exists (GET creates an empty cart on first use).
  await page.request.get(`${API_BASE_URL}/cart`, { headers });
  await page.request.delete(`${API_BASE_URL}/cart/clear`, { headers });
}

async function getServerCartTotalItems(page: { request: import('@playwright/test').APIRequestContext; evaluate: (fn: () => string | null) => Promise<string | null> }): Promise<number> {
  const headers = await getAuthHeaders(page);
  if (!headers) {
    return 0;
  }

  const response = await page.request.get(`${API_BASE_URL}/cart`, { headers });
  if (!response.ok()) {
    return 0;
  }

  const data = (await response.json()) as unknown as Record<string, unknown>;
  const totalItems = data.totalItems ?? data.TotalItems;
  return typeof totalItems === 'number' ? totalItems : 0;
}

test('admin flow: product management and order placement', async ({ page }) => {
  const projectName = test.info().project.name;
  const unique = Date.now();
  const adminEmail = `admin+${projectName}@buckeye.local`;
  const adminPassword = 'Admin1234';
  const productTitle = `Admin Flow Test Product ${unique}`;

  await test.step('Login as admin', async () => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(adminEmail);
    await page.getByLabel('Password').fill(adminPassword);
    await page.getByRole('button', { name: 'Submit login' }).click();

    await expect(page.getByRole('link', { name: 'Go to admin dashboard' })).toBeVisible();

    await waitForStoredAccessToken(page);

    await clearCartViaApi(page);
  });

  await test.step('Open admin dashboard', async () => {
    await page.getByRole('link', { name: 'Go to admin dashboard' }).click();
    await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible();
  });

  await test.step('Add a product in product management', async () => {
    await page.getByLabel('New product title').fill(productTitle);
    await page.getByLabel('New product category').fill('Testing');
    await page.getByLabel('New product seller name').fill('Admin QA');
    await page.getByLabel('New product price').fill('24.99');
    await page.getByLabel('New product image url').fill('https://example.com/images/admin-flow-test.jpg');
    await page.getByLabel('New product description').fill('Admin flow test product.');

    await page.getByRole('button', { name: 'Create product' }).click();

    await expect(page.getByRole('row', { name: new RegExp(productTitle) })).toBeVisible();
  });

  await test.step('Add product to cart and place order', async () => {
    await page.getByRole('link', { name: 'Buckeye Marketplace' }).click();

    await page.reload();

    const addButton = page.getByRole('button', { name: `Add ${productTitle} to cart` });
    await expect(addButton).toBeVisible();
    await addButton.scrollIntoViewIfNeeded();

    const addCartResponsePromise = page.waitForResponse((response) => {
      return (
        response.url().endsWith('/api/cart') &&
        response.request().method() === 'POST'
      );
    });

    if (projectName.startsWith('mobile-')) {
      await addButton.evaluate((el) => (el as { click: () => void }).click());
    } else {
      await addButton.click();
    }

    const addCartResponse = await addCartResponsePromise;
    expect(addCartResponse.ok()).toBeTruthy();

    await expect.poll(async () => await getServerCartTotalItems(page), { timeout: 15000 }).toBe(1);

    const cartButton = page.getByRole('button', { name: /Shopping cart with \d+ items?/i });
    await expect(cartButton).toBeVisible();
    await expect(cartButton).toHaveAttribute('aria-label', /Shopping cart with 1 items?/i, { timeout: 15000 });
    await cartButton.click();

    const proceedButton = page.getByRole('button', { name: 'Proceed to checkout' });
    await expect(proceedButton).toBeVisible();
    await proceedButton.scrollIntoViewIfNeeded();
    if (projectName.startsWith('mobile-')) {
      await proceedButton.evaluate((el) => (el as { click: () => void }).click());
    } else {
      await proceedButton.click();
    }

    await page.getByRole('textbox', { name: 'Shipping Address' }).fill('123 Campus Way');
    await page.getByRole('textbox', { name: 'City' }).fill('Columbus');
    await page.getByLabel('State').selectOption('OH');
    await page.getByRole('textbox', { name: 'Zip Code' }).fill('43210');

    await page.getByRole('button', { name: 'Place order' }).click();
    await expect(page.getByRole('heading', { name: 'Order Confirmed' })).toBeVisible();
  });

  await test.step('Verify order appears in my orders', async () => {
    await page.getByRole('link', { name: 'View My Orders' }).click();
    await expect(page.getByRole('heading', { name: 'My Orders' })).toBeVisible();
    await expect(page.getByText(productTitle)).toBeVisible();
  });
});
