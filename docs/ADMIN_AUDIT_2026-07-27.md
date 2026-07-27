# Admin dashboard audit — 2026-07-27

## Fixed in commit `2264ed6`

- Added `GET /api/dashboard/admin`, protected by `protect` and `authorize('admin', 'super_admin')`.
- Dashboard statistics are real MongoDB aggregates: users, customers, sellers, pending sellers, products, orders, paid revenue, today's sales, recent orders, categories, monthly revenue, order statuses, and low-stock products.
- Added `super_admin` role support. A super admin inherits Admin route access.
- Replaced four independent Admin dashboard reads with one dashboard API request.
- The Admin frontend validates `/api/auth/me` before loading data.
- Missing, invalid, expired, or non-admin sessions clear local storage and redirect to `/login?next=/admin`; they no longer remain on a broken Forbidden dashboard.
- Verified syntax for changed backend files and TypeScript checks for customer/admin apps. Vercel deployment succeeded.

## Current blocker for the shown 403

The account used in the screenshot has a role other than `admin` or `super_admin` in MongoDB. Run the private Render Shell command once:

```bash
ADMIN_EMAIL=nurserygaurav@gmail.com npm run promote:admin
```

Then log out and log in again to receive a token containing the new role.

## Implemented backend routes

- Authentication: register, login, Google login, current user.
- Customer: products, cart, wishlist, own orders, payments.
- Seller: own products, own orders, seller dashboard, payouts/restock/tickets where exposed.
- Admin: users list, sellers list, seller approval, all orders, product mutation, admin tickets, dashboard aggregate.

## Missing or incomplete backend APIs

- Refresh-token issue/rotation/revocation and device/session management.
- Admin category and subcategory CRUD.
- Brand, attributes, variants, inventory-adjustment CRUD.
- Product approval/rejection workflow and audit trail.
- Return/refund workflow and refund approval.
- Coupon, offer, banner, blog, CMS-page CRUD.
- Notification delivery and notification centre.
- Seller wallet/settlement/commission persistence.
- Analytics traffic/live visitor/map data.
- Export/import jobs, pagination/filter/sort standards across every list.
- Admin settings, tax, shipping, email/SMS/WhatsApp gateway configuration.

## Broken or placeholder UI routes

- Most Customer catch-all routes remain presentational placeholders.
- Seller Panel routes are presentational and not yet wired to the legacy API.
- Admin sidebar destination routes other than `/admin` are not yet implemented as real pages.
- Export, global search, date range, dark-mode, messages and notification buttons are visual only.
- Customer checkout/payment, address book, returns, refunds, tracking, profile, and notifications are not yet complete.

## Security findings

- Existing access token is stored in browser local/session storage; this is vulnerable to XSS token theft.
- No refresh-token lifecycle currently exists. Implement short-lived access tokens plus rotated HttpOnly refresh cookies before production scale.
- Public registration validates roles as `customer` or `seller`; retain tests that ensure `admin` and `super_admin` registration attempts are rejected.
- No centralized frontend API client or global error boundary/toast system exists.
- Admin promotion must remain a private Render Shell operation; no public bootstrap endpoint was added.

## Required next implementation sequence

1. Execute the private admin promotion command and verify `/api/auth/me` returns `admin`.
2. Add refresh-token/session model and a shared frontend authenticated API client.
3. Implement categories, product approvals, seller approval action UI, order status action UI and audit logs.
4. Add return/refund, marketing, CMS, settings and notification APIs before exposing their sidebar pages.
5. Add integration tests against a non-production MongoDB database and manual acceptance tests per role.
