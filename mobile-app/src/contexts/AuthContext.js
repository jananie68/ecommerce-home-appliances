import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { client, setAuthToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("spa-token");
        if (storedToken) {
          setAuthToken(storedToken);
          const { data } = await client.get("/auth/me");
          setUser(data.user);
        }
      } catch (error) {
        await AsyncStorage.removeItem("spa-token");
        setAuthToken(null);
      } finally {
        setInitializing(false);
      }
    };

    loadToken();
  }, []);

  async function login(credentials) {
    try {
      const { data } = await client.post("/auth/login", credentials);
      setUser(data.user);
      setAuthToken(data.token);
      await AsyncStorage.setItem("spa-token", data.token);
      return data.user;
    } catch (error) {
      const message = error?.response?.data?.message || "Unable to sign in.";
      Alert.alert("Sign in failed", message);
      throw error;
    }
  }

  async function logout() {
    setUser(null);
    setAuthToken(null);
    await AsyncStorage.removeItem("spa-token");
  }

  return (
    <AuthContext.Provider value={{ user, initializing, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
