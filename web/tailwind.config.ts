/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0b1220",
          900: "#111b2e",
          800: "#1a2740",
          700: "#243352",
        },
        parchment: "#f4efe6",
        brass: {
          DEFAULT: "#c4a35a",
          soft: "#d4bc7a",
          dim: "#8a7340",
        },
        sea: {
          DEFAULT: "#2a6f7a",
          bright: "#3d8f9c",
        },
        muted: "#8b97a8",
        line: "#2a3548",
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "system-ui", "sans-serif"],
        display: ["Libre Baskerville", "Georgia", "serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
