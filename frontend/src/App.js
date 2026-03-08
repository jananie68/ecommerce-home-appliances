import React, { useState } from "react";
import OrderPage from "./pages/OrderPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styles/style.css";

import ProductDetails from "./pages/ProductDetails";
import OrderSuccess from "./pages/OrderSuccess";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Footer from "./components/Footer";

import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useEffect } from "react";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AddProduct from "./pages/admin/AddProduct";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminLayout from "./pages/admin/AdminLayout";


function App() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);
  
  useEffect(() => {

    const storedUser =
      JSON.parse(localStorage.getItem("user"));
  
    if (storedUser) {
      setUser(storedUser);
    }
  
  }, []);
  useEffect(() => {

    if (user) {
  
      localStorage.setItem(user.uid, JSON.stringify(cart));
  
    }
  
  }, [cart, user]);
  
  useEffect(() => {

    if (user) {
  
      const savedCart = localStorage.getItem(user.uid);
  
      if (savedCart) {
  
        setCart(JSON.parse(savedCart));
  
      } else {
  
        setCart([]);
  
      }
  
    }
  
  }, [user]);
  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  
      if (currentUser) {
  
        setUser(currentUser);
  
        // Admin check
        if (currentUser.email === "admin@gmail.com") {
  
          setIsAdmin(true);
  
        } else {
  
          setIsAdmin(false);
  
        }
  
        // Restore cart for that user
        const savedCart = localStorage.getItem("cart_" + currentUser.uid);
  
        if (savedCart) {
  
          setCart(JSON.parse(savedCart));
  
        } else {
  
          setCart([]);
  
        }
  
      } else {
  
        setUser(null);
  
        setIsAdmin(false);
  
        setCart([]);
  
      }
  
    });
  
    return () => unsubscribe();
  
  }, []);
  
  
  useEffect(() => {

    if (user) {
  
      localStorage.setItem(
        "cart_" + user.uid,
        JSON.stringify(cart)
      );
  
    }
  
  }, [cart, user]);
  
  
  useEffect(() => {

    onAuthStateChanged(auth, (currentUser) => {
  
      setUser(currentUser);
  
    });
  
  }, []);
  
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (

    <BrowserRouter>

<Navbar
  cartCount={cart.length}
  user={user}
  setUser={setUser}
  setCart={setCart}
  search={search}
  setSearch={setSearch}
/>



      <Routes>

      <Route path="/admin-dashboard" element={<AdminLayout />}>
  <Route index element={<AdminDashboard />} />
</Route>

<Route path="/admin-products" element={<AdminLayout />}>
  <Route index element={<AdminProducts />} />
</Route>

<Route path="/admin-add-product" element={<AdminLayout />}>
  <Route index element={<AddProduct />} />
</Route>

<Route path="/admin-orders" element={<AdminLayout />}>
  <Route index element={<AdminOrders />} />
</Route>

<Route path="/admin-users" element={<AdminLayout />}>
  <Route index element={<AdminUsers />} />
</Route>


<Route
  path="/order"
  element={
    <OrderPage
      cart={cart}
      user={user}
      setCart={setCart}
    />
  }
/>

        {/* Product details */}
        <Route
  path="/"
  element={
    <>
      <Hero />
      <Categories />
      <Products addToCart={addToCart} search={search} />
      <Footer />
    </>
  }
/>
<Route
  path="/product/:id"
  element={<ProductDetails addToCart={addToCart} />}
/>


        {/* Order success */}
        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />

        {/* Cart */}
        <Route
  path="/cart"
  element={<Cart cart={cart} setCart={setCart} />}
/>


        {/* Login */}
        <Route
          path="/login"
          element={<Login setUser={setUser} />}
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={<Signup setUser={setUser} />}
        />

        {/* User dashboard */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute user={user}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin dashboard */}
        <Route
  path="/admin-dashboard"
  element={
    isAdmin ?
      <AdminDashboard />
      :
      <Login setUser={setUser} />
  }
/>


        {/* Admin products */}
        <Route
  path="/admin-products"
  element={
    isAdmin ?
      <AdminProducts />
      :
      <Login setUser={setUser} />
  }
/>


      </Routes>

    </BrowserRouter>

  );
}

export default App;
