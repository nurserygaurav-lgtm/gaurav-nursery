# TODO - Delete today products bugfix

## Plan
1. Verify Product schema and timestamps/createdAt field.
2. Add detailed debug logs in `deleteTodayProducts` (current date, startOfDay/endOfDay, matched count, sample matched products).
3. Implement pre-check query with `Product.find(...).limit(...)` before `deleteMany`.
4. Verify timezone handling with a tested start-of-day using local time.
5. Replace existing delete query with safer tested version: `Product.deleteMany({ createdAt: { $gte: startOfDay } })`.
6. If deletion matches zero, detect alternate date field(s) in Product documents.
7. Add temporary debug route `GET /api/products/debug-today-products` protected by admin auth.
8. Confirm exact reason deletion failed via logs + debug route response.
9. Verify `deletedCount` increases and UI table updates; ensure admin auth still intact.

## Status
- [ ] Inspect Product schema (timestamps already present).
- [x] Inspect deleteTodayProducts route/controller logic.
- [x] Add debug logs and pre-check query.
- [x] Add debug route.
- [ ] Run backend + verify via logs/debug route.
- [ ] Validate frontend disappearing behavior.


