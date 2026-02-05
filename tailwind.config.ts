import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4f7ff",
          500: "#4f6ef7",
          700: "#2e44c6"
        }
      }
    }
  },
  plugins: []
};

export default config;
