# API Structure

Base URL: `/api`

## Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

## Products

- `GET /products`
- `GET /products/seller` seller/admin
- `GET /products/search`
- `GET /products/:id`
- `POST /products` seller/admin
- `PUT /products/:id` seller/admin
- `DELETE /products/:id` seller/admin

## Cart

- `GET /cart` customer/admin
- `POST /cart` customer/admin
- `PUT /cart/:id` customer/admin
- `DELETE /cart/:id` customer/admin

## Wishlist

- `GET /wishlist` customer/admin
- `POST /wishlist` customer/admin
- `DELETE /wishlist/:id` customer/admin

## Orders

- `POST /orders` customer/admin
- `GET /orders/my` customer/admin
- `GET /orders/my-orders` customer/admin
- `GET /orders/seller` seller/admin
- `GET /orders` admin
- `GET /orders/:id` authenticated
- `PUT /orders/:id/status` seller/admin
- `PATCH /orders/:id/status` seller/admin

## Users

- `GET /users` admin
- `GET /users/sellers` admin
- `PATCH /users/sellers/:id/approve` admin

## Payments

- `POST /payments/create-order`
- `POST /payments/verify`
- `POST /payments/razorpay/order`
- `POST /payments/razorpay/verify`
