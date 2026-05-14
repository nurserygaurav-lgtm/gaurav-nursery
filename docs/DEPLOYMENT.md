# Production Deployment Guide

This guide prepares Gaurav Nursery for a professional production launch using:

- MongoDB Atlas for the production database
- Render for the Node/Express API
- Vercel for the Vite React storefront
- `gauravnursery.online` as the public domain

Do not commit real secrets. Add production values only inside the MongoDB Atlas, Render, Vercel, Cloudinary, Razorpay, and DNS dashboards.

## Deployment Order

1. Create MongoDB Atlas production database.
2. Deploy backend API on Render.
3. Deploy frontend on Vercel.
4. Connect `gauravnursery.online`.
5. Run production verification checks.

## MongoDB Atlas

Create a dedicated Atlas project and cluster for production.

Recommended setup:

- Cluster: M10 or higher for production transactions, or M0 only for early testing.
- Cloud region: choose the closest stable region to the main customer base.
- Database name: `gaurav_nursery_prod`.
- Database user: create an app-only user such as `gaurav_nursery_api`.
- Permissions: `readWrite` only for `gaurav_nursery_prod`.
- Network access: allow Render outbound access. For initial deployment, Atlas `0.0.0.0/0` can work, but tighten this when fixed outbound IPs are available.
- Backups: enable scheduled backups before launch.

Connection string format:

```txt
mongodb+srv://gaurav_nursery_api:<password>@<cluster-host>/gaurav_nursery_prod?retryWrites=true&w=majority
```

Production notes:

- Use the SRV connection string from Atlas.
- Keep the Atlas password out of Git.
- The backend already disables Mongoose auto-indexing in production.
- Order checkout uses MongoDB transactions, so Atlas or another replica set is required.

## Frontend: Vercel

Deploy the `frontend` directory as a Vite project.

Required environment variables:

```txt
VITE_API_URL=https://your-render-api.onrender.com/api
VITE_APP_NAME=Gaurav Nursery
VITE_APP_URL=https://gauravnursery.online
VITE_RAZORPAY_KEY_ID=rzp_live_public_key
```

Build settings:

```txt
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

`frontend/vercel.json` includes SPA rewrites and immutable asset caching.

Vercel checklist:

- Import the GitHub repository into Vercel.
- Set the root directory to `frontend`.
- Add all `VITE_` production environment variables.
- Deploy once using the Vercel preview URL.
- After Render is live, update `VITE_API_URL` to the final backend API URL.
- Redeploy production after environment variables change.
- Test home, shop, product details, login/register, cart, checkout, seller, and admin routes on mobile and desktop.

## Backend: Render

Deploy the `backend` directory as a Node web service.

Required environment variables:

```txt
NODE_ENV=production
MONGO_URI=mongodb+srv://...
JWT_SECRET=long-random-secret
CLIENT_URL=https://gauravnursery.online
CORS_ORIGINS=https://gauravnursery.online,https://www.gauravnursery.online,https://your-vercel-app.vercel.app
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RAZORPAY_KEY_ID=rzp_live_public_key
RAZORPAY_KEY_SECRET=rzp_live_secret_key
```

Build and start:

```txt
Root Directory: backend
Build Command: npm install
Start Command: npm start
Health Check Path: /health
```

Render checklist:

- Create a new Web Service from the existing GitHub repository.
- Set root directory to `backend`.
- Use Node runtime.
- Set `NODE_ENV=production`.
- Add the Atlas `MONGO_URI`.
- Generate a fresh `JWT_SECRET` with at least 32 random bytes.
- Set `CLIENT_URL` to the final frontend domain.
- Set `CORS_ORIGINS` to trusted production domains only.
- Add Cloudinary credentials for product image uploads.
- Add Razorpay live keys only after payment account verification is complete.
- Keep `RAZORPAY_KEY_SECRET` only on Render, never on Vercel.
- Confirm `/health` returns `status: ok` after deploy.

Optional scaling variables:

```txt
JWT_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200
```

Increase Render plan before launch if API response time, cold starts, or traffic volume require it.

## Environment Variable Inventory

Backend required in production:

```txt
NODE_ENV=production
MONGO_URI=
JWT_SECRET=
CLIENT_URL=
```

Backend required for full ecommerce operation:

```txt
CORS_ORIGINS=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

Backend optional:

```txt
PORT=5000
JWT_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200
```

Frontend required:

```txt
VITE_API_URL=
VITE_APP_NAME=Gaurav Nursery
VITE_APP_URL=https://gauravnursery.online
VITE_RAZORPAY_KEY_ID=
```

Security checklist:

- Do not expose `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_API_SECRET`, or `RAZORPAY_KEY_SECRET` to Vercel.
- Use live Razorpay keys only in production.
- Rotate any secret that was pasted into chat, logs, screenshots, or local terminals.
- Keep `.env` and `.env.local` untracked.
- Restrict CORS to production domains before public launch.

## Domain Plan: gauravnursery.online

Recommended DNS layout:

```txt
gauravnursery.online      -> Vercel production project
www.gauravnursery.online  -> Vercel production project
api.gauravnursery.online  -> Render backend service, optional but recommended
```

Frontend domain steps:

- Add `gauravnursery.online` in Vercel Project Settings > Domains.
- Add `www.gauravnursery.online` in the same Vercel project.
- Follow Vercel's DNS instructions at the domain registrar.
- Set `gauravnursery.online` as the primary domain.

Backend domain steps:

- Add `api.gauravnursery.online` as a custom domain in Render.
- Follow Render's DNS instructions at the domain registrar.
- After Render verifies TLS, update:

```txt
VITE_API_URL=https://api.gauravnursery.online/api
CLIENT_URL=https://gauravnursery.online
CORS_ORIGINS=https://gauravnursery.online,https://www.gauravnursery.online
```

Redeploy both services after changing environment variables.

## Launch Verification

Run these checks before sharing the live site:

- Backend `/health` returns JSON with `status: ok`.
- Frontend loads over HTTPS at `https://gauravnursery.online`.
- API requests use HTTPS and point to the production API.
- Customer registration and login work.
- Product listing and product detail pages load from the API.
- Cart, checkout, and order creation work.
- Razorpay payment verification succeeds in live mode.
- Seller product image uploads reach Cloudinary.
- Admin and seller protected routes block unauthorized users.
- Mobile header, cart, checkout, and product grids remain responsive.
- No browser console errors appear on key customer flows.

## Production Notes

- Set `CORS_ORIGINS` to comma-separated trusted domains only.
- Keep Razorpay secret keys only on the backend.
- Rotate `JWT_SECRET` before launch if it was ever shared in development.
- Verify `/health` returns `status: ok` before connecting the frontend.
