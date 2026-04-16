# Submission

## Test Credentials

These accounts are seeded automatically when the backend runs in **Development** (or **Testing**) mode.

- **Regular user**
  - Email: user@buckeye.local
  - Password: User1234

- **Admin user**
  - Email: admin@buckeye.local
  - Password: Admin1234

## Security Practices Applied

1) **Secrets not committed (JWT signing key via user secrets)**
   - The JWT signing key is intentionally not stored in config files checked into git; the API requires `Jwt:Key` to be supplied via user secrets/environment config.

2) **Role-based authorization on protected endpoints**
   - Admin functionality is protected with `[Authorize(Roles = "Admin")]`, and user features (cart/orders) require authenticated users with `User`/`Admin` roles.

3) **Refresh token storage + rotation (revocation on use)**
   - Refresh tokens are stored server-side with expiry; the refresh endpoint revokes the used token and issues a new token, reducing replay risk.

4) **Input validation for auth requests**
   - FluentValidation enforces constraints (email format, password strength, non-empty refresh token) to reduce malformed input and improve API safety.

5) **HTTP hardening (HTTPS + secure headers)**
   - HTTPS redirection is enabled, HSTS is used outside Development, and the API adds basic security headers (e.g., `X-Content-Type-Options`, `X-Frame-Options`).

## AI Usage

See [AI-USAGE.md](AI-USAGE.md).
