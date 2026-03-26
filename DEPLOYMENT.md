# Deployment Guide

## Recommended Stack

- Frontend: Vercel
- Backend API: Render Web Service
- Database: MongoDB Atlas

This split fits the repo well: the frontend is a Vite static app, while the backend is an Express API that benefits from a long-running Node service and a health check endpoint.

## Frontend on Vercel

Deploy the `frontend/` directory as the project root.

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Env vars:
  - `VITE_API_URL=https://YOUR-BACKEND.onrender.com/api`
  - `VITE_BACKEND_URL=https://YOUR-BACKEND.onrender.com`

The repo now includes [frontend/vercel.json](/c:/projects/ecommerce-home-appliances/frontend/vercel.json) so React Router routes rewrite to `index.html` in production.

## Backend on Render

Deploy the `backend/` directory as a Node web service.

- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/api/health`
- Required env vars:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `FRONTEND_URLS`
- Optional env vars:
  - `RAZORPAY_KEY_ID`
  - `RAZORPAY_KEY_SECRET`
  - `GROQ_API_KEY`
  - `GROQ_MODEL`

The repo now includes [render.yaml](/c:/projects/ecommerce-home-appliances/render.yaml) for a Render deployment blueprint.

## Upload Storage

Product image uploads currently use the backend filesystem. That is fine locally, but in production the filesystem is usually ephemeral.

- The code now supports `UPLOAD_DIR`, so you can point uploads at persistent storage.
- The included Render blueprint mounts a persistent disk at `/var/data/uploads` and sets `UPLOAD_DIR` to that path.
- If you want zero-downtime deploys and CDN-backed image delivery later, move uploads to Cloudinary, S3, or another object storage service.

## MongoDB

Use a hosted MongoDB connection string for `MONGODB_URI`. MongoDB Atlas is the most straightforward option for this codebase because the backend already expects a standard MongoDB URI and does not depend on provider-specific features.
