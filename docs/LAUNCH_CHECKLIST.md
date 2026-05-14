# Production Launch Checklist

Use this checklist while configuring the live Gaurav Nursery deployment.

## 1. MongoDB Atlas

- [ ] Create Atlas project for Gaurav Nursery production.
- [ ] Create production cluster.
- [ ] Create database `gaurav_nursery_prod`.
- [ ] Create app user `gaurav_nursery_api`.
- [ ] Grant only `readWrite` access to `gaurav_nursery_prod`.
- [ ] Add Render outbound access in Atlas Network Access.
- [ ] Copy the SRV connection string.
- [ ] Store the final `MONGO_URI` only in Render.
- [ ] Enable backups before public launch.

## 2. Render Backend

- [ ] Create Render Web Service from the GitHub repository.
- [ ] Set root directory to `backend`.
- [ ] Set build command to `npm install`.
- [ ] Set start command to `npm start`.
- [ ] Set health check path to `/health`.
- [ ] Add all backend production environment variables.
- [ ] Deploy the service.
- [ ] Verify `https://<render-service>.onrender.com/health`.
- [ ] Confirm logs show `MongoDB connected`.
- [ ] Confirm there are no missing production env var errors.

## 3. Vercel Frontend

- [ ] Import the GitHub repository into Vercel.
- [ ] Set framework preset to Vite.
- [ ] Set root directory to `frontend`.
- [ ] Set build command to `npm run build`.
- [ ] Set output directory to `dist`.
- [ ] Add all frontend production environment variables.
- [ ] Deploy production.
- [ ] Verify the storefront loads over HTTPS.
- [ ] Test mobile and desktop layouts.

## 4. Domain: gauravnursery.online

- [ ] Add `gauravnursery.online` to the Vercel project.
- [ ] Add `www.gauravnursery.online` to the Vercel project.
- [ ] Add DNS records at the domain registrar as instructed by Vercel.
- [ ] Set `gauravnursery.online` as the primary domain.
- [ ] Add `api.gauravnursery.online` to the Render service if using a custom API domain.
- [ ] Add DNS records at the domain registrar as instructed by Render.
- [ ] Wait for DNS and TLS verification.

## 5. Final Environment Values

Render backend:

```txt
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
CLIENT_URL=https://gauravnursery.online
CORS_ORIGINS=https://gauravnursery.online,https://www.gauravnursery.online
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
```

Vercel frontend:

```txt
VITE_API_URL=https://api.gauravnursery.online/api
VITE_APP_NAME=Gaurav Nursery
VITE_APP_URL=https://gauravnursery.online
VITE_RAZORPAY_KEY_ID=...
```

## 6. Launch Verification

- [ ] Homepage loads at `https://gauravnursery.online`.
- [ ] API health check returns `status: ok`.
- [ ] Product listing loads from the production API.
- [ ] Product details pages work.
- [ ] Customer registration works.
- [ ] Customer login works.
- [ ] Cart workflow works.
- [ ] Checkout creates an order.
- [ ] Razorpay payment verification works in live mode.
- [ ] Seller image upload reaches Cloudinary.
- [ ] Admin routes require admin authentication.
- [ ] Seller routes require seller authentication.
- [ ] CORS blocks untrusted origins.
- [ ] Browser console is clean on key flows.
- [ ] Mobile navigation and checkout remain responsive.

## 7. Production Safety

- [ ] No real secrets are committed to Git.
- [ ] `.env` and `.env.local` remain ignored.
- [ ] Backend secrets exist only in Render.
- [ ] Frontend contains only public `VITE_` values.
- [ ] Razorpay secret key is not exposed to Vercel.
- [ ] MongoDB Atlas password is not pasted into docs or chat.
- [ ] Any previously exposed token or secret has been rotated.
