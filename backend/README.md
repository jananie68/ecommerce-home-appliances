# Backend

Express and MongoDB backend for the e-commerce platform.

## Implemented Modules

- Auth and profile management
- Wishlist persistence
- Product catalog CRUD
- Product filtering, featured products, related products, and reviews
- Order creation, customer order history, and delivery tracking steps
- Admin users, products, orders, categories, and analytics

## Environment

Create `backend/.env` with:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/sri-palani-andavan-electronics
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
FRONTEND_URLS=http://localhost:5173
TRUST_PROXY=0
UPLOAD_DIR=
PORT=5000
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_razorpay_api_secret
```

Use the Razorpay API key pair from the dashboard `API Keys` section. Make sure both values are from the same mode (`test` with `test`, or `live` with `live`) and do not use the webhook secret in `RAZORPAY_KEY_SECRET`.

For deployment, prefer `FRONTEND_URLS` for a comma-separated allowlist of frontend domains. `UPLOAD_DIR` lets you move product image uploads onto persistent storage instead of the local project folder.

## Scripts

- `npm start`: run the server
- `npm run dev`: run with nodemon

## API Summary

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`
- `PUT /api/auth/wishlist`

### Products

- `GET /api/products`
- `GET /api/products/featured/list`
- `GET /api/products/:id`
- `GET /api/products/:id/related`
- `POST /api/products/:id/reviews`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Categories

- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

### Orders

- `POST /api/orders`
- `GET /api/orders/myorders`
- `GET /api/orders/:id`
- `PUT /api/orders/:id/pay`
- `PUT /api/orders/:id/status`
- `PUT /api/orders/:id/deliver`

### Admin

- `GET /api/admin/users`
- `PUT /api/admin/users/:id`
- `DELETE /api/admin/users/:id`
- `GET /api/admin/orders`
- `GET /api/admin/products`
- `GET /api/admin/categories`
- `GET /api/admin/analytics`
