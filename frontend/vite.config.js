import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@admin": path.resolve(__dirname, "../admin-dashboard/src"),
      "@userdash": path.resolve(__dirname, "../user-dashboard/src"),
      react: path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(__dirname, "./node_modules/react/jsx-runtime.js"),
      "react/jsx-dev-runtime": path.resolve(__dirname, "./node_modules/react/jsx-dev-runtime.js"),
      "react-router-dom": path.resolve(__dirname, "./node_modules/react-router-dom"),
      "react-hot-toast": path.resolve(__dirname, "./node_modules/react-hot-toast"),
      "lucide-react": path.resolve(__dirname, "./node_modules/lucide-react")
    },
    dedupe: ["react", "react-dom"]
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, "..")]
    }
  }
});
