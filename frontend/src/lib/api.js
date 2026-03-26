import axios from "axios";

function trimTrailingSlash(value = "") {
  return value.replace(/\/+$/, "");
}

export const BACKEND_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
);
export const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_URL || `${BACKEND_BASE_URL}/api`
);

function getStoredToken() {
  return localStorage.getItem("spa-token") || localStorage.getItem("token");
}

export const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function getAssetUrl(pathname = "") {
  if (!pathname) {
    return "";
  }

  if (pathname.startsWith("http://") || pathname.startsWith("https://")) {
    return pathname;
  }

  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${BACKEND_BASE_URL}${normalizedPath}`;
}
