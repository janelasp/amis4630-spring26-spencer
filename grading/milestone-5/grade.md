# Lab Evaluation Report

**Student Repository**: `janelasp-amis4630-spring26-spencer`  
**Date**: May 6, 2026  
**Rubric**: rubric.md (Milestone 5 — Authentication, Orders, Admin, Testing & Security)

## 0. Build & Run Status

| Component           | Build | Runs | Notes                                                    |
| ------------------- | ----- | ---- | -------------------------------------------------------- |
| Backend (.NET)      | ✅    | ✅   | `dotnet build` succeeded (0 warnings). `dotnet run` on http://localhost:5000, seeded 8 products, all EF entities saved. |
| Frontend (React/TS) | ✅    | ✅   | `npm run build` succeeded (tsc + vite, 165ms). Vite dev server ready on http://localhost:5173. |
| API Endpoints       | —     | ✅   | GET /api/products → 200 (8 products); GET /api/cart (no auth) → 401; POST /api/auth/login → 200; GET /api/cart (auth) → 200; GET /api/orders (auth) → 200 |



## 1. Project Structure

| Expected | Found | Status |
| -------- | ----- | ------ |
| backend/HelloWorldApi/Controllers/ | backend/HelloWorldApi/Controllers/ (AuthController.cs, CartController.cs, OrdersController.cs, AdminController.cs, ProductsController.cs) | ✅ |
| backend/HelloWorldApi/Models/ | backend/HelloWorldApi/Models/ (ApplicationUser.cs, Order.cs, OrderItem.cs, RefreshToken.cs, etc.) | ✅ |
| backend/HelloWorldApi/Dtos/ | backend/HelloWorldApi/Dtos/ (AuthResponse.cs, LoginRequest.cs, RegisterRequest.cs, etc.) | ✅ |
| backend/HelloWorldApi/Services/ | backend/HelloWorldApi/Services/TokenService.cs | ✅ |
| backend/HelloWorldApi/Validators/ | backend/HelloWorldApi/Validators/ (9 validators) | ✅ |
| frontend/src/components/ | frontend/src/components/ (LoginPage, RegisterPage, CheckoutPage, OrdersPage, AdminDashboard, etc.) | ✅ |
| frontend/src/contexts/ | frontend/src/contexts/ (AuthContext.tsx, CartContext.tsx) | ✅ |
| frontend/src/services/ | frontend/src/services/ (authService.ts, tokenStorage.ts, apiClient.ts, orderService.ts, etc.) | ✅ |
| tests/HelloWorldApi.UnitTests/ | tests/HelloWorldApi.UnitTests/ (TokenServiceTests.cs, OrderItemTests.cs, UnitTest1.cs) | ✅ |
| tests/HelloWorldApi.IntegrationTests/ | tests/HelloWorldApi.IntegrationTests/ (UnitTest1.cs, TestWebApplicationFactory.cs) | ✅ |
| frontend/e2e/ | frontend/e2e/ (checkout-order-history.spec.ts, admin-flow.spec.ts) | ✅ |
| SUBMISSION.md | SUBMISSION.md | ✅ |
| AI-USAGE.md | AI-USAGE.md | ✅ |

## 2. Rubric Scorecard

| # | Requirement | Points | Status | Evidence |
| --- | --- | --- | --- | --- |
| 1a | Registration and login endpoints | 2 | ✅ Met | [AuthController.cs](backend/HelloWorldApi/Controllers/AuthController.cs#L38-L91) — POST `/api/auth/register` (L38) and POST `/api/auth/login` (L72) both present, return `AuthResponse` with accessToken/refreshToken/expiresAtUtc. Orchestrator verified 200 responses. |
| 1b | JWT token generation | 1 | ✅ Met | [TokenService.cs](backend/HelloWorldApi/Services/TokenService.cs#L28-L76) — Creates JWT with claims (sub, nameid, email, role), HS256 signing, configurable expiration. |
| 1c | Password hashing | 1 | ✅ Met | [Program.cs](backend/HelloWorldApi/Program.cs#L55-L65) — Uses ASP.NET Identity (`UserManager<ApplicationUser>`) which handles bcrypt-based password hashing. [AuthController.cs](backend/HelloWorldApi/Controllers/AuthController.cs#L22) uses `UserManager` and `SignInManager`. |
| 1d | Role-based authorization | 1 | ✅ Met | [Program.cs](backend/HelloWorldApi/Program.cs#L157-L170) — "Admin" and "User" roles seeded. Users assigned roles on registration ([AuthController.cs](backend/HelloWorldApi/Controllers/AuthController.cs#L60-L67)). |
| 2a | JWT middleware configured | 1 | ✅ Met | [Program.cs](backend/HelloWorldApi/Program.cs#L71-L104) — JWT Bearer authentication configured with strict validation: ValidateIssuer, ValidateAudience, ValidateLifetime, ClockSkew 1 min, ValidAlgorithms restricted to HS256. |
| 2b | [Authorize] on protected endpoints | 1 | ✅ Met | [CartController.cs](backend/HelloWorldApi/Controllers/CartController.cs#L12) `[Authorize(Roles = "User,Admin")]`, [OrdersController.cs](backend/HelloWorldApi/Controllers/OrdersController.cs#L13) `[Authorize(Roles = "User,Admin")]`, [ProductsController.cs](backend/HelloWorldApi/Controllers/ProductsController.cs#L47) POST/PUT/DELETE `[Authorize(Roles = "Admin")]`. Orchestrator confirmed GET /api/cart without auth → 401. |
| 2c | Admin role enforcement + proper error codes | 1 | ✅ Met | [AdminController.cs](backend/HelloWorldApi/Controllers/AdminController.cs#L12) `[Authorize(Roles = "Admin")]` class-level. [OrdersController.cs](backend/HelloWorldApi/Controllers/OrdersController.cs#L85-L86) GetAllOrders and UpdateOrderStatus restricted to Admin. Integration test confirms 403 for non-admin user accessing admin endpoints. |
| 3a | Login/registration pages | 2 | ✅ Met | [LoginPage.tsx](frontend/src/components/LoginPage/LoginPage.tsx) — Email/password form with error handling, loading state, navigation. [RegisterPage.tsx](frontend/src/components/RegisterPage/RegisterPage.tsx) — Email/password/confirm password form with validation. |
| 3b | Token storage and auth context | 1 | ✅ Met | [AuthContext.tsx](frontend/src/contexts/AuthContext.tsx) — useReducer-based state, exposes isAuthenticated/roles/isAdmin/login/register/logout. [tokenStorage.ts](frontend/src/services/tokenStorage.ts) — localStorage with typed guard. [jwt.ts](frontend/src/services/jwt.ts) — JWT payload decoding and role extraction. |
| 3c | Protected routes + auto token inclusion | 1 | ✅ Met | [RequireAuth.tsx](frontend/src/components/RequireAuth/RequireAuth.tsx) — Redirects to /login if unauthenticated. [RequireRole.tsx](frontend/src/components/RequireRole/RequireRole.tsx) — Redirects if role missing. [App.tsx](frontend/src/App.tsx#L139-L168) — /checkout, /orders, /order-confirmation wrapped in RequireAuth; /admin in RequireRole. [apiClient.ts](frontend/src/services/apiClient.ts#L1-L60) — Auto-attaches Bearer token. |
| 4a | POST /api/orders creates order from cart | 2 | ✅ Met | [OrdersController.cs](backend/HelloWorldApi/Controllers/OrdersController.cs#L114-L175) — Creates order from cart items with confirmation number, total calculation, validates shippingAddress and non-empty cart. |
| 4b | Checkout page with shipping form | 1 | ✅ Met | [CheckoutForm.tsx](frontend/src/components/CheckoutForm/CheckoutForm.tsx) — Shipping address, city, state, zip code fields with validation ([checkoutValidation.ts](frontend/src/components/CheckoutForm/checkoutValidation.ts)). [CheckoutPage.tsx](frontend/src/components/CheckoutPage/CheckoutPage.tsx) wraps the form. |
| 4c | Order confirmation + cart cleared | 1 | ✅ Met | [OrdersController.cs](backend/HelloWorldApi/Controllers/OrdersController.cs#L159-L167) — Cart items removed after order saved. [CheckoutForm.tsx](frontend/src/components/CheckoutForm/CheckoutForm.tsx#L101-L106) — Dispatches empty cart, navigates to `/order-confirmation/:orderId`. [OrderConfirmationPage.tsx](frontend/src/components/OrderConfirmationPage/OrderConfirmationPage.tsx) — Displays confirmation number, status, items. |
| 4d | Order history page | 1 | ✅ Met | [OrdersPage.tsx](frontend/src/components/OrdersPage/OrdersPage.tsx) — Fetches user's orders via `getMyOrders()`, displays confirmation number, total, date, status, item list. |
| 5a | Admin dashboard with role restriction | 1 | ✅ Met | [AdminDashboard.tsx](frontend/src/components/AdminDashboard/AdminDashboard.tsx) — Full admin panel. [App.tsx](frontend/src/App.tsx#L158-L162) — Route wrapped in `<RequireRole role="Admin">`. Backend `[Authorize(Roles = "Admin")]` on AdminController. |
| 5b | Product management CRUD | 2 | ✅ Met | [AdminDashboard.tsx](frontend/src/components/AdminDashboard/AdminDashboard.tsx#L107-L135) — Create, edit, delete product UI. [ProductsController.cs](backend/HelloWorldApi/Controllers/ProductsController.cs#L44-L105) — POST, PUT, DELETE endpoints with Admin authorization. [productService.ts](frontend/src/services/productService.ts) — createProduct, updateProduct, deleteProduct functions. |
| 5c | Order status management | 1 | ✅ Met | [AdminDashboard.tsx](frontend/src/components/AdminDashboard/AdminDashboard.tsx#L150-L164) — Displays orders, status dropdown, update handler. [OrdersController.cs](backend/HelloWorldApi/Controllers/OrdersController.cs#L97-L113) — PUT `/api/orders/{orderId}/status` with Admin role. [orderService.ts](frontend/src/services/orderService.ts#L28-L34) — updateOrderStatus function. |
| 6a | Automated tests pass (3+ backend unit, 1+ integration, 3+ frontend, 1 E2E) | 1 | ✅ Met | **Backend unit (5+):** [TokenServiceTests.cs](tests/HelloWorldApi.UnitTests/TokenServiceTests.cs) (2 tests), [OrderItemTests.cs](tests/HelloWorldApi.UnitTests/OrderItemTests.cs) (1 test), [UnitTest1.cs](tests/HelloWorldApi.UnitTests/UnitTest1.cs) (3+ RegisterRequestValidator tests). **Integration (1):** [UnitTest1.cs](tests/HelloWorldApi.IntegrationTests/UnitTest1.cs) (AdminAuthorizationTests — 1 test). **Frontend (7+):** [LoginPage.test.tsx](frontend/src/components/LoginPage/LoginPage.test.tsx) (1), [authReducer.test.ts](frontend/src/reducers/authReducer.test.ts) (3), [checkoutValidation.test.ts](frontend/src/components/CheckoutForm/checkoutValidation.test.ts) (3). **E2E (2):** [checkout-order-history.spec.ts](frontend/e2e/checkout-order-history.spec.ts), [admin-flow.spec.ts](frontend/e2e/admin-flow.spec.ts). |
| 6b | Security practices (3+ applied) | 1 | ✅ Met | [SUBMISSION.md](SUBMISSION.md) documents 5 practices: (1) JWT key via user secrets — confirmed not in [appsettings.json](backend/HelloWorldApi/appsettings.json), (2) Role-based authorization on endpoints, (3) Refresh token rotation/revocation, (4) FluentValidation input validation (9 validators), (5) HTTPS + security headers. |
| 7a | Clean organization and patterns | 1 | ✅ Met | Well-organized folder structure following conventions. Controllers/Models/DTOs/Services/Validators on backend. Component folders with CSS Modules on frontend. TypeScript strict types throughout. |
| 7b | AI usage documented | 1 | ✅ Met | [AI-USAGE.md](AI-USAGE.md) — Comprehensive documentation across all milestones, includes reflections on pros/cons and lessons learned. |

**Total: 25 / 25**

## 3. Detailed Findings

All rubric items are met. No deficiencies to report.

## 4. Action Plan

No corrective actions required — full marks earned.

## 5. Code Quality Coaching (Non-Scoring)

- **Test file naming**: [UnitTest1.cs](tests/HelloWorldApi.UnitTests/UnitTest1.cs) and [UnitTest1.cs](tests/HelloWorldApi.IntegrationTests/UnitTest1.cs) use template names. Renaming to `RegisterRequestValidatorTests.cs` and `AdminAuthorizationTests.cs` respectively would improve discoverability and follow the class-name-matches-file-name convention.

- **Order status as string**: [OrdersController.cs](backend/HelloWorldApi/Controllers/OrdersController.cs#L109) accepts `request.Status.Trim()` as a free-form string. Consider using an enum or a well-known set of valid statuses to prevent invalid values from being persisted. The frontend already defines a valid set (`ORDER_STATUSES`), but the backend doesn't enforce it.

- **Token storage in localStorage**: [tokenStorage.ts](frontend/src/services/tokenStorage.ts) stores JWTs in `localStorage`, which is accessible to any JS running on the page. This is a common trade-off (documented in the security checklist as acceptable vs. cookies), but worth noting that for high-security apps, `httpOnly` cookies with anti-CSRF tokens provide stronger XSS protection.

- **Seed password hardcoding**: [Program.cs](backend/HelloWorldApi/Program.cs#L201-L205) falls back to `"Admin1234"` / `"User1234"` when config values are absent. These are dev-only seeds guarded by environment checks, which is fine, but documenting this guard clearly prevents accidental use in production.

## 6. Git Practices Coaching (Non-Scoring)

- **Incremental development**: The project structure and variety of components suggest work was done over multiple iterations, which is good practice. Continue making focused commits per feature area (auth, orders, admin, tests) with descriptive messages.

- **Test file naming in commits**: When renaming template files like `UnitTest1.cs`, do so in a dedicated commit to keep the git history clean and make test evolution easy to trace.

---

**25/25** — All rubric requirements fully met with solid implementations across authentication, protected endpoints, frontend auth flow, order management, admin features, testing, and security. The coaching notes above (test file naming, order status validation, token storage trade-offs, seed password documentation) are suggestions for professional growth, not scoring deductions.
