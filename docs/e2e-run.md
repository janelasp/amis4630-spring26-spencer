# E2E run (Playwright MCP-driven)

## User Flow (Checkout-Order History)

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


## Admin flow (product + order management)

### Prompts used

- Log in with admin credentials.
- Navigate to Admin dashboard.
- Add a product in Product Management.
- Go back to storefront, add the new product to cart, checkout, and place order.
- Verify the order appears in My Orders with the new product.
- After each major step, snapshot the page and continue only if it looks correct.
- If something fails, stop and say exactly what failed.
- After a successful run, generate a Playwright spec and run npx playwright test.

### What failed the first time

1. CORS block
- Requests to http://localhost:5000/api/products were blocked because the frontend was running on http://127.0.0.1:5173.

2. Admin login did not persist
- After submitting admin credentials, auth state wasn’t saved, so the Admin link/dashboard never appeared.

### What was corrected

1. CORS allowlist
- Allowed http://127.0.0.1:5173 in the backend CORS policy (or run the frontend on http://localhost:5173 to match the existing allowlist).

2. Admin login flow
- Restart backend on localhost, clear localStorage key buckeyeMarketplace.auth, then log in again so the admin session persists and the Admin link appears.

3. Product list API base URL
- Updated [frontend/src/components/ProductList.tsx](../frontend/src/components/ProductList.tsx) to use the shared API client (no hardcoded localhost URL), so Playwright can point to the correct backend.

4. Playwright server configuration
- Updated [frontend/playwright.config.ts](../frontend/playwright.config.ts) to start backend on port 5001 and set VITE_API_BASE_URL accordingly.

### Result

- MCP-driven admin flow: **Success** (all steps completed with page snapshots).
- Playwright spec: [frontend/e2e/admin-flow.spec.ts](../frontend/e2e/admin-flow.spec.ts)
- Playwright run: **Passed**

---

## Cross-browser testing (Chromium, Firefox, WebKit)

### Prompts used

- Run all browsers with: npx playwright test
- Or a single browser with: npx playwright test --project=chromium|firefox|webkit

### What failed the first time

- None

### What was corrected

- Added Playwright projects for Chromium, Firefox, and WebKit (Safari) in:
  - [frontend/playwright.config.ts](../frontend/playwright.config.ts)

### Result

- Chromium: **Passed**
- Firefox: **Passed**
- WebKit (Safari): **Passed**

---

## Mobile responsiveness (Playwright device profiles)

### Prompts used

- Run mobile device projects with:
  - npx playwright test --project=mobile-chrome --project=mobile-safari

### What failed the first time

- Mobile checkout/order placement intermittently failed due to cart sync timing and shared admin test state when projects ran in parallel.

### What was corrected

- Frontend: improved cart/checkout layout for small screens so buttons don’t overlap.
  - File: [frontend/src/components/CartPage/CartPage.module.css](../frontend/src/components/CartPage/CartPage.module.css)
- Frontend E2E: stabilized mobile admin flow by waiting for token persistence + backend cart sync before checkout.
  - File: [frontend/e2e/admin-flow.spec.ts](../frontend/e2e/admin-flow.spec.ts)
- Backend: seeded per-project admin users so parallel browser/device runs don’t race on the same admin cart.
  - File: [backend/HelloWorldApi/Program.cs](../backend/HelloWorldApi/Program.cs)

### Result

- Mobile Chrome (Pixel 5): **Passed**
- Mobile Safari (iPhone 13): **Passed**