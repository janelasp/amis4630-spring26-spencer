# ADR-003: Use Azure as Cloud Provider

## Date: 2026-02-14

## Status: Accepted

## Context
There will be thousands of users interacting with the e-commerce application and we require a cloud provider that is scalable and ensures minimal downtime. The platform needs to host the web servers, manage the database and provide secure authentication. We also need a provider that offers robust monitoring and seamless integration with our chosen backend framework. The application needs to be scalable as demand grows and promote long-term stability.

## Decision
We will use Azure as our cloud provider.

## Consequences
Positive: 
- Seamless .NET integration with built-in managed services (database, authentication).
- Comprehensive suite of managed services (databases, authentication, monitoring, etc.).

Negative: 
- Pricing model can be expensive at scale compared to AWS.
- Vendor lock-in with Microsoft services makes migration difficult.