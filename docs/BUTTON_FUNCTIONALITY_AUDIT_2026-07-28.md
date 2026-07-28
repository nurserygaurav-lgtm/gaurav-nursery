# Application button and functionality audit — 2026-07-28

## Deployment architecture finding

Two frontend implementations exist in this repository:

- `frontend/`: legacy React application with a large route tree.
- `apps/customer-web/`: Next.js application configured as the Vercel production root.

They do not share one routing or API client layer. A feature can be implemented in one application and absent in the deployed one. This is the principal cause of URLs rendering a public template or a presentation-only screen.

## Confirmed live-data functions in the Next.js production application

| Surface | Status | API/data source |
| --- | --- | --- |
| Customer login | Working with access token | `POST /api/auth/login` |
| Product list/search | Partially working | `GET /api/products` |
| Product detail | Working | `GET /api/products/:id` |
| Cart | Working for authenticated customer/admin | `/api/cart` |
| Wishlist | Working for authenticated customer/admin | `/api/wishlist` |
| Customer orders | Working | `GET /api/orders/my` |
| Admin dashboard | Working only after actual database role is `admin`/`super_admin` | `GET /api/dashboard/admin` |
| Seller dashboard | Working for seller/admin token | `GET /api/dashboard/seller` |
| Seller products/orders/inventory/profile APIs | Working backend routes | `/api/seller/*` |
| Seller product creation | Working form/API | `POST /api/seller/products` |

## Confirmed broken or incomplete functionality

### Deployed Next.js application

- Customer catch-all routes (`apps/customer-web/app/[...slug]`) are display-only for many URLs including categories, checkout, offers, blog, contact, FAQs and register.
- Seller child routes use a presentation shell; product edit/delete controls, image-upload UI, pagination, filtering, coupons, customers, reviews, wallet, withdrawals, shipping, notifications, and reports are not complete.
- Admin sidebar lists many routes that have no real corresponding Next.js pages/API modules. Search, date range, dark-mode, messages, notifications and export are visual controls only.
- Login state is duplicated in local/session storage and not centrally rendered into every customer header. Some public screens still show Login after sign-in.
- Access token refresh, token rotation, logout revocation, device sessions and HTTP-only cookie sessions are missing.

### Legacy React application (`frontend/`)

Explicit placeholder routes were found in `frontend/src/App.jsx`:

- Seller: customers, reviews and messages.
- Admin: categories, transactions, reports, coupons, reviews and settings.

These must not be considered production-ready, and should be retired or rebuilt rather than linked from production navigation.

## Backend capability gaps

Missing database/API modules include categories/subcategories CRUD, coupon CRUD, banners/CMS/blog CRUD, returns/refunds, notification persistence/delivery, seller wallet/withdrawals/settlements, invoice generation/export jobs, review moderation, shipping, analytics traffic, and payment/refund administration.

## Security findings

- Access tokens are stored in browser storage; an XSS vulnerability could expose them.
- There is no refresh-token lifecycle.
- CORS is allowlisted, but a same-origin proxy or secure cookie session architecture is needed for robust production sessions.
- Admin/Super Admin access correctly depends on the persisted MongoDB role. A browser visit cannot and must not grant it.

## Required implementation order

1. Consolidate on the Next.js apps or the legacy React app; do not maintain two live route systems.
2. Build a shared authenticated API client with refresh/token-expiry handling, redirects, toasts and error boundaries.
3. Complete customer checkout, addresses, payment, tracking, account/profile and support flows.
4. Complete Seller products edit/delete/images, orders status actions, inventory adjustment, profile, coupon and reporting flows.
5. Implement missing Admin domain modules and then expose their navigation/buttons.
6. Add integration tests against a non-production MongoDB database plus role-based browser acceptance tests.

## Verification performed

- Searched implemented source for placeholder markers, route declarations and API calls.
- Verified Seller/Admin/Customer TypeScript checks in earlier implementation commits.
- Verified Vercel deployment status for commit `fb5e1f3` as successful.
- Render/MongoDB private runtime data cannot be inspected from this workspace; production API verification requires an authorized test account for each role and Render logs.
