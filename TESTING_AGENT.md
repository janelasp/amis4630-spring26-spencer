## Testing AI Agent Guide

You are a testing expert for this project. Before generating any tests, inspect the relevant source files (models, services, componenets) listed below.

Scope:

- Backend unit tests (C#/.NET, xUnit).
- Backend integration tests (C#/.NET, xUnit + WebApplicationFactory).
- Frontend tests (React + TypeScript, Vitest + Testing Library).
- End‑to‑end tests (Playwright).

For general coding conventions, see [AGENTS.md](../AGENTS.md), [backend/AGENTS.md](../backend/AGENTS.md), and [frontend/AGENTS.md](../frontend/AGENTS.md).

Project details:

- API project name: backend (see [backend/backend.csproj](../backend/backend.csproj)).
- Frontend project path: [frontend](../frontend).
- Backend test command (solution root): `dotnet test`.
- Frontend test command (from frontend): `npm test -- --run`.
- E2E test command (repo root or Playwright folder): `npx playwright test`.

---

## Where to Look Before Generating Tests

Backend:

- Models: [backend/Models](../backend/Models).
- DTOs: [backend/DTOs](../backend/DTOs).
- Validators: [backend/Validators](../backend/Validators).
- Controllers: [backend/Controllers](../backend/Controllers).
- DbContext / seeding: [backend/Data](../backend/Data).

Frontend:

- Components: [frontend/src/components](../frontend/src/components).
- Pages: [frontend/src/pages](../frontend/src/pages).
- Reducers: [frontend/src/reducers](../frontend/src/reducers).
- Contexts: [frontend/src/contexts](../frontend/src/contexts).
- API helpers: [frontend/src/api](../frontend/src/api).
- Shared types: [frontend/src/types](../frontend/src/types).

E2E (Playwright):

- Frontend flows: pages/components above.
- Backend routes/contracts: controllers and DTOs above.

---

## Minimal Rules by Test Type

Backend unit tests:

- Use xUnit projects under a top‑level tests folder (for example, tests/Backend.UnitTests).
- Focus on pure logic (validators, services/helpers if added); do not hit the real DbContext.
- Prefer clear Arrange–Act–Assert structure and descriptive test names.

---

Backend integration tests:

- Use a separate xUnit project (for example, tests/Backend.IntegrationTests) and WebApplicationFactory.
- Use an in‑memory or test‑only database configuration.
- Assert status codes and DTO‑shaped responses, including ProblemDetails for validation errors.

Frontend tests:

- Use Vitest + React Testing Library.
- Place tests alongside components/pages or under src/__tests__.
- Mock frontend/src/api modules; do not call the real backend.
- Test rendering, user interactions, and integration with contexts/reducers.

Playwright E2E tests:

- Assume frontend at http://localhost:5173 and backend running.
- Group scenarios by feature (for example, cart flows) and test full journeys.
- Prefer role/text‑based selectors; only add data-testid attributes when necessary.

---

## Assertions and Safety Rules

Preferred assertion style:

- Backend: use xUnit Assert methods (for example, Assert.Equal, Assert.True, Assert.ThrowsAsync).
- Frontend: use expect(...) with Testing Library DOM matchers (for example, toBeInTheDocument, toHaveTextContent).
- Playwright: use expect from @playwright/test for URLs, text, and element state.

Never weaken assertions just to make tests pass:

- Do not delete, skip, or broaden assertions (for example, changing a precise equality check to "is defined") just to avoid failures.
- When tests fail, prefer fixing the implementation or adjusting tests only when a behavioral change is intentional and clearly requested.

Keep tests small, focused, deterministic, and consistent with the backend and frontend AGENTS guidelines.
