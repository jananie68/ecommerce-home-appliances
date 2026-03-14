# Full Stack E-commerce Platform

Amazon-inspired full stack e-commerce project built with React, Tailwind CSS, Node.js, Express, and MongoDB.

## Core Features

- Responsive customer navbar with search, categories, deals, wishlist, cart, orders, and profile actions
- Responsive admin navigation for dashboard, products, orders, users, analytics, notifications, and categories
- Product listing grid with hover cards, discount badges, star ratings, filters, and loading skeletons
- Product details page with recommendations, reviews, ratings, and add-to-cart flow
- Wishlist, cart, order tracking, and user dashboard experience
- Admin product CRUD, category management, user management, order management, inventory awareness, and analytics

## Tech Stack

### Frontend

- React
- React Router
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- bcrypt password hashing

## Project Structure

- [ARCHITECTURE_OVERVIEW.md](/e:/ecommerce/ARCHITECTURE_OVERVIEW.md): updated folder structure and feature map
- [frontend](/e:/ecommerce/frontend): React storefront and admin dashboard
- [backend](/e:/ecommerce/backend): Express API, MongoDB models, and admin services

## Setup

1. Install backend dependencies.
   ```bash
   cd backend
   npm install
   ```
2. Install frontend dependencies.
   ```bash
   cd ../frontend
   npm install
   ```
3. Create `backend/.env`.
   ```env
   MONGO_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_secret_key
   PORT=5000
   ```
4. Seed sample data if needed.
   ```bash
   cd backend
   node seed.js
   ```
5. Start the backend.
   ```bash
   npm start
   ```
6. Start the frontend.
   ```bash
   cd ../frontend
   npm start
   ```

## Verification

- Frontend production build: `npm.cmd run build`
- Backend smoke test: `node -e "require('./server'); setTimeout(() => process.exit(0), 1000)"`

## Notes

- Customer and admin auth both use the backend JWT flow.
- Tailwind configuration lives in [tailwind.config.js](/e:/ecommerce/frontend/tailwind.config.js).
- API endpoints are documented in [backend/README.md](/e:/ecommerce/backend/README.md).
