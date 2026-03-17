import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    "../admin-dashboard/src/**/*.{js,jsx}",
    "../user-dashboard/src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"]
      },
      colors: {
        ink: "#091122",
        coral: "#f7643b",
        aqua: "#59d1d8",
        sand: "#f4efe7",
        gold: "#f6c453"
      },
      boxShadow: {
        soft: "0 20px 45px rgba(9, 17, 34, 0.08)",
        glow: "0 18px 60px rgba(247, 100, 59, 0.18)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top, rgba(246, 196, 83, 0.28), transparent 26%), radial-gradient(circle at 80% 0%, rgba(89, 209, 216, 0.22), transparent 24%), linear-gradient(135deg, #091122 0%, #10203b 48%, #173868 100%)"
      }
    }
  },
  plugins: [forms]
};
