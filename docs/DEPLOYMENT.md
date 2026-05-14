# Deployment Guide

## Frontend: Vercel

Deploy the `frontend` directory as a Vite project.

Required environment variables:

```txt
VITE_API_URL=https://your-render-api.onrender.com/api
VITE_APP_NAME=Gaurav Nursery
VITE_APP_URL=https://your-vercel-app.vercel.app
VITE_RAZORPAY_KEY_ID=rzp_live_or_test_key
```

Build settings:

```txt
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

`frontend/vercel.json` includes SPA rewrites and immutable asset caching.

## Backend: Render

Deploy the `backend` directory as a Node web service.

Required environment variables:

```txt
NODE_ENV=production
MONGO_URI=mongodb+srv://...
JWT_SECRET=long-random-secret
CLIENT_URL=https://your-vercel-app.vercel.app
CORS_ORIGINS=https://your-vercel-app.vercel.app
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

Build and start:

```txt
Build Command: npm install
Start Command: npm start
Health Check Path: /health
```

## Production Notes

- Use MongoDB Atlas or a replica set because order checkout uses transactions.
- Set `CORS_ORIGINS` to comma-separated trusted domains only.
- Keep Razorpay secret keys only on the backend.
- Rotate `JWT_SECRET` before launch if it was ever shared in development.
- Verify `/health` returns `status: ok` before connecting the frontend.
