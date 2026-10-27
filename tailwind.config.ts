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
        paper: "#060B09",
        surface: "#0D1512",
        ink: "#F1F4F0",
        muted: "#A0AEA6",
        line: "#1C2A24",
        wash: "#131E19",
        accent: "#4CE3A6",
        gold: "#E6C77B",
        positive: {
          DEFAULT: "#4CE3A6",
          soft: "#0D2A20",
          ink: "#B9F8DD",
        },
        negative: {
          DEFAULT: "#F07A70",
          soft: "#2B1517",
          ink: "#FFD3CF",
        },
        warn: {
          DEFAULT: "#E9BC70",
          soft: "#2A2114",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        none: "0px",
        sm: "6px",
        DEFAULT: "10px",
        md: "10px",
        lg: "16px",
        xl: "20px",
        "2xl": "26px",
        full: "9999px",
      },
      maxWidth: {
        canvas: "1120px",
        form: "440px",
      },
    },
  },
  plugins: [],
};

export default config;
