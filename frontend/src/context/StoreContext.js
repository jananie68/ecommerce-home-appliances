import React, { createContext, useContext, useEffect, useState } from "react";
import { getProfile, updateWishlist } from "../services/api";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart") || "[]"));
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      getProfile()
        .then(({ data }) => setWishlist(data.wishlist || []))
        .catch(() => setWishlist([]));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setWishlist([]);
    }
  }, [user]);

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item._id === product._id);
      if (existing) {
        return current.map((item) =>
          item._id === product._id ? { ...item, qty: (item.qty || 1) + 1 } : item
        );
      }

      return [...current, { ...product, qty: 1 }];
    });
  };

  const updateCartQty = (productId, qty) => {
    setCart((current) =>
      current
        .map((item) => (item._id === productId ? { ...item, qty: Math.max(1, qty) } : item))
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId) => {
    setCart((current) => current.filter((item) => item._id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = async (product) => {
    if (!user) {
      return false;
    }

    const { data } = await updateWishlist(product._id);
    setWishlist(data.wishlist || []);
    return true;
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  return (
    <StoreContext.Provider
      value={{
        user,
        setUser,
        cart,
        wishlist,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        toggleWishlist,
        logout
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
