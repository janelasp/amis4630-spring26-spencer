# amis4630-spring26-spencer
AMIS 4630 Buckeye Marketplace Project

## Table of Contents
1. [Business System Summary](#business-system-summary)
2. [Feature Prioritization](#feature-prioritization)
3. [System Diagrams](#system-diagrams)
4. [Architecture Decision Records](#architecture-decision-records)
5. [Component Hierarchy](#component-hierarchy)
6. [Technology Stack](#technology-stack)
7. [Setup (Local Development)](#setup-local-development)
8. [Deployment (High Level)](#deployment-high-level)
9. [API Documentation (Swagger/OpenAPI)](#api-documentation-swaggeropenapi)
10.[Environment Variables](#environment-variables)
11.[AI Tool Usage](#ai-tool-usage)
12.[User Documentation](#user-documentation)

## Business System Summary 
Buckeye Marketplace is an e-commerce platform catered towards students and other individuals affiliated with the Ohio State University. The store sells school merch, school supplies, textbooks, dorm decor and football gameday outfits. Users are able to create an account and log in with school credentials if applicable. The application will have features such as browsing the catalog and purchasing items. They are also able to check their order history.

## Feature Prioritization
1. User Registration and Login
2. Authentication
3. Product Catalog
4. Shopping Cart
5. Admin Dashboard
6. Cloud Deployment
7. Email and Push Notifications
8. Order Tracking
9. Inventory Management
10. Delivery Date Estimator
11. Reviews and Ratings
12. Advanced Filtering and Sorting
13. Wishlist and Saved Collections
14. Course-Based Textbook Matching
15. Student Discounts and Promo Codes

## System Diagrams
Diagrams for the business systems can be found in the files below:
* [System Architecture Diagram](./docs/diagrams/system-architecture.png)
* [Entity Relationship Diagram (User Stories)](./docs/diagrams/ERD_final.png)

> **AI Usage:** AI was used to refine ERD to see if any other entities could be added based on user stories.

## Architecture Decision Records
Detailed records of technical choices can be found in the documents below:
* [ADR-001: React for Frontend Framework](./docs/adr/adr-001-frontend.md)
* [ADR-002: .NET for Backend Framework](./docs/adr/adr-002-backend.md)
* [ADR-003: Azure as Cloud Provider](./docs/adr/adr-003-cloud-provider.md)

> **AI Usage:** Used AI to refine ADR documents and to identify positive and negative consequences of using the different frameworks.

## Component Hierarchy
Component hierarchies for the different application features:
* [Product Catalog Component Hierarchy](./docs/component-architecture/product-catalog.md)

> **AI Usage:** AI was used to help with construction of component hierarchy and diagram as well as refine architecture in relation to pain points from user stories.


## Technology Stack

### Frontend
- React: 19.2.0
- React Router: 7.14.0
- TypeScript: 5.9.3
- Vite (via rolldown-vite): 7.2.5
- Vitest: 3.2.4
- Playwright: 1.59.1

### Backend
- .NET: net10.0 (see `TargetFramework`)
- ASP.NET Core Web API
- Entity Framework Core: 10.0.x
- Identity (ASP.NET Core Identity)
- FluentValidation: 11.3.1
- Swagger/OpenAPI: Swashbuckle.AspNetCore 10.1.2

### Database
- Development/testing default: EF Core InMemory
- Optional: SQL Server (via connection string)

## Setup (Local Development)

### Prerequisites
- Node.js + npm
- .NET SDK that supports `net10.0`

### Backend (API)
1. Configure the JWT signing key (required):
	 ```bash
	 dotnet user-secrets set Jwt:Key "your-long-random-key" --project backend/HelloWorldApi
	 ```
2. Run the API:
	 ```bash
	 dotnet run --project backend/HelloWorldApi
	 ```
3. Confirm it’s running:
	 - Swagger UI: `http://localhost:5000/swagger`
	 - OpenAPI JSON: `http://localhost:5000/openapi/v1.json`

### Frontend (React)
1. Install dependencies:
	 ```bash
	 cd frontend
	 npm install
	 ```
2. (Optional) Point the frontend at a different API base URL:
	 - Create `frontend/.env.local` with:
		 ```
		 VITE_API_BASE_URL=http://localhost:5000/api
		 ```
3. Run the dev server:
	 ```bash
	 npm run dev
	 ```
4. Open: `http://localhost:5173`

### Tests
- Frontend unit tests (Vitest):
	```bash
	cd frontend
	npm test
	```
- E2E tests (Playwright):
	```bash
	cd frontend
	npx playwright test
	```

## Deployment (High Level)

Deployment target is Azure (see ADR-003). This repo does not include IaC; the steps below describe the expected build outputs and required configuration.

### Build artifacts
- Backend:
	```bash
	dotnet publish backend/HelloWorldApi -c Release
	```
- Frontend:
	```bash
	cd frontend
	npm install
	npm run build
	```

### Production configuration notes
- Set `Jwt__Key` in the hosting environment (do not commit it).
- For a persistent DB, enable SQL Server by setting `UseSqlServer=true` and providing `ConnectionStrings__DefaultConnection`.
- Set `Cors__AllowedOrigin` to the deployed frontend origin.

## API Documentation (Swagger/OpenAPI)

When the backend runs in Development mode:
- Swagger UI: `http://localhost:5000/swagger`
- OpenAPI JSON: `http://localhost:5000/openapi/v1.json`

## Environment Variables

### Backend
- Required:
	- `Jwt__Key` (or user secret `Jwt:Key`)
- Optional:
	- `UseSqlServer` (set to `true` to use SQL Server instead of InMemory)
	- `ConnectionStrings__DefaultConnection` (SQL Server connection string)
	- `Cors__AllowedOrigin` (additional allowed frontend origin)
	- `Seed__AdminPassword` (override seeded admin password)
	- `Seed__UserPassword` (override seeded user password)

### Frontend
- Optional:
	- `VITE_API_BASE_URL` (defaults to `http://localhost:5000/api`)

### JWT key (user secrets)
The JWT signing key is intentionally **not** stored in `appsettings.json`. Set it via user secrets:

```bash
dotnet user-secrets set Jwt:Key "your-long-random-key" --project backend/HelloWorldApi
```

### Seeded admin user (for testing)
- Email: `admin@buckeye.local`
- Password: `Admin1234`

Additional seeded admin users exist for parallel E2E projects:
- `admin+chromium@buckeye.local`
- `admin+firefox@buckeye.local`
- `admin+webkit@buckeye.local`
- `admin+mobile-chrome@buckeye.local`
- `admin+mobile-safari@buckeye.local`

### Endpoints
- `POST /api/auth/register` → creates a user and returns `{ accessToken, refreshToken, expiresAtUtc }`
- `POST /api/auth/login` → returns `{ accessToken, refreshToken, expiresAtUtc }`
- `POST /api/auth/refresh` → rotates refresh token and returns new tokens (bonus)

## AI Tool Usage

AI usage notes are consolidated in:
* [AI-USAGE.md](./AI-USAGE.md)

## User Documentation

* [User Guide](./docs/user-guide.md)
* [Admin Guide](./docs/admin-guide.md)

