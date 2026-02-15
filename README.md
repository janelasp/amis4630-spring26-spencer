# amis4630-spring26-spencer
AMIS 4630 Buckeye Marketplace Project

## Table of Contents
1. [Business System Summary](#business-system-summary)
2. [Feature Prioritization](#feature-prioritization)
3. [System Diagrams](#system-diagrams)
4. [Architecture Decision Records](#architecture-decision-records)
5. [Component Hiearchy](#component-hierarchy)

## Business System Summary 
Buckeye Marketplace is an e-commerce platform catered towards students and other individuals affiliated with the Ohio State University. The store sells school merch, school supplies, textbooks, dorm decor and football gameday outfits. Users are able to create an account and log in with school credentials if applicable. The application will have unique features such as the ability to save items to a collection that will be linked to the user's account. Items can either be ordered for pickup or delivery.

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
* [Entity Relationship Diagram](./docs/diagrams/ERD.png)

> **AI Usage:** AI was used to refine ERD to see if any other entities could be added based on user stories.

## Architecture Decision Records
Detailed records of technical choices can be found in the documents below:
* [ADR-001: React for Frontend Framework](./docs/adr/adr-001-frontend.md)
* [ADR-002: .NET for Backend Framework](./docs/adr/adr-002-backend.md)
* [ADR-003: Azure as Cloud Provider](./docs/adr/adr-003-cloud-provider.md)

> **AI Usage:** Used AI to refine ADR documents and to identify positive and negative consequences of using the different frameworks.

## Component Hierarchy
Component hiearchies for the different application features:
* [Product Catalog Component Hierarchy](./docs/component-architecture/product-catalog.md)

> **AI Usage:** AI was used to help with construction of component hierarchy and diagram as well as refine architecture in relation to pain points from user stories.




