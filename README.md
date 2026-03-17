# Sri Palani Andavan Electronics

Modern full-stack eCommerce web application for a home appliances shop, built with React, Tailwind CSS, Express, MongoDB, JWT authentication, Razorpay payments, Groq-powered chatbot support, and Google Translate integration.

## Project Structure

- `frontend/` - Vite + React storefront
- `backend/` - Express API, JWT auth, MongoDB models, Razorpay and Groq integrations
- `database/` - seed script and sample product catalog
- `admin-dashboard/` - admin dashboard routes and views used by the frontend
- `user-dashboard/` - customer dashboard routes and views used by the frontend

## Features

- Responsive storefront with home, catalog, product details, about, contact, cart, checkout, auth, and order confirmation pages
- JWT login/signup, protected user dashboard, and secure admin access
- Product search, category filtering, sorting, wishlist, reviews, warranty/specification display, and stock indicators
- Admin analytics, product management, image uploads, stock allocation, featured toggles, and order management
- Razorpay order creation and payment verification support with demo-safe fallback mode when keys are missing
- Groq chatbot endpoint with catalog-aware fallback answers for local development
- Google Translate widget for dynamic multi-language support

## Quick Start

1. Install dependencies:

   ```bash
   npm install
   npm install --prefix backend
   npm install --prefix frontend
   ```

2. Copy env files:

   ```bash
   copy backend\\.env.example backend\\.env
   copy frontend\\.env.example frontend\\.env
   ```

3. Start MongoDB locally or update `MONGODB_URI` in `backend/.env`.

4. Seed the database:

   ```bash
   npm run seed
   ```

5. Run the full stack app:

   ```bash
   npm run dev
   ```

## Demo Credentials

- Admin email: `admin@sripalaniandavan.com`
- Admin password: `Admin@12345`

Change these in production and regenerate secrets before deployment.
