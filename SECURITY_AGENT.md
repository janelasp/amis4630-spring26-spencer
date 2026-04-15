# Security Agent — JWT + CORS Review

Use this checklist to review the backend JWT/CORS setup and fix common issues **without breaking the frontend login flow**.

Project dev origins:
- Frontend: `http://localhost:5173`
- Backend: `https://localhost:5001` (API base: `/api/`)

Where to look:
- `backend/Program.cs`
- `backend/appsettings.json`, `backend/appsettings.Development.json`

---

## JWT auth review (what to verify)

**Pipeline order (most common break):**
- `UseRouting()` → `UseCors(...)` → `UseAuthentication()` → `UseAuthorization()` → `MapControllers()`

**Validation should be strict:**
- `ValidateIssuer = true` with `ValidIssuer`/`ValidIssuers`
- `ValidateAudience = true` with `ValidAudience`/`ValidAudiences`
- `ValidateLifetime = true` (set `ClockSkew` small: ~1–2 min)
- `ValidateIssuerSigningKey = true`

**Key handling:**
- No hard-coded secrets; do not commit keys
- For HS256, prefer a 32+ byte secret (>= 256 bits)

**Claims compatibility (don’t break app logic):**
- Keep claim types stable (commonly `sub`/`nameid` for user id, `role` for roles)
- If you change claim types, also set `NameClaimType` / `RoleClaimType` and update any downstream code

**Algorithm safety (optional hardening):**
- Restrict accepted algorithms via `TokenValidationParameters.ValidAlgorithms`

---

## CORS review (what to verify)

**Policy is applied:**
- `AddCors(...)` exists AND `UseCors("...")` runs (or controller attributes like `[EnableCors]`)

**Dev origins:**
- Allow `http://localhost:5173` (and add `http://127.0.0.1:5173` only if you actually use it)

**Auth headers + preflight:**
- Allow `Authorization` header (or `AllowAnyHeader()` in dev)
- Ensure preflight `OPTIONS` succeeds (not `401`)

**Credentials rule:**
- If using cookies / `credentials: "include"`: do **not** use `AllowAnyOrigin()`; use `WithOrigins(...)` + `AllowCredentials()`

---

## Fixing issues safely (don’t break login)

1. Change one thing at a time (issuer/audience/lifetime/key/CORS).
2. Preserve the login response contract (token shape, field names, cookie name, etc.).
3. Avoid “temporary” insecure settings (don’t disable issuer/audience/lifetime validation).
4. If you must migrate values (issuer/audience/key): allow old+new briefly via `ValidIssuers`/`ValidAudiences`, then remove the old.

---

## Verify (fast checks)

**Browser:**
- DevTools → Network: request has `Origin: http://localhost:5173`
- Protected request includes `Authorization: Bearer <token>` (if using bearer)

**Preflight (CORS):**
```bash
curl -i -X OPTIONS "https://localhost:5001/api/products" \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization, Content-Type"
```
Expect `200/204` and `Access-Control-Allow-Origin: http://localhost:5173`.

**Protected call (JWT):**
```bash
curl -i "https://localhost:5001/api/cart" \
  -H "Origin: http://localhost:5173" \
  -H "Authorization: Bearer <PASTE_TOKEN_HERE>"
```
Expect `200` with a valid token, `401` without.