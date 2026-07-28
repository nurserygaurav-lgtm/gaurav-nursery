# Architecture consolidation

## Production decision

`apps/customer-web` is the only production web frontend. Vercel must remain rooted at `apps/customer-web`.

`frontend/` is legacy migration source only. It must not receive new production features and must not be deleted until its required capabilities have unique Next.js replacements and role-based acceptance tests pass.

## Target ownership

| Concern | Canonical implementation |
| --- | --- |
| Customer, Seller, Admin browser entry | `apps/customer-web` routes |
| Shared browser session/API access | `apps/customer-web/lib/api.ts` |
| Backend production API | `backend/` Express/MongoDB |
| Seller/Admin standalone apps | development/reference only until separately deployed; do not expose duplicate production URLs |
| Legacy React | `frontend/` migration source, then archive |

## Consolidation phases

1. Freeze new work in `frontend/`; inventory every route/component/API dependency.
2. Move each required feature to one Next.js route and one backend API contract.
3. Replace page-local fetch/token logic with the unified API client.
4. Add backend refresh sessions, a Next auth provider, route guard middleware, toasts and error boundaries.
5. Verify customer/seller/admin acceptance suites against a staging MongoDB database.
6. Move `frontend/` to an archive branch/tag, then remove it in a separate reviewed deletion change.

## Deletion policy

No legacy files were deleted in this phase. The legacy frontend contains partially working functionality that has not reached feature parity in Next.js. Deleting it now would make the production gap larger.
