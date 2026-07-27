# Gaurav Nursery Marketplace v2 migration

The approved UI target and all 129 planned screens are documented in [UI_REFERENCE.md](UI_REFERENCE.md).

## Domain mapping

| Domain | v2 application | Deployment target |
| --- | --- | --- |
| `gauravnursery.online` and `www.gauravnursery.online` | `apps/customer-web` | Vercel project: `gaurav-nursery-customer` |
| `seller.gauravnursery.online` | `apps/seller-panel` | Vercel project: `gaurav-nursery-seller` |
| `admin.gauravnursery.online` | `apps/admin-panel` | Vercel project: `gaurav-nursery-admin` |
| `api.gauravnursery.online` | `apps/backend-api` | Render/AWS container |
| internal only | `apps/worker` | Render worker/AWS container |

`gauravnursery.online` remains the public customer domain. The legacy Vite deployment must remain live until the v2 customer web has passed checkout, SEO, and production smoke tests.

## Runtime baseline

Use Node.js 20 LTS or newer in local development, Vercel, Render, and CI. The local machine currently has Node 18.17.1, which is below Next.js 15's minimum version and cannot complete a Next production build.

## Non-negotiable data rules

- Never accept a role from public registration; new users are always customers.
- Seller registration creates a KYC application, not a usable seller account.
- A product is invisible until the moderator approves it.
- Payment success is accepted only from a verified Razorpay webhook and must be idempotent.
- Split an order into seller fulfillments before shipping or settlement operations.
- Keep financial events append-only: payment, refund, commission, wallet, payout, audit event.

## Safe cutover

1. Provision Atlas replica set, Redis, Cloudinary, Razorpay webhook, email, and WhatsApp credentials.
2. Deploy all v2 services to preview domains.
3. Import legacy customers/products only after schema migration scripts and reconciliations are reviewed.
4. Run production smoke tests against preview: sign-up, seller approval, product approval, COD, Razorpay webhook, refund, and multi-seller order.
5. Point `gauravnursery.online` to the v2 customer Vercel project.
6. Retain the legacy database and deployment read-only for at least 30 days.

## First implementation slice

1. Mongo models: user, session, seller, store, category, product, product variant, inventory.
2. Auth endpoints: registration, verification, login, refresh rotation, logout, password reset.
3. RBAC permissions and audit logging.
4. Customer catalog pages backed by approved products.
