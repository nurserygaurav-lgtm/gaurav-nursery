# Production route matrix

Status is intentionally evidence-based: **Live** means real endpoint-backed; **Partial** means only some actions are real; **Placeholder** means presentation only.

| URL | Next.js component | API | Auth / role | Status |
| --- | --- | --- | --- | --- |
| `/` | `app/page.tsx` | products list | public | Partial |
| `/shop` | `app/shop/page.tsx` | products, cart add | public/customer | Partial |
| `/products/[id]` | `app/products/[id]/page.tsx` | product detail, cart add | public/customer | Partial |
| `/login` | `app/login/page.tsx` | auth login | public | Live access-token login |
| `/cart` | `app/cart/page.tsx` | cart CRUD | customer/admin | Partial |
| `/wishlist` | `app/wishlist/page.tsx` | wishlist CRUD | customer/admin | Partial |
| `/orders` | `app/orders/page.tsx` | own orders | customer/admin | Partial |
| `/checkout` | catch-all page | none | customer | Placeholder |
| `/seller` | `app/seller/page.tsx` | seller dashboard | seller/admin | Partial |
| `/seller/products` | `app/seller/[...slug]/page.tsx` | seller products | seller/admin | Partial |
| `/seller/orders` | `app/seller/[...slug]/page.tsx` | seller orders | seller/admin | Partial |
| `/seller/inventory` | `app/seller/[...slug]/page.tsx` | seller inventory | seller/admin | Partial |
| `/seller/profile`, `/seller/settings` | `app/seller/[...slug]/page.tsx` | seller profile | seller/admin | Partial |
| `/seller/add-product` | `app/seller/[...slug]/page.tsx` | create product | seller/admin | Partial |
| `/seller/analytics`, `/seller/revenue` | `app/seller/[...slug]/page.tsx` | seller dashboard analytics | seller/admin | Partial |
| `/admin` | `app/admin/page.tsx` | admin dashboard | admin/super_admin | Partial |
| `/admin/*` | admin catch-all | none for most destinations | admin/super_admin | Placeholder |
| all other customer catch-all routes | `app/[...slug]/page.tsx` | none | varies | Placeholder |

## Backend API matrix

| Namespace | Current status |
| --- | --- |
| `/api/auth` | login/register/Google/me; no refresh/session rotation |
| `/api/products` | list/detail plus seller/admin mutation |
| `/api/cart`, `/api/wishlist`, `/api/orders` | core customer functions |
| `/api/dashboard/admin`, `/api/dashboard/seller` | real aggregate dashboards |
| `/api/seller` | seller dashboard/products/orders/profile/inventory routes |
| categories, coupons, CMS, banners, reviews, returns, refunds, invoices, shipping, wallet, settlements | missing or incomplete |
