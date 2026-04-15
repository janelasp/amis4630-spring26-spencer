# Changelog

## 2026-04-15

### Security

- Enforced strict JWT validation (issuer + audience required), restricted accepted algorithms to HS256, and pinned `NameClaimType`/`RoleClaimType` to keep claim mapping stable for downstream authorization + user scoping.
- Added production-safe security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) and enabled HSTS outside Development.
- Ensured middleware ordering supports CORS preflight before auth (`Routing` → `CORS` → `Authentication` → `Authorization`).
- Limited seeding of the default admin user and sample products to Development/Testing environments; admin seed password can be overridden via user-secrets (`Seed:AdminPassword`).

### Developer workflow

- Updated `.gitignore` to avoid committing generated Playwright artifacts and local SQLite database files.
