import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });
export const API_BASE_URL = "http://localhost:5000";

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const register = (userData) => API.post("/auth/register", userData);
export const login = (userData) => API.post("/auth/login", userData);
export const getProfile = () => API.get("/auth/profile");
export const updateProfile = (userData) => API.put("/auth/profile", userData);
export const updateWishlist = (productId) => API.put("/auth/wishlist", { productId });

export const getProducts = (params) => API.get("/products", { params });
export const getFeaturedProducts = () => API.get("/products/featured/list");
export const getProduct = (id) => API.get(`/products/${id}`);
export const getRelatedProducts = (id) => API.get(`/products/${id}/related`);
export const createProductReview = (id, reviewData) => API.post(`/products/${id}/reviews`, reviewData);
export const createProduct = (productData) => API.post("/products", productData);
export const updateProduct = (id, productData) => API.put(`/products/${id}`, productData);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

export const getCategories = () => API.get("/categories");
export const createCategory = (payload) => API.post("/categories", payload);
export const updateCategory = (id, payload) => API.put(`/categories/${id}`, payload);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

export const createOrder = (orderData) => API.post("/orders", orderData);
export const getOrder = (id) => API.get(`/orders/${id}`);
export const getMyOrders = () => API.get("/orders/myorders");
export const getOrders = () => API.get("/orders");
export const payOrder = (id, paymentResult) => API.put(`/orders/${id}/pay`, paymentResult);
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });
export const deliverOrder = (id) => API.put(`/orders/${id}/deliver`);

export const getUsers = () => API.get("/admin/users");
export const updateUser = (id, payload) => API.put(`/admin/users/${id}`, payload);
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);
export const getAdminOrders = () => API.get("/admin/orders");
export const getAdminProducts = () => API.get("/admin/products");
export const getAdminCategories = () => API.get("/admin/categories");
export const getAdminAnalytics = () => API.get("/admin/analytics");
