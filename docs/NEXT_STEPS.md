# Deployment Next Steps

1. Create the MongoDB Atlas production cluster and database user.
2. Add the Atlas `MONGO_URI` to Render.
3. Deploy the backend from the `backend` directory on Render.
4. Verify `GET /health` on the Render API URL.
5. Deploy the frontend from the `frontend` directory on Vercel.
6. Set Vercel production variables, especially `VITE_API_URL`.
7. Connect `gauravnursery.online` and `www.gauravnursery.online` to Vercel.
8. Optionally connect `api.gauravnursery.online` to Render.
9. Update CORS and frontend API variables after custom domains are verified.
10. Complete the launch verification checklist in `docs/DEPLOYMENT.md`.
