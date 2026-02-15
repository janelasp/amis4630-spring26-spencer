# ADR-002: Use .NET for Backend Framework

## Date: 2026-02-14

## Status: Accepted

## Context
We require a backend framework to interact with the frontend and handle all server-side logic. The backend must be robust, secure and scalable to accomodate user authentication, order processing, and integration with external services. The framework should align with the core requirements of the application such as reliability, maintainability, and future scalability. 

## Decision
We will use .NET as our backend framework. 

## Consequences
Positive: 
- Strong type safety and compile-time error checking reduces bugs.
- Excellent support for building scalable, high-performance applications.
- Seamless deployment to Azure.

Negative: 
- Steeper learning curve for C# and .NET concepts.
- Licensing or hosting costs may be higher in certain scenarios.
- Less flexibility if you want to use non-Microsoft technologies or open-source alternatives.
