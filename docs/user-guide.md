# Buckeye Marketplace — User Guide

This guide shows how to use the Buckeye Marketplace app end-to-end.

## Getting Started (Optional)

- App URL (local): http://localhost:5173
- If you don’t have an account yet, follow **Create account and login** below.

---
## 1) Create Account and Login

**Goal:** Register a new account and log in.

### Register
1. Navigate to the Register/Sign Up page.
2. Enter email + password.
3. Submit the form.

**Screenshot:** Registration Page 
[Registration Page](./screenshots/user-01-registration.png)

### Login
1. Navigate to the Login page.
2. Enter email + password.
3. Submit the form.

**Screenshot:** Login Page
[Login Page](./screenshots/user-02-login-page.png)


## 2) Browse Products

**Goal:** View the product catalog and open a product detail page.

1. Open the app.
2. Review the product list (title, price, category).
3. Select a product to view more details.

**Screenshot:** Product catalog page
[Product catalog page](./screenshots/user-03-catalog.png)

**Screenshot:** Product details page
[Product details page](./screenshots/user-04-product-details.png)

---

## 3) Add Items to Cart

**Goal:** Add a product to your cart and confirm it appears in the cart.

1. From product catalog or product details page select "add to cart" button
2. Open the cart using the cart icon/badge in the header.
3. Verify the product appears in the cart with the expected quantity.

**Screenshot:** Cart page with item
[Cart page with item](./screenshots/user-05-cart-page.png)

---

## 4) Place an Order

**Goal:** Complete checkout from your cart.

1. Ensure at least one item is in your cart.
2. Go to the cart page.
3. Select "Proceed to checkout".
4. Enter the shipping address.
5. Submit the order.
6. Confirm you see an order confirmation (confirmation number or success message).

**Screenshot:** Checkout form
[Checkout form](./screenshots/user-06-checkout-form.png)

**Screenshot:** Order confirmation
[Order confirmation](./screenshots/user-07-order-confirmation.png)

---

## 5) View Order History

**Goal:** See previously placed orders.

1. Navigate to the Order History / Orders page.
2. Verify the most recent order appears.
3. Open an order to see its items and status.

**Screenshot:** Order history list
[Order history list](./screenshots/user-08-order-history.png)

---

## Troubleshooting

- **Can’t place an order / API error:** Ensure the backend is running and `VITE_API_BASE_URL` is correct.
- **Login not working:** Confirm password meets requirements (min 8 chars, digit, upper, lower).
