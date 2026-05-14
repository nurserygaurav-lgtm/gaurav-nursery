# Gaurav Nursery

Production-ready multi-vendor nursery ecommerce platform for customers, sellers, and admins.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT
- Image Uploads: Cloudinary
- Payments: Razorpay

## Project Structure

```txt
gaurav-nursery/
  frontend/
    src/
      components/
      hooks/
      layouts/
      pages/
      services/
      utils/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
```

## Getting Started

1. Install dependencies:

```bash
npm run install:all
```

2. Copy environment files:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

3. Start both apps:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`.
Backend runs on `http://localhost:5000`.
