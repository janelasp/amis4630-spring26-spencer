import { test, expect } from '@playwright/test';

test('happy path: register → login → browse → add to cart → checkout → verify order in history', async ({ page }) => {
  const unique = Date.now();
  const email = `e2e.user.${unique}@buckeye.local`;
  const password = 'Test1234';

  await test.step('Register a new user', async () => {
    await page.goto('/register');

    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByLabel('Confirm password').fill(password);
    await page.getByRole('button', { name: 'Submit registration' }).click();

    // Register auto-logs in and redirects.
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();

    await test.info().attach('after-register', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });
  });

  await test.step('Logout after registration', async () => {
    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();

    await test.info().attach('after-logout', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });
  });

  await test.step('Login with the registered user', async () => {
    await page.goto('/login');

    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Submit login' }).click();

    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();

    await test.info().attach('after-login', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });
  });

  await test.step('Browse products', async () => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Buckeye Marketplace' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Organic Chemistry Textbook' })).toBeVisible();

    await test.info().attach('after-browse-products', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });
  });

  await test.step('Add an item to the cart', async () => {
    await page.getByRole('button', { name: 'Add Organic Chemistry Textbook to cart' }).click();

    await expect(page.getByRole('button', { name: /Shopping cart with 1 items?/i })).toBeVisible();

    await test.info().attach('after-add-to-cart', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });
  });

  let confirmationCode = '';
  let orderId: number | null = null;

  await test.step('Checkout and place an order', async () => {
    await page.getByRole('button', { name: /Shopping cart with \d+ items?/i }).click();
    await expect(page.getByRole('heading', { name: 'Your cart' })).toBeVisible();

    await page.getByRole('button', { name: 'Proceed to checkout' }).click();
    await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Shipping Address' }).fill('123 Campus Way');
    await page.getByRole('textbox', { name: 'City' }).fill('Columbus');
    await page.getByLabel('State').selectOption('OH');
    await page.getByRole('textbox', { name: 'Zip Code' }).fill('43210');

    await page.getByRole('button', { name: 'Place order' }).click();

    await expect(page.getByRole('heading', { name: 'Order Confirmed' })).toBeVisible();

    const confirmationText = await page.locator('p', { hasText: 'Confirmation:' }).innerText();
    const match = confirmationText.match(/Confirmation:\s*(\S+)/i);
    confirmationCode = match?.[1] ?? '';

    // Order id is in the route: /order-confirmation/:orderId
    const orderIdRaw = new URL(page.url()).pathname.split('/').pop() ?? '';
    const parsedId = Number(orderIdRaw);
    orderId = Number.isFinite(parsedId) ? parsedId : null;

    await test.info().attach('after-place-order', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });
  });

  await test.step('Verify order appears in order history', async () => {
    await page.getByRole('link', { name: 'Go to my orders' }).click();

    await expect(page.getByRole('heading', { name: 'My Orders' })).toBeVisible();

    // Minimal QA improvement: data-testid on order cards to avoid ambiguous text selectors.
    const orderList = page.getByTestId('order-list');
    await expect(orderList).toBeVisible();

    const orderRow = orderId !== null
      ? page.getByTestId(`order-card-${orderId}`)
      : orderList.getByRole('listitem').first();

    if (confirmationCode) {
      await expect(orderRow.getByText(confirmationCode)).toBeVisible();
    }

    await expect(orderRow.getByText('Organic Chemistry Textbook')).toBeVisible();

    await test.info().attach('after-order-history', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });
  });
});
