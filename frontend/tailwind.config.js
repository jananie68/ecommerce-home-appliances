/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#4F46E5",
          secondary: "#06B6D4",
          accent: "#F59E0B",
          surface: "#EEF2FF",
          ink: "#0F172A"
        }
      },
      boxShadow: {
        panel: "0 18px 45px rgba(79, 70, 229, 0.12)",
        soft: "0 10px 30px rgba(15, 23, 42, 0.08)"
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #4F46E5 0%, #06B6D4 60%, #F59E0B 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, rgba(79,70,229,0.08) 0%, rgba(6,182,212,0.08) 100%)"
      }
    }
  },
  plugins: []
};
