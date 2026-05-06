# Lab Evaluation Report

**Student Repository**: `janelasp-amis4630-spring26-spencer`  
**Date**: 2026-05-06  
**Rubric**: rubric.md (Milestone 6 — 25 points)

## 0. Build & Run Status

| Component           | Build | Runs | Notes                                                    |
| ------------------- | ----- | ---- | -------------------------------------------------------- |
| Backend (.NET)      | ✅    | ✅   | `dotnet build` succeeded (0 warnings). `dotnet run` on http://localhost:5000, seeded 8 products, all EF entities saved. |
| Frontend (React/TS) | ✅    | ✅   | `npm run build` succeeded (tsc + vite, 165ms). Vite dev server ready on http://localhost:5173. |
| API Endpoints       | —     | ✅   | GET /api/products → 200 (8 products); GET /api/cart (no auth) → 401; POST /api/auth/login → 200; GET /api/cart (auth) → 200; GET /api/orders (auth) → 200 |



## 1. Project Structure

| Component | Expected | Found | Status |
| --------- | -------- | ----- | ------ |
| Backend API | backend/HelloWorldApi/ | backend/HelloWorldApi/ | ✅ |
| Frontend App | frontend/src/ | frontend/src/ | ✅ |
| Unit Tests (Backend) | tests/HelloWorldApi.UnitTests/ | tests/HelloWorldApi.UnitTests/ | ✅ |
| Integration Tests (Backend) | tests/HelloWorldApi.IntegrationTests/ | tests/HelloWorldApi.IntegrationTests/ | ✅ |
| Frontend Component Tests | frontend/src/**/*.test.tsx | App.test.tsx, LoginPage.test.tsx | ✅ |
| E2E Tests | frontend/e2e/ | frontend/e2e/ (2 specs) | ✅ |
| Technical Docs | docs/ | docs/ (ADRs, diagrams, changelog, security checklist, component architecture) | ✅ |
| User Docs | docs/user-guide.md, docs/admin-guide.md | Present | ✅ |
| Screenshots | docs/screenshots/ | 13 screenshots + README | ✅ |
| AI Reflection | AI-USAGE.md | Present | ✅ |
| CI/CD Pipeline | .github/workflows/ or equivalent | missing | ❌ |
| Deployment Config | Dockerfile, IaC, or live URL | missing (only publish_linux build output) | ❌ |

## 2. Rubric Scorecard

| # | Requirement | Points | Status | Evidence |
| --- | --- | --- | --- | --- |
| 1 | **Production Deployment** | 5 | ❌ Not Met (0/5) | No Dockerfile, no IaC (Bicep/ARM), no live deployment URL. README L130-149 describes deployment as aspirational ("expected build outputs") but explicitly states "this repo does not include IaC." AI-USAGE.md confirms student was unable to deploy: "I wasn't able to deploy my application to Azure due to issues with Microsoft." A `publish_linux/` folder with build artifacts exists but no evidence of an actual running production deployment. |
| 2 | **CI/CD Pipeline** | 4 | ❌ Not Met (0/4) | No `.github/workflows/` directory. No GitHub Actions YAML, Azure Pipelines config, or any other CI/CD configuration file found anywhere in the repository. Build/test/deploy is entirely manual. |
| 3 | **Testing & QA** | 4 | ✅ Met (4/4) | Comprehensive multi-layer testing: **Backend unit tests** (3 test files — OrderItemTests, TokenServiceTests, RegisterRequestValidatorTests with 6 test methods); **Backend integration test** (AdminAuthorizationTests with TestWebApplicationFactory); **Frontend component tests** (App.test.tsx, LoginPage.test.tsx); **E2E tests** (checkout-order-history.spec.ts — full happy-path, admin-flow.spec.ts — admin product management + order); **Cross-browser** testing documented (Chromium, Firefox, WebKit all passing); **Mobile device** testing documented (Pixel 5, iPhone 13); well-documented test scenarios in docs/e2e-testing-flow.md and docs/e2e-run.md with failure/fix history. |
| 4 | **Technical Docs** | 5 | ✅ Met (5/5) | Excellent documentation suite: 3 ADRs (frontend, backend, cloud provider) with context/decision/consequences; component architecture (product-catalog.md with atomic design hierarchy); system architecture diagram + ERD in docs/diagrams/; security checklist (docs/security-checklist.md); changelog (docs/CHANGELOG.md); E2E testing flow documentation; comprehensive README with setup instructions, environment variables, API docs, tech stack details. |
| 5 | **User Docs** | 4 | ✅ Met (4/4) | Professional user guide (docs/user-guide.md) covering registration, login, browsing, cart, checkout, order history — each section with screenshots (13 screenshots in docs/screenshots/). Separate admin guide (docs/admin-guide.md) covering product CRUD and order status management with 5 admin-specific screenshots. Troubleshooting section included. |
| 6 | **AI Reflection** | 3 | ✅ Met (3/3) | AI-USAGE.md covers multiple milestones with specific examples: component hierarchy construction, product catalog development (explains what was accepted/rejected from AI — e.g., BrowserRouter suggestion rejected), shopping cart development (explains payload and useReducer concepts learned), authentication/security/testing development, Azure deployment struggles. Includes honest pros/cons section and lessons learned about prompt formatting and AI limitations. |

**Total: 16 / 25**

## 3. Detailed Findings

### Item #1: Production Deployment

**What was expected**: A working production deployment with HTTPS and professional setup (e.g., deployed to Azure App Service, Azure Static Web Apps, or similar cloud hosting with a live URL).

**What was found**: No deployment infrastructure exists in the repository. No Dockerfile, no docker-compose, no Bicep/ARM templates, no Azure configuration files. The README (line 132) explicitly states: "This repo does not include IaC." A `publish_linux/` folder contains .NET build artifacts targeting Linux but no evidence these were ever deployed. The AI-USAGE.md reflection confirms: "I wasn't able to deploy my application to Azure due to issues with Microsoft." No live URLs are provided in README.md or SUBMISSION.md.

**Gap**: Missing all deployment artifacts — no cloud configuration, no containerization, no live deployment URL.

### Item #2: CI/CD Pipeline

**What was expected**: An automated CI/CD pipeline (e.g., GitHub Actions workflow) that builds, tests, and optionally deploys the application.

**What was found**: No `.github/workflows/` directory exists. No CI/CD configuration files of any kind (GitHub Actions, Azure Pipelines, Jenkins, etc.) are present in the repository. All building and testing is done manually via local commands documented in the README.

**Gap**: Missing entirely — no pipeline definition file exists anywhere in the repository.

## 4. Action Plan

1. **[5pts] Production Deployment**: Create deployment infrastructure. Options include:
   - Add a `Dockerfile` and `docker-compose.yml` for containerized deployment
   - Create Azure Bicep/ARM templates for Azure App Service (backend) + Static Web Apps (frontend)
   - Deploy and provide live URLs in SUBMISSION.md
   - Configure HTTPS on the deployed application

2. **[4pts] CI/CD Pipeline**: Create `.github/workflows/ci.yml` with at minimum:
   - Trigger on push/PR to main
   - Backend: `dotnet restore` → `dotnet build` → `dotnet test`
   - Frontend: `npm install` → `npm run build` → `npm test`
   - Optionally add deployment steps to Azure

## 5. Code Quality Coaching (Non-Scoring)

- **Published build artifacts committed to repo**: `backend/HelloWorldApi/publish_linux/` contains compiled DLLs and build output. This should be added to `.gitignore` — build artifacts should not be committed to source control as they bloat the repository and can contain environment-specific binaries.

- **Test credentials in SUBMISSION.md**: While appropriate for course submission, the pattern of documenting credentials in a committed file would be a security concern in a real project. Consider noting these are development-only credentials.

- **Hardcoded test JWT key in integration tests**: `TestWebApplicationFactory.cs` uses `"THIS_IS_A_TEST_KEY_32+_CHARS_LONG_1234567890"` — this is acceptable for testing but the name could be more clearly marked as test-only (e.g., `TEST_ONLY_...`).

## 6. Git Practices Coaching (Non-Scoring)

- **Build artifacts in source control**: The `publish_linux/` directory and various `bin/`/`obj/` folders appear to be tracked. These should be excluded via `.gitignore` to keep the repository clean and reduce clone size.

- **Honest self-assessment in reflection**: The student's candid acknowledgment of the Azure deployment failure in AI-USAGE.md is commendable from a professional communication standpoint. In industry, transparent status reporting is valued.

---

**16/25** — Strong testing suite, documentation, user guides with screenshots, and a thoughtful AI reflection earn full marks in those categories. The two missing items — production deployment (5pts) and CI/CD pipeline (4pts) — represent the 9-point gap. The coaching notes above (build artifacts in repo, test credential handling) are suggestions for professional growth, not scoring deductions.
