# Enhanced E-commerce Folder Structure

## Frontend

`frontend/src/App.js`
- Central storefront and admin route map

`frontend/src/context/StoreContext.js`
- Shared cart, wishlist, login, and logout state

`frontend/src/components/`
- `UserNavbar.js`: responsive customer navbar with search, wishlist, cart, orders, and profile menu
- `AdminNavbar.js`: dashboard navigation for products, orders, users, analytics, notifications, and categories
- `ProductCard.js`: Amazon-style product card with rating, discount badge, hover effect, and wishlist action
- `ProductFilters.js`: filter panel for price, category, rating, and sorting
- `OrderTimeline.js`: order tracking timeline
- `LoadingSkeleton.js`: loading state UI
- `Rating.js`: reusable star rating component

`frontend/src/pages/`
- `Products.js`: main product listing page with hero, filters, and product grid
- `ProductDetails.js`: product detail page with reviews and related recommendations
- `Cart.js`: cart page and checkout trigger
- `WishlistPage.js`: saved products page
- `OrdersPage.js`: order tracking page
- `UserDashboard.js`: customer account summary
- `ProfileSettings.js`: editable profile and shipping address form
- `Login.js` and `Signup.js`: auth entry screens

`frontend/src/pages/admin/`
- `AdminDashboard.js`: overview metrics and low-stock alerts
- `AdminProducts.js`: add, edit, and delete product management
- `AdminOrders.js`: order status updates
- `AdminUsers.js`: user role management
- `AdminAnalytics.js`: status and top-selling product analytics
- `AdminCategories.js`: category management

## Backend

`backend/models/`
- `Product.js`: richer catalog schema with reviews, discount metadata, featured state, and shipping info
- `Order.js`: order tracking steps for delivery progress
- `User.js`: wishlist support
- `Category.js`: featured category metadata

`backend/routes/`
- `products.js`: filtering, featured products, related products, reviews, and CRUD
- `orders.js`: checkout, tracking, and admin status management
- `auth.js`: profile and wishlist APIs
- `admin.js`: users, products, orders, categories, and analytics endpoints
- `categories.js`: category CRUD and public category listing

## Tailwind Setup

`frontend/tailwind.config.js`
- Tailwind theme tokens for the storefront/admin UI

`frontend/postcss.config.js`
- PostCSS pipeline for Tailwind and autoprefixer
