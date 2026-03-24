# Lab Evaluation Report

**Student Repository**: `janelasp/amis4630-spring26-spencer`  
**Date**: March 24, 2026  
**Rubric**: rubric.md

## 1. Build & Run Status

| Component           | Build | Runs | Notes                                                                         |
| ------------------- | ----- | ---- | ----------------------------------------------------------------------------- |
| Backend (.NET)      | ❌    | ❌   | `dotnet build` failed with 1 error — type mismatch in `ProductsController.cs` |
| Frontend (React/TS) | ✅    | ✅   | `tsc -b && vite build` succeeded. Dev server starts on port 5173.             |
| API Endpoints       | —     | ❌   | Cannot test — backend does not compile                                        |

### Backend Build Error

```
backend/HelloWorldApi/Controllers/ProductsController.cs(100,20): error CS0266:
Cannot implicitly convert type 'Microsoft.AspNetCore.Mvc.OkObjectResult' to
'System.Collections.Generic.IEnumerable<HelloWorldApi.Models.Product>'.
An explicit conversion exists (are you missing a cast?)
```

The `GetAllProducts()` method (line 98) has return type `IEnumerable<Product>` but calls `return Ok(_products);` which returns an `OkObjectResult`. The fix is to change the return type to `IActionResult` (like the `GetProduct` method below it) or to return `_products` directly.

### Project Structure Comparison

| Expected    | Found       | Status |
| ----------- | ----------- | ------ |
| `/backend`  | `/backend`  | ✅     |
| `/frontend` | `/frontend` | ✅     |
| `/docs`     | `/docs`     | ✅     |

## 2. Rubric Scorecard

| #   | Requirement                          | Points | Status          | Evidence                                                                                                                                                                                                                                                          |
| --- | ------------------------------------ | ------ | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | React Product List Page              | 5      | ✅ Met          | `ProductList.tsx` — fetches data, renders via `ProductCard` components; loading state (L24) and empty state (L25) handled; component hierarchy: App → ProductList → ProductCard                                                                                   |
| 2   | React Product Detail Page            | 4      | ⚠️ Good         | `ProductDetail.tsx` — separate component showing all fields; navigation list↔detail works via state in `App.tsx` (L8–L28); however uses state-based view switching, not a separate route (no React Router)                                                        |
| 3   | API Endpoint: GET /api/products      | 2      | ❌ Not Met      | `ProductsController.cs` L98–101 — endpoint exists with correct route `[HttpGet]`, in-memory data store used, but **does not compile** due to return type mismatch (`IEnumerable<Product>` vs `Ok()`)                                                              |
| 4   | API Endpoint: GET /api/products/{id} | 4      | ⚠️ Good         | `ProductsController.cs` L104–112 — endpoint exists with correct route, returns 404 for unknown ID (L109), correct JSON shape; **but cannot be runtime-verified** because the project does not compile                                                             |
| 5   | Frontend-to-API Integration          | 3      | ⚠️ Satisfactory | `ProductList.tsx` L14 and `ProductDetail.tsx` L16 — both fetch from `http://localhost:5000/api/products`; no hardcoded data; however `ProductList.tsx` has no `.catch()` error handler and integration cannot be verified at runtime due to backend build failure |

**Total: 18 / 25**

## 3. Detailed Findings

### Item #2: React Product Detail Page (4/5)

**What was expected**: Separate route/component; all required fields; navigation works both ways (list ↔ detail)  
**What was found**: `ProductDetail.tsx` is a separate component that displays all required fields (title, category, price, seller, postedDate, description, image). Navigation works via state toggling in `App.tsx` (lines 8–28) — `view` state switches between `'list'` and `'detail'`. A "Back to List" button is provided.  
**Gap**: The rubric's "Excellent" tier specifies a "separate route/component." While it is a separate component, there is no client-side routing (e.g., React Router with distinct URL paths like `/products/:id`). This is state-based view switching, not routing. Scored at "Good" tier (80–89% = 4 pts).

### Item #3: API Endpoint: GET /api/products (2/5)

**What was expected**: Returns correct JSON array; proper HTTP status codes; in-memory data store used  
**What was found**: `ProductsController.cs` lines 98–101 define a `GetAllProducts()` method with the `[HttpGet]` attribute and an in-memory `List<Product>` data store (lines 10–93). However, the method signature is `IEnumerable<Product>` while the body calls `return Ok(_products);`, which returns `OkObjectResult`. This causes compiler error CS0266.  
**Gap**: The endpoint does not compile and therefore cannot return any data. The logic and intent are correct, but a type mismatch prevents the application from building. This is a critical defect — scored at "Needs Work" tier since the endpoint errors on build.

### Item #4: API Endpoint: GET /api/products/{id} (4/5)

**What was expected**: Returns single product by ID; 404 for unknown ID; correct JSON shape  
**What was found**: `ProductsController.cs` lines 104–112 implement `GetProduct(int id)` with correct return type `IActionResult`, proper 404 handling via `NotFound()`, and correct JSON shape via `Ok(product)`. The code logic is correct.  
**Gap**: Cannot be runtime-verified because the project fails to build due to the error in the sibling `GetAllProducts()` method. The code itself is correct, so scored at "Good" tier (4 pts) — docked 1 point because it was not possible to confirm runtime behavior.

### Item #5: Frontend-to-API Integration (3/5)

**What was expected**: React fetches live data from .NET API; no hardcoded data in components; error state handled  
**What was found**: Both `ProductList.tsx` (line 14) and `ProductDetail.tsx` (line 16) use `fetch()` to call `http://localhost:5000/api/products`. No hardcoded product data exists in any frontend component. `ProductDetail.tsx` has a `.catch()` error handler (lines 22–25). However, `ProductList.tsx` has no `.catch()` on its fetch call (lines 14–21).  
**Gap**: Missing error handling in `ProductList.tsx`, and the full integration cannot be verified at runtime because the backend does not compile. Scored at "Satisfactory" tier (70–79% = 3 pts).

## 4. Action Plan

1. **[5pts] GET /api/products endpoint — fix return type**: In `ProductsController.cs` line 98, change `public IEnumerable<Product> GetAllProducts()` to `public IActionResult GetAllProducts()`. This single change will fix the build error and make the endpoint functional.

2. **[5pts] Frontend-to-API Integration — add error handling**: In `ProductList.tsx`, add a `.catch()` handler to the fetch chain (after line 20) to handle network/API errors gracefully, similar to the pattern already used in `ProductDetail.tsx`.

3. **[5pts] React Product Detail Page — add client-side routing**: Consider adding `react-router-dom` to enable URL-based routing (e.g., `/products/:id`) instead of state-based view switching. This would give the detail page its own URL, enable browser back/forward navigation, and meet the "separate route" criterion at the Excellent tier.

## 5. Code Quality Coaching (Non-Scoring)

- **Inconsistent naming convention**: `Product.cs` — properties `sellerName` and `postedDate` use camelCase while all other properties use PascalCase. C# convention is PascalCase for public properties (`SellerName`, `PostedDate`). The frontend `product.ts` type mirrors these as camelCase, which is correct for TypeScript, but the backend should follow C# conventions and use `[JsonPropertyName]` attributes if needed to control serialization.

- **Missing error handling in fetch**: `ProductList.tsx` — the `fetch` call (lines 14–20) has no `.catch()` block. If the API is unreachable, the component will stay in the loading state forever. Add a `.catch()` to set an error state and display a user-friendly message.

- **No HTTPS in production**: `Program.cs` line 40 — `app.UseHttpsRedirection()` is present, but the frontend hardcodes `http://localhost:5000`. For production, consider using environment-based API URL configuration (e.g., via Vite's `import.meta.env`).

- **No input validation on ID parameter**: `ProductsController.cs` — the `GetProduct(int id)` endpoint doesn't validate that `id` is positive. While ASP.NET model binding prevents non-integer values, a route constraint like `[HttpGet("{id:int:min(1)}")]` would be more defensive.

## 6. Git Practices Coaching (Non-Scoring)

- **Very few commits**: The entire Milestone 3 implementation (frontend + backend + docs) was delivered in a single commit (`a9ce467`). Professional practice is to commit incrementally — e.g., one commit for the API controller, one for the Product model, one each for React components, etc. This makes code review easier and provides a safety net for rollbacks.

- **Commit messages lack specificity**: The main commit message ("Developed frontend and backend for product catalog as well updated README with AI usage.") covers too much scope. Prefer focused messages like "Add Product model and ProductsController with GET endpoints" or "Add ProductList and ProductDetail components with API integration."

---

**18/25** — The frontend is well-structured with proper component hierarchy, loading/empty states, and API integration, but the backend has a compile error in `ProductsController.GetAllProducts()` that prevents the application from running end-to-end. The coaching notes above (naming conventions, error handling, routing, git practices) are suggestions for professional growth, not scoring deductions.
