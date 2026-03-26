import axios from "axios";
import Constants from "expo-constants";

const extras = Constants.expoConfig?.extra || {};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || extras.apiUrl || "http://localhost:5000/api";
const BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL || extras.backendUrl || "http://localhost:5000";

export const client = axios.create({
  baseURL: API_BASE_URL
});

let authToken = null;

export function setAuthToken(token) {
  authToken = token || null;

  if (authToken) {
    client.defaults.headers.common.Authorization = `Bearer ${authToken}`;
  } else {
    delete client.defaults.headers.common.Authorization;
  }
}

client.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export function buildImageUrl(pathname = "") {
  if (!pathname) return null;
  if (pathname.startsWith("http://") || pathname.startsWith("https://")) {
    return pathname;
  }
  return `${BACKEND_BASE_URL}${pathname}`;
}

export function getDefaults() {
  return { apiBaseUrl: API_BASE_URL, backendBaseUrl: BACKEND_BASE_URL };
}
