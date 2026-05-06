# Lab Evaluation Report

**Student Repository**: `janelasp-amis4630-spring26-spencer`  
**Date**: 2026-05-06  
**Rubric**: rubric.md (Milestone 4 — Shopping Cart)

## 0. Build & Run Status

| Component           | Build | Runs | Notes                                                    |
| ------------------- | ----- | ---- | -------------------------------------------------------- |
| Backend (.NET)      | ✅    | ✅   | `dotnet build` succeeded (0 warnings). `dotnet run` on http://localhost:5000, seeded 8 products, all EF entities saved. |
| Frontend (React/TS) | ✅    | ✅   | `npm run build` succeeded (tsc + vite, 165ms). Vite dev server ready on http://localhost:5173. |
| API Endpoints       | —     | ✅   | GET /api/products → 200 (8 products); GET /api/cart (no auth) → 401; POST /api/auth/login → 200; GET /api/cart (auth) → 200; GET /api/orders (auth) → 200 |



## 1. Project Structure

| Expected | Found | Status |
| -------- | ----- | ------ |
| backend/HelloWorldApi/Controllers/CartController.cs | backend/HelloWorldApi/Controllers/CartController.cs | ✅ |
| backend/HelloWorldApi/Models/Cart.cs | backend/HelloWorldApi/Models/Cart.cs | ✅ |
| backend/HelloWorldApi/Models/CartItem.cs | backend/HelloWorldApi/Models/CartItem.cs | ✅ |
| backend/HelloWorldApi/Dtos/CartResponse.cs | backend/HelloWorldApi/Dtos/CartResponse.cs | ✅ |
| backend/HelloWorldApi/Dtos/CartItemResponse.cs | backend/HelloWorldApi/Dtos/CartItemResponse.cs | ✅ |
| backend/HelloWorldApi/Dtos/AddToCartRequest.cs | backend/HelloWorldApi/Dtos/AddToCartRequest.cs | ✅ |
| backend/HelloWorldApi/Dtos/UpdateCartItemRequest.cs | backend/HelloWorldApi/Dtos/UpdateCartItemRequest.cs | ✅ |
| frontend/src/contexts/CartContext.tsx | frontend/src/contexts/CartContext.tsx | ✅ |
| frontend/src/reducers/cartReducer.ts | frontend/src/reducers/cartReducer.ts | ✅ |
| frontend/src/services/cartService.ts | frontend/src/services/cartService.ts | ✅ |
| frontend/src/types/cart.ts | frontend/src/types/cart.ts | ✅ |
| frontend/src/components/CartBadge/ | frontend/src/components/CartBadge/ | ✅ |
| frontend/src/components/CartPage/ | frontend/src/components/CartPage/ | ✅ |
| frontend/src/components/AddToCartButton/ | frontend/src/components/AddToCartButton/ | ✅ |
| AI-USAGE.md | AI-USAGE.md | ✅ |

## 2. Rubric Scorecard

| # | Requirement | Points | Status | Evidence |
| --- | --- | --- | --- | --- |
| 1a | useReducer or Context API for cart state | 2 | ✅ Met | [CartContext.tsx](frontend/src/contexts/CartContext.tsx#L10) — `useReducer(cartReducer, initialCartState)` at L43; Context created at L30, Provider wraps app in [App.tsx](frontend/src/App.tsx#L119) |
| 1b | Add, update quantity, remove operations | 2 | ✅ Met | [cartReducer.ts](frontend/src/reducers/cartReducer.ts#L11-L87) — handles `ADD_TO_CART` (L11), `REMOVE_FROM_CART` (L40), `UPDATE_QUANTITY` (L49), `CLEAR_CART` (L68); [CartPage.tsx](frontend/src/components/CartPage/CartPage.tsx#L15-L52) — UI controls for all operations |
| 1c | Cart count in header + calculated totals | 1 | ✅ Met | [CartBadge.tsx](frontend/src/components/CartBadge/CartBadge.tsx#L5) — displays `cartItemCount` in header; [CartContext.tsx](frontend/src/contexts/CartContext.tsx#L60-L65) — computes `cartItemCount` and `cartTotal` via reduce |
| 2a | GET /api/cart | 1 | ✅ Met | [CartController.cs](backend/HelloWorldApi/Controllers/CartController.cs#L23-L55) — `[HttpGet]` GetCart() returns `CartResponse` with items, totals |
| 2b | POST /api/cart (add item) | 1 | ✅ Met | [CartController.cs](backend/HelloWorldApi/Controllers/CartController.cs#L58-L110) — `[HttpPost]` AddToCart(), handles new item and existing item quantity increment |
| 2c | PUT /api/cart/{cartItemId} (update qty) | 1 | ✅ Met | [CartController.cs](backend/HelloWorldApi/Controllers/CartController.cs#L113-L142) — `[HttpPut("{cartItemId}")]` UpdateCartItem() with ownership check |
| 2d | DELETE endpoints (item + clear) | 1 | ✅ Met | [CartController.cs](backend/HelloWorldApi/Controllers/CartController.cs#L145-L211) — `[HttpDelete("{cartItemId}")]` DeleteCartItem() at L145 and `[HttpDelete("clear")]` ClearCart() at L174 |
| 2e | Proper status codes and responses | 1 | ✅ Met | [CartController.cs](backend/HelloWorldApi/Controllers/CartController.cs) — uses Ok(), CreatedAtAction(), NoContent(), NotFound(), Unauthorized(), Forbid() appropriately |
| 3a | Cart/CartItem EF entities | 2 | ✅ Met | [Cart.cs](backend/HelloWorldApi/Models/Cart.cs) — Id, UserId, CreatedAt, UpdatedAt, Items collection; [CartItem.cs](backend/HelloWorldApi/Models/CartItem.cs) — Id, CartId, ProductId, Quantity with `[ForeignKey]` annotations |
| 3b | Relationships and navigation properties | 1 | ✅ Met | [AppDbContext.cs](backend/HelloWorldApi/Models/AppDbContext.cs#L51-L60) — configures Cart→CartItem one-to-many with cascade delete, CartItem→Product with restrict delete; navigation properties on both models |
| 3c | Migrations applied, data persists | 1 | ✅ Met | 4 migrations present in Migrations/ directory; orchestrator confirmed backend runs, seeds 8 products, and EF entities saved |
| 4a | Real API replaces mock/localStorage | 2 | ✅ Met | [cartService.ts](frontend/src/services/cartService.ts) — all functions (getCart, addCartItem, updateCartItem, deleteCartItem, clearCart) call real API via apiClient; guest cart localStorage is a legitimate fallback for unauthenticated users |
| 4b | All cart operations call API | 2 | ✅ Met | [CartContext.tsx](frontend/src/contexts/CartContext.tsx#L150-L240) — `lastAction` effect syncs ADD_TO_CART, UPDATE_QUANTITY, REMOVE_FROM_CART, CLEAR_CART to API |
| 4c | State synchronization | 1 | ✅ Met | [CartContext.tsx](frontend/src/contexts/CartContext.tsx#L210-L215) — after each API operation, re-fetches cart from server via `getCart()` and dispatches `SET_CART_FROM_SERVER` |
| 5a | Loading states | 1 | ✅ Met | [CartContext.tsx](frontend/src/contexts/CartContext.tsx#L44) — `isLoading` state; [CartPage.tsx](frontend/src/components/CartPage/CartPage.tsx#L63-L69) — renders "Loading cart..." |
| 5b | Error messages and edge cases | 1 | ✅ Met | [CartContext.tsx](frontend/src/contexts/CartContext.tsx#L45) — `error` state set on failures; [CartPage.tsx](frontend/src/components/CartPage/CartPage.tsx#L77) — displays error; quantity bounds enforced (1–99) |
| 5c | Success feedback | 1 | ✅ Met | [AddToCartButton.tsx](frontend/src/components/AddToCartButton/AddToCartButton.tsx#L46-L49) — shows "Added!" text for 1.5s after add-to-cart |
| 6a | Clean component structure | 1 | ✅ Met | Components in dedicated folders with CSS Modules: CartBadge/, CartPage/, AddToCartButton/, CheckoutPage/, etc. |
| 6b | Service layer / custom hooks | 1 | ✅ Met | [cartService.ts](frontend/src/services/cartService.ts) — dedicated service layer; [CartContext.tsx](frontend/src/contexts/CartContext.tsx#L267) — `useCartContext()` custom hook |
| 6c | AI usage documented | 1 | ✅ Met | [AI-USAGE.md](AI-USAGE.md) — "Shopping Cart Development" section documents AI use for requirements checking, concept explanation, and debugging |

**Total: 25 / 25**

## 3. Detailed Findings

All rubric items are met. No deficiencies to report.

## 4. Action Plan

No corrective actions required — full marks earned.

## 5. Code Quality Coaching (Non-Scoring)

- **Optimistic-then-refetch pattern**: [CartContext.tsx](frontend/src/contexts/CartContext.tsx#L150-L240) dispatches the reducer action locally then syncs to the API and re-fetches the entire cart. This works but creates a brief flash where local state may differ from server state. Consider using only the server response to update state (pessimistic update) or committing to a true optimistic pattern with rollback.

- **Missing return type on reducer**: [cartReducer.ts](frontend/src/reducers/cartReducer.ts#L9) — the function ends after the switch block without a final return or exhaustive check. TypeScript should catch this at compile time, but adding a `never` assertion after the switch would make exhaustiveness explicit.

- **Inconsistent indentation**: [cartReducer.ts](frontend/src/reducers/cartReducer.ts#L87-L97) — the `SET_CART_VIEW` and `SET_CART_FROM_SERVER` cases use tab indentation while the rest of the file uses spaces. Consider running a formatter for consistency.

- **Cart ownership via string comparison**: [CartController.cs](backend/HelloWorldApi/Controllers/CartController.cs#L134) — the ownership check `cartItem.Cart.UserId != currentUserId` relies on string comparison of user IDs. This is correct for Identity's default GUID strings but should use `StringComparison.OrdinalIgnoreCase` for robustness.

## 6. Git Practices Coaching (Non-Scoring)

- **Migration history**: Four migrations are present spanning April 1 through May 2, indicating incremental schema evolution rather than a single dump — this is good practice.

- **AI-USAGE.md quality**: The student provides honest, reflective documentation of AI usage across milestones, including what they accepted, rejected, and learned. This is a professional-level practice for transparency.

---

**25/25** — All rubric items are fully met with well-structured cart state management, complete API endpoints, proper EF persistence, full frontend-backend integration, and solid UX handling. The coaching notes above (optimistic update pattern, reducer exhaustiveness, indentation consistency, string comparison) are suggestions for professional growth, not scoring deductions.
