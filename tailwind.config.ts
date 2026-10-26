import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F7F3EA",
        paper: "#FFFDF8",
        ink: "#1C2321",
        muted: "#64706B",
        clover: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          500: "#16A34A",
          600: "#15803D",
          700: "#166534",
          800: "#14532D",
          900: "#052E16",
        },
        coral: {
          100: "#FFEDD5",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
        },
        mist: "#E7E5DF",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 24px 70px -28px rgba(28, 35, 33, 0.32)",
        soft: "0 10px 34px -18px rgba(28, 35, 33, 0.24)",
      },
      backgroundImage: {
        "grid-soft":
          "linear-gradient(to right, rgba(28, 35, 33, 0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(28, 35, 33, 0.055) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-soft": "48px 48px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.55s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
