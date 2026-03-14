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
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key
PORT=5000
```

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
