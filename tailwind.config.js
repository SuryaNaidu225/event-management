/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1e1b4b",
        sand: "#fbf6ef",
        blush: {
          50: "#fff5f7",
          100: "#ffe4ec",
          200: "#fecdd6",
          400: "#f37ca5",
          500: "#e95485",
        },
        peach: {
          50: "#fff8f1",
          100: "#ffe6d1",
          200: "#ffccaa",
          400: "#ff9d63",
          500: "#f7792b",
        },
        mint: {
          50: "#f1fbf5",
          100: "#d4f5e4",
          200: "#a0e8c8",
          400: "#4cc999",
          500: "#2fa677",
        },
        sky: {
          50: "#edf8ff",
          100: "#d4ecff",
          200: "#a8d8ff",
          400: "#5fb3ff",
        },
        lavender: {
          50: "#f5f5ff",
          100: "#e7e7ff",
          200: "#c9c9ff",
          400: "#8d8dff",
        },
      },
      boxShadow: {
        floating: "0 20px 45px rgba(15, 23, 42, 0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
