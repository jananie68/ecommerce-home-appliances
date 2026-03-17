import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("spa-token");

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        localStorage.removeItem("spa-token");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function handleAuth(path, payload, successMessage) {
    const response = await api.post(path, payload);
    localStorage.setItem("spa-token", response.data.token);
    setUser(response.data.user);
    toast.success(successMessage);
    return response.data.user;
  }

  async function login(credentials) {
    return handleAuth("/auth/login", credentials, "Welcome back.");
  }

  async function signup(details) {
    return handleAuth("/auth/signup", details, "Your account is ready.");
  }

  async function refreshUser() {
    const response = await api.get("/auth/me");
    setUser(response.data.user);
    return response.data.user;
  }

  async function updateProfile(payload) {
    const response = await api.put("/auth/profile", payload);
    setUser(response.data.user);
    toast.success(response.data.message || "Profile updated.");
    return response.data.user;
  }

  async function toggleWishlist(productId) {
    const response = await api.post(`/users/wishlist/${productId}`);
    setUser((currentUser) =>
      currentUser ? { ...currentUser, wishlist: response.data.wishlist } : currentUser
    );
    return response.data.wishlist;
  }

  function logout() {
    localStorage.removeItem("spa-token");
    setUser(null);
    toast.success("Signed out successfully.");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
        signup,
        toggleWishlist,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
