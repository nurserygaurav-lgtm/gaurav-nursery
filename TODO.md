# TODO - Deployment diagnosis/fix (Vercel)

- [ ] Decide Option A vs Option B to remove conflicting `vercel.json` roots.
- [ ] If Option A: merge frontend build/headers/rewrites into root `vercel.json` under `experimentalServices.frontend`.
- [ ] If Option B: ensure Vercel “Root Directory” is set to `frontend` so `frontend/vercel.json` is used.
- [ ] Redeploy from Vercel with build cache disabled.
- [ ] Verify live homepage loads premium “Gaurav Nursery” UI (Home bundle updated).

