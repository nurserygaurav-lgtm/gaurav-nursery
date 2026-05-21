# TODO - Fix Seller Orders timeout (30000ms)

- [ ] Add MongoDB indexes for seller order listing
- [ ] Change backend `GET /orders/seller` to use pagination + field selection + lean
- [ ] Avoid heavy populate on seller list (populate only what UI needs)
- [ ] Add backend endpoint params: `limit`, `offset` (or `page`)
- [ ] Add frontend pagination (Load More, fetch only next 10)
- [ ] Add loading skeleton and retry/fallback UI: `Unable to load orders. Retry`
- [ ] Prevent infinite loading loops in React
- [ ] Add API request timeout handling + retry strategy
- [ ] Verify orders load under 2 seconds on mobile
