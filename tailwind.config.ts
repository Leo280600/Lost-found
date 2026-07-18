import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f9f2",
          100: "#dbf0e0",
          200: "#b8e0c3",
          300: "#8bc9a0",
          400: "#5aab78",
          500: "#398c58",
          600: "#287044",
          700: "#1f5937",
          800: "#1a472e",
          900: "#153b27",
        },
      },
      backdropBlur: { xs: "2px" },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 41, 55, 0.12)",
        "glass-lg": "0 12px 48px 0 rgba(31, 41, 55, 0.18)",
      },
      borderRadius: { xl2: "1.25rem" },
      keyframes: {
        "fade-in": { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
      animation: { "fade-in": "fade-in 0.4s ease-out" },
    },
  },
  plugins: [],
};

export default config;
