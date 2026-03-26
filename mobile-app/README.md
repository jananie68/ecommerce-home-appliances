# Ecommerce Mobile (Expo)

Lightweight Expo client for browsing products and signing in to the Sri Palani Andavan Electronics API.

## Prerequisites
- Node.js 18+
- Expo CLI (`npm install -g expo`)
- Backend running and reachable (defaults to http://localhost:5000)

## Environment
The API base URL and asset host are read from public env vars:

- `EXPO_PUBLIC_API_URL` (default: `http://localhost:5000/api`)
- `EXPO_PUBLIC_BACKEND_URL` (default: `http://localhost:5000`)

You can pass them inline when starting Expo:

```bash
EXPO_PUBLIC_API_URL="http://192.168.1.10:5000/api" \
EXPO_PUBLIC_BACKEND_URL="http://192.168.1.10:5000" \
expo start --tunnel
```

## Getting Started

```bash
cd mobile-app
npm install
npm run start  # choose "Run on iOS simulator", "Run on Android device/emulator", or "Run in web"
```

Use the demo credentials from the root README to sign in, or create a new account via the API/frontend.

## Screens
- Product list with pull-to-refresh
- Product details (images, price, description, specs)
- Sign-in that reuses the existing `/auth/login` endpoint and stores the token in AsyncStorage
