/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bank: {
          bg: "#F7F9FB",
          card: "#FFFFFF",
          ink: "#0C2340",
          muted: "#5B6B7C",
          border: "#D9E2EC",
          green: "#007A33",
          greenSoft: "#E8F5EC",
          navy: "#0C2340",
          navySoft: "#E8EEF5",
          warn: "#B45309",
          danger: "#B91C1C",
        },
        // keep brand.* aliases so older classnames still resolve during transition
        brand: {
          dark: "#F7F9FB",
          card: "#FFFFFF",
          border: "#D9E2EC",
          muted: "#5B6B7C",
          accent: "#007A33",
          red: "#B91C1C",
        },
      },
      fontFamily: {
        sans: ["Source Sans 3", "Segoe UI", "sans-serif"],
        display: ["Source Serif 4", "Georgia", "serif"],
      },
      boxShadow: {
        bank: "0 1px 2px rgba(12, 35, 64, 0.04), 0 4px 12px rgba(12, 35, 64, 0.04)",
      },
    },
  },
  plugins: [],
};
