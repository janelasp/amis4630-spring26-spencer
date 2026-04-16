# E2E run (Playwright MCP-driven)

## Prompts used

1. Initial prompt

- Register or log in with a valid user.
- Browse products.
- Add an item to the cart.
- Go to checkout and place an order.
- Verify the order confirmation appears.
- Go to order history and verify the order is listed.
- After each major step, snapshot the page and continue only if it looks correct.
- If something fails, stop and say exactly what failed.
- After a successful run, generate a Playwright spec and run npx playwright test.

2. Follow-up prompt (debugging)

- Stop; identify the 2 console errors and fix them.

3. Follow-up prompt (resume)

- Resume the E2E run.

## What failed the first time

1. Browser console errors during the MCP-driven run

- GET http://localhost:5000/api/cart returned 401, then 404.

2. First Playwright test run failed due to ambiguous text selector

- Playwright strict mode error: getByText('Organic Chemistry Textbook') matched multiple elements on the order history page.

## What was corrected

1. Fixed the 401/404 cart console errors

- Frontend: on startup, when restoring stored auth, refresh expired tokens (or clear auth if refresh fails).
  - File: [frontend/src/contexts/AuthContext.tsx](../frontend/src/contexts/AuthContext.tsx)
- Backend: treat “no cart yet” as an empty cart instead of returning 404.
  - File: [backend/HelloWorldApi/Controllers/CartController.cs](../backend/HelloWorldApi/Controllers/CartController.cs)

2. Fixed the Playwright strict-mode selector issue

- Added minimal `data-testid` attributes to the Orders page so the E2E test can target a specific order card deterministically.
  - UI file: [frontend/src/components/OrdersPage/OrdersPage.tsx](../frontend/src/components/OrdersPage/OrdersPage.tsx)
- Updated the Playwright spec to use `getByTestId` (and the created order id from the confirmation URL) instead of ambiguous `getByText` selectors.
  - Test file: [frontend/e2e/checkout-order-history.spec.ts](../frontend/e2e/checkout-order-history.spec.ts)


