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
        paper: "#F7F7F7",
        surface: "#FFFFFF",
        ink: "#0A0A0A",
        muted: "#6B6B6B",
        line: "#E6E6E6",
        wash: "#EFEFEF",
        accent: "#1D5FBF",
        positive: {
          DEFAULT: "#2E7D32",
          soft: "#DCFAE5",
          ink: "#04250E",
        },
        negative: {
          DEFAULT: "#C4242A",
          soft: "#FFEDEA",
          ink: "#831C1E",
        },
        warn: {
          DEFAULT: "#92400E",
          soft: "#FFFBEB",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        none: "0px",
        sm: "4px",
        DEFAULT: "6px",
        md: "6px",
        lg: "8px",
        xl: "10px",
        "2xl": "12px",
        full: "9999px",
      },
      maxWidth: {
        canvas: "1080px",
        form: "420px",
      },
    },
  },
  plugins: [],
};

export default config;
